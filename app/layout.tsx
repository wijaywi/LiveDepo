import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LiveDepo — Zero-Latency Cross-Examination Copilot',
  description: 'Real-time semantic cross-examination copilot for live legal depositions, powered by Moss.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
