import type { Metadata } from 'next';
import { PasswordForm } from '@/components/admin/PasswordForm';
import { requireAdmin } from '@/lib/admin/auth';

export const metadata: Metadata = { title: 'Compte' };

export default async function AccountPage() {
  const { user } = await requireAdmin();

  return (
    <div className="max-w-[420px]">
      <h1 className="m-0 text-[32px] font-black tracking-[-.02em]">Compte</h1>
      <p className="m-0 mt-1 mb-8 text-[14px] text-muted">
        Connecté en tant que <span className="text-ivoire">{user.email}</span>.
      </p>
      <PasswordForm />
    </div>
  );
}
