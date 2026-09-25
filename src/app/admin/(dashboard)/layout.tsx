import Link from 'next/link';
import { signOut } from '@/app/admin/actions';
import { Logo } from '@/components/brand/Logo';
import { AdminNav } from '@/components/admin/AdminNav';
import { requireAdmin } from '@/lib/admin/auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <>
      <header className="border-b border-anthracite">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3 md:px-8">
          <Link href="/admin" className="flex items-center gap-3" aria-label="Back-office VOIZ — projets">
            <Logo className="h-9 w-auto text-ivoire" title="VOIZ" />
            <span className="text-[11px] font-bold tracking-[.22em] text-orange uppercase">
              Back-office
            </span>
          </Link>
          <AdminNav />
          <div className="ml-auto flex items-center gap-4 text-[13px]">
            <a
              href="/fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-ivoire"
            >
              Voir le site ↗
            </a>
            <span className="hidden text-muted md:inline">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="cursor-pointer font-semibold transition-colors hover:text-orange"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-5 py-8 md:px-8 md:py-10">{children}</main>
    </>
  );
}
