'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileNav from '@/components/layout/MobileNav';
import HomeBaseModal from '@/components/layout/HomeBaseModal';
import SetAlertModal from '@/components/layout/SetAlertModal';
import NewTripModal from '@/components/layout/NewTripModal';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [homeBase, setHomeBase] = useState('Tulsa, OK — TUL');
  const [showHomeBaseModal, setShowHomeBaseModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showNewTripModal, setShowNewTripModal] = useState(false);

  function handleHomeBaseSelect(display: string, code: string, entityId: string) {
    setHomeBase(display);
    console.log('Home base updated:', code, entityId);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar: hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar
          homeBase={homeBase}
          userName="Emily M."
          onHomeBaseClick={() => setShowHomeBaseModal(true)}
        />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden bg-cream">
        <Topbar
          pathname={pathname}
          onSetAlert={() => setShowAlertModal(true)}
          onNewTrip={() => setShowNewTripModal(true)}
        />
        {/* Content area: extra bottom padding on mobile for tab bar */}
        <div className="flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-7 pb-20 md:pb-7">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Modals */}
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
