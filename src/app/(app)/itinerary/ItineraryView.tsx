'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TripHero from '@/components/itinerary/TripHero';
import DayScroller from '@/components/itinerary/DayScroller';
import TimelineItem from '@/components/itinerary/TimelineItem';
import DealFinder from '@/components/itinerary/DealFinder';
import AddDestinationModal from '@/components/itinerary/AddDestinationModal';
import { Card, CardPad, CardHeader } from '@/components/ui/Card';
import type { Trip, TripDestination, ItineraryItem } from '@/types/supabase';

type ItineraryViewProps = {
  trip: Trip;
  destinations: TripDestination[];
  items: ItineraryItem[];
  homeAirportCode?: string;
  homeEntityId?: string;
};

const typeOptions = [
  { value: 'flight', label: 'Flight', emoji: '✈️' },
  { value: 'hotel', label: 'Hotel', emoji: '🏨' },
  { value: 'food', label: 'Food & Drink', emoji: '🍽️' },
  { value: 'activity', label: 'Activity', emoji: '⭐' },
  { value: 'transport', label: 'Transport', emoji: '🚕' },
  { value: 'other', label: 'Other', emoji: '📌' },
];

export default function ItineraryView({ trip, destinations, items, homeAirportCode, homeEntityId }: ItineraryViewProps) {
  const router = useRouter();
  const [activeDestIndex, setActiveDestIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddDestModal, setShowAddDestModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formType, setFormType] = useState('activity');
  const [formCost, setFormCost] = useState('');
  const [formDate, setFormDate] = useState('');

  function resetForm() {
    setFormTitle('');
    setFormSubtitle('');
    setFormTime('');
    setFormType('activity');
    setFormCost('');
    setFormDate('');
    setEditingItem(null);
  }

  function openAdd() {
    resetForm();
    const dest = destinations[activeDestIndex];
    if (dest?.arrival_date) setFormDate(dest.arrival_date);
    else if (trip.start_date) setFormDate(trip.start_date);
    setShowAddModal(true);
  }

  function openEdit(item: ItineraryItem) {
    setFormTitle(item.title);
    setFormSubtitle(item.subtitle || '');
    setFormTime(item.time_label || '');
    setFormType(item.type || 'activity');
    setFormCost(item.cost ? String(item.cost) : '');
    setFormDate(item.date || '');
    setEditingItem(item);
    setShowAddModal(true);
  }

  async function handleSave() {
    if (!formTitle.trim()) return;
    setLoading(true);
    const activeDest = destinations[activeDestIndex];

    const body = {
      trip_id: trip.id,
      destination_id: activeDest?.id,
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || null,
      time_label: formTime.trim() || null,
      type: formType,
      emoji: typeOptions.find(t => t.value === formType)?.emoji || '📌',
      cost: formCost ? Number(formCost) : null,
      date: formDate || null,
      sort_order: editingItem?.sort_order ?? items.filter(i => i.destination_id === activeDest?.id).length,
    };

    try {
      if (editingItem) {
        await fetch(`/api/itinerary/${editingItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        await fetch('/api/itinerary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
      setShowAddModal(false);
      resetForm();
      router.refresh();
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(itemId: string) {
    if (!confirm('Delete this item?')) return;
    try {
      await fetch(`/api/itinerary/${itemId}`, { method: 'DELETE' });
      router.refresh();
    } catch {
      // silent
    }
  }

  // Show DealFinder if trip has a budget
  const showDealFinder = trip.total_budget && homeEntityId && homeAirportCode;

  if (destinations.length === 0) {
    return (
      <div>
        <TripHero trip={trip} destinations={destinations} />

        {showDealFinder && (
          <DealFinder
            tripId={trip.id}
            budget={trip.total_budget}
            homeEntityId={homeEntityId!}
            homeAirportCode={homeAirportCode!}
          />
        )}

        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-4xl mb-3">📍</div>
            <div className="font-display text-lg font-medium text-wtext mb-1">No destinations added</div>
            <div className="text-sm text-wtext-3 mb-4">Add destinations to start building your itinerary.</div>
            <button
              onClick={() => setShowAddDestModal(true)}
              className="text-xs px-4 py-2 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-white font-medium cursor-pointer hover:opacity-90 transition-all"
            >
              + Add Destination
            </button>
          </div>
        </div>

        <AddDestinationModal tripId={trip.id} isOpen={showAddDestModal} onClose={() => setShowAddDestModal(false)} />
      </div>
    );
  }

  const activeDest = destinations[activeDestIndex];

  const activityCounts: Record<string, number> = {};
  destinations.forEach((d) => {
    activityCounts[d.id] = items.filter((i) => i.destination_id === d.id).length;
  });

  const destItems = items.filter((i) => i.destination_id === activeDest.id);

  const groupedByDate: Record<string, ItineraryItem[]> = {};
  destItems.forEach((item) => {
    const key = item.date || 'unscheduled';
    if (!groupedByDate[key]) groupedByDate[key] = [];
    groupedByDate[key].push(item);
  });

  // Sort items within each day by time_label
  function parseTime(t: string | null): number {
    if (!t) return 9999;
    const match = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!match) return 9999;
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = (match[3] || '').toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  Object.keys(groupedByDate).forEach((date) => {
    groupedByDate[date].sort((a, b) => parseTime(a.time_label) - parseTime(b.time_label));
  });

  const sortedDates = Object.keys(groupedByDate).sort();

  return (
    <div>
      <TripHero trip={trip} destinations={destinations} />

      {showDealFinder && (
        <DealFinder
          tripId={trip.id}
          budget={trip.total_budget}
          homeEntityId={homeEntityId!}
          homeAirportCode={homeAirportCode!}
        />
      )}

      {/* Day Scroller with Add Destination button */}
      <div className="flex items-start gap-2 mb-4">
        <div className="flex-1 overflow-x-auto">
          <DayScroller
            destinations={destinations}
            activeIndex={activeDestIndex}
            onSelect={setActiveDestIndex}
            activityCounts={activityCounts}
          />
        </div>
        <button
          onClick={() => setShowAddDestModal(true)}
          className="flex-shrink-0 w-[80px] sm:w-[100px] h-[80px] sm:h-[90px] border-2 border-dashed border-wborder-2 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-gold hover:bg-[rgba(184,150,90,0.04)] transition-all mt-1"
        >
          <span className="text-lg text-wtext-3">+</span>
          <span className="text-[10px] text-wtext-3 font-medium">Add City</span>
        </button>
      </div>

      {/* Add Activity Button */}
      <div className="flex justify-end mb-3">
        <button
          onClick={openAdd}
          className="text-xs px-4 py-2 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-white font-medium cursor-pointer hover:opacity-90 transition-all"
        >
          + Add Activity
        </button>
      </div>

      {sortedDates.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-3xl mb-3">📋</div>
            <div className="text-sm font-medium text-wtext mb-1">No activities yet for {activeDest.city}</div>
            <div className="text-xs text-wtext-3">Click &quot;+ Add Activity&quot; above to start planning.</div>
          </div>
        </div>
      ) : (
        sortedDates.map((date, dateIdx) => {
          const dayItems = groupedByDate[date];
          const dayNumber = activeDest.day_start
            ? activeDest.day_start + dateIdx
            : dateIdx + 1;
          const dateLabel = date !== 'unscheduled'
            ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })
            : 'Unscheduled';

          return (
            <Card key={date} className="self-start mb-4">
              <CardPad>
                <CardHeader title={`${activeDest.city} — Day ${dayNumber} · ${dateLabel}`} />
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-wborder-2" />
                  {dayItems.map((item) => (
                    <div key={item.id} className="group relative">
                      <TimelineItem item={item} />
                      <div className="absolute top-2 right-0 hidden group-hover:flex gap-1.5">
                        <button onClick={() => openEdit(item)} className="text-[10px] text-gold hover:text-gold-3 cursor-pointer bg-white border border-wborder rounded-md px-2 py-1">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-[10px] text-[#C83C3C] hover:text-[#a52a2a] cursor-pointer bg-white border border-wborder rounded-md px-2 py-1">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardPad>
            </Card>
          );
        })
      )}

      {/* Add/Edit Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[rgba(28,26,22,0.5)] z-50 flex items-center justify-center p-4" onClick={() => { setShowAddModal(false); resetForm(); }}>
          <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[420px] shadow-[0_20px_60px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
            <div className="font-display text-xl font-medium mb-1.5">
              {editingItem ? 'Edit Activity' : 'Add Activity'}
            </div>
            <div className="text-xs text-wtext-3 mb-5">
              {editingItem ? 'Update this item in your itinerary.' : `Add to ${activeDest.city} itinerary.`}
            </div>
            <div className="flex flex-col gap-3.5">
              <div>
                <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Title</label>
                <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" placeholder="Eiffel Tower Visit" />
              </div>
              <div>
                <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Details</label>
                <input type="text" value={formSubtitle} onChange={(e) => setFormSubtitle(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" placeholder="Summit access · Tickets pre-booked" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Type</label>
                  <select value={formType} onChange={(e) => setFormType(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2">
                    {typeOptions.map(o => <option key={o.value} value={o.value}>{o.emoji} {o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Time</label>
                  <input type="text" value={formTime} onChange={(e) => setFormTime(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" placeholder="02:00 PM" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Cost (USD)</label>
                  <input type="number" value={formCost} onChange={(e) => setFormCost(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" placeholder="38" />
                </div>
                <div>
                  <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Date</label>
                  <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" />
                </div>
              </div>
              <button onClick={handleSave} disabled={!formTitle.trim() || loading} className="w-full py-2.5 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-sm text-white font-medium font-body transition-all hover:opacity-90 disabled:opacity-40 cursor-pointer mt-1">
                {loading ? 'Saving...' : editingItem ? 'Update Activity' : 'Add Activity'}
              </button>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="w-full py-2 border border-wborder rounded-lg bg-transparent text-[13px] text-wtext-2 cursor-pointer font-body transition-all hover:border-gold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Destination Modal */}
      <AddDestinationModal tripId={trip.id} isOpen={showAddDestModal} onClose={() => setShowAddDestModal(false)} />
    </div>
  );
}
