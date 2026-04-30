import { PublicHeader } from '@/components/layout/public-header';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-app">
      <PublicHeader />
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}
