'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Projets', match: (p: string) => p === '/admin' || p.startsWith('/admin/projects') },
  { href: '/admin/tags', label: 'Catégories', match: (p: string) => p.startsWith('/admin/tags') },
  { href: '/admin/account', label: 'Compte', match: (p: string) => p.startsWith('/admin/account') },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Back-office" className="flex flex-wrap gap-1">
      {LINKS.map((link) => {
        const active = link.match(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              active ? 'bg-ivoire text-noir' : 'text-muted hover:text-ivoire'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
