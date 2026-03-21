import type { ItineraryItem } from '@/types/supabase';

const tagStyles: Record<string, { bg: string; text: string; label: string }> = {
  flight: { bg: 'bg-[rgba(77,130,200,0.1)]', text: 'text-[#4D82C8]', label: '✈️ Flight' },
  hotel: { bg: 'bg-[rgba(184,150,90,0.12)]', text: 'text-gold-3', label: '🏨 Hotel' },
  food: { bg: 'bg-[rgba(180,100,60,0.1)]', text: 'text-[#B4643C]', label: '🍽️ Food' },
  activity: { bg: 'bg-[rgba(60,120,80,0.1)]', text: 'text-[#3C7850]', label: '✨ Activity' },
  transport: { bg: 'bg-[rgba(100,100,100,0.1)]', text: 'text-wtext-2', label: '🚄 Transport' },
};

export default function TimelineItem({ item }: { item: ItineraryItem }) {
  const tag = tagStyles[item.type] || tagStyles.activity;

  return (
    <div className="flex gap-4 mb-4 relative">
      {/* Dot with emoji in gold-bordered circle */}
      <div className="w-8 h-8 rounded-full flex-shrink-0 bg-white border-2 border-gold flex items-center justify-center text-sm z-10">
        {item.emoji || '📌'}
      </div>

      {/* Content card */}
      <div className="flex-1 bg-white border border-wborder rounded-[10px] px-3.5 py-3">
        <div className="text-[10px] text-wtext-3 tracking-[0.08em] mb-1 font-medium uppercase">
          {item.time_label}
        </div>
        <div className="text-[13px] font-medium text-wtext mb-[2px]">
          {item.title}
        </div>
        {item.subtitle && (
          <div className="text-[11px] text-wtext-3">{item.subtitle}</div>
        )}
        <span
          className={`inline-flex items-center gap-1 text-[10px] px-2 py-[2px] rounded-full mt-1.5 font-medium ${tag.bg} ${tag.text}`}
        >
          {tag.label}
        </span>
      </div>
    </div>
  );
}
