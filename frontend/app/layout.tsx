import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pratyaksh - Bringing Your Shadow Data Into The Light',
  description: 'Discover forgotten online accounts, visualize your digital footprint, and take back control of your privacy with one-click GDPR/CCPA deletion requests.',
  keywords: ['privacy', 'GDPR', 'data deletion', 'digital footprint', 'online accounts', 'security'],
  authors: [{ name: 'Pratyaksh Team' }],
  openGraph: {
    title: 'Pratyaksh - Bringing Your Shadow Data Into The Light',
    description: 'Discover forgotten online accounts and take back control of your privacy.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark text-light">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1E293B',
              color: '#F1F5F9',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#F1F5F9',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#F1F5F9',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
