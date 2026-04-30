import { PublicHeader } from '@/components/layout/public-header';
import { MeshGradient } from '@/components/ui/mesh-gradient';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-app relative overflow-hidden">
      <MeshGradient />
      <PublicHeader />
      <main className="pt-24 relative z-10">
        {children}
      </main>
    </div>
  );
}
