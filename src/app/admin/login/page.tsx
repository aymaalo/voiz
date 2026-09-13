import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { signOut } from '@/app/admin/actions';
import { Logo } from '@/components/brand/Logo';
import { LoginForm } from '@/components/admin/LoginForm';
import { buttonClass } from '@/components/admin/ui';
import { getAdminSession } from '@/lib/admin/auth';

export const metadata: Metadata = { title: 'Connexion' };

export default async function LoginPage() {
  const { user, isAdmin } = await getAdminSession();
  if (user && isAdmin) redirect('/admin');

  return (
    <main className="mx-auto flex min-h-screen max-w-[400px] flex-col justify-center px-5 py-16">
      <Logo className="mb-8 h-14 w-auto self-start text-ivoire" />
      <h1 className="m-0 mb-8 text-[28px] font-black tracking-[-.02em]">Back-office</h1>

      {user ? (
        // Signed in, but not on the admins allowlist.
        <div className="flex flex-col gap-5">
          <p role="alert" className="m-0 rounded-[4px] border border-orange/60 bg-orange/10 px-4 py-3 text-[13px]">
            Le compte <strong>{user.email}</strong> n’a pas accès au back-office.
          </p>
          <form action={signOut}>
            <button type="submit" className={buttonClass.secondary}>
              Se déconnecter
            </button>
          </form>
        </div>
      ) : (
        <LoginForm />
      )}
    </main>
  );
}
