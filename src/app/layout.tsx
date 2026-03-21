import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WANDER — Your Intelligent Travel Companion',
  description: 'Flight tracking, itinerary building, AI companion, budget tracking, and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
