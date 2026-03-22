'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileNav from '@/components/layout/MobileNav';
import HomeBaseModal from '@/components/layout/HomeBaseModal';
import SetAlertModal from '@/components/layout/SetAlertModal';
import NewTripModal from '@/components/layout/NewTripModal';
import type { Profile, Trip } from '@/types/supabase';

type AppShellProps = {
  profile: Profile | null;
  trips: Trip[];
  wishlistCount: number;
  children: React.ReactNode;
};

export default function AppShell({ profile, trips, wishlistCount, children }: AppShellProps) {
  const pathname = usePathname();
  const homeBaseDisplay = profile
    ? `${profile.home_airport_name} — ${profile.home_airport_code}`
    : 'Tulsa, OK — TUL';
  const [homeBase, setHomeBase] = useState(homeBaseDisplay);
  const [showHomeBaseModal, setShowHomeBaseModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showNewTripModal, setShowNewTripModal] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const userName = profile?.name || 'Traveler';
  const displayName = userName.split(' ').length > 1
    ? `${userName.split(' ')[0]} ${userName.split(' ')[1][0]}.`
    : userName;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleHomeBaseSelect(display: string, code: string, entityId: string) {
    setHomeBase(display);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          homeBase={homeBase}
          userName={displayName}
          trips={trips}
          wishlistCount={wishlistCount}
          onHomeBaseClick={() => setShowHomeBaseModal(true)}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-[rgba(28,26,22,0.5)]" onClick={() => setShowMobileSidebar(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl overflow-y-auto animate-slide-in">
            <Sidebar
              homeBase={homeBase}
              userName={displayName}
              trips={trips}
              wishlistCount={wishlistCount}
              onHomeBaseClick={() => { setShowMobileSidebar(false); setShowHomeBaseModal(true); }}
              onNavClick={() => setShowMobileSidebar(false)}
            />
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden bg-cream">
        <Topbar
          pathname={pathname}
          trips={trips}
          wishlistCount={wishlistCount}
          homeAirportCode={profile?.home_airport_code || 'TUL'}
          onSetAlert={() => setShowAlertModal(true)}
          onNewTrip={() => setShowNewTripModal(true)}
          onMenuClick={() => setShowMobileSidebar(true)}
        />
        <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 md:px-8 md:py-7 pb-20 md:pb-7">
          {children}
        </div>
      </main>

      <MobileNav />

      <HomeBaseModal
        isOpen={showHomeBaseModal}
        onClose={() => setShowHomeBaseModal(false)}
        onSelect={handleHomeBaseSelect}
      />
      <SetAlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
      />
      <NewTripModal
        isOpen={showNewTripModal}
        onClose={() => setShowNewTripModal(false)}
      />
    </div>
  );
}
