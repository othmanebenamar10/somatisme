import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const navItems = [
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.services'), href: '/services' },
    { label: t('nav.projects'), href: '/projects' },
    { label: t('nav.products'), href: '/products' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-3" aria-label="Somatisme, accueil">
            <img src="/logo.png" alt="SOMATISME — automatisme industriel" className="h-auto w-36 object-contain" />
          </a>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a className="text-sm font-medium text-slate-700 transition-colors hover:text-cyan-700">{item.label}</a>
            </Link>
          ))}
          <Link href="/contact">
            <a className="rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-800">{t('cta.contact')}</a>
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="rounded-md border border-slate-300 p-2 text-slate-800 lg:hidden"
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <nav className="border-t border-slate-200 bg-white px-6 py-4 lg:hidden" aria-label="Navigation mobile">
          <div className="container flex flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a onClick={() => setIsOpen(false)} className="rounded px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">{item.label}</a>
              </Link>
            ))}
            <Link href="/contact">
              <a onClick={() => setIsOpen(false)} className="mt-2 rounded-md bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white">{t('cta.contact')}</a>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
