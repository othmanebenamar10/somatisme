import { Link } from 'wouter';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const footerLinks = [
  {
    title: 'Services',
    links: [
      { label: 'Automatisme industriel', href: '/services/automation' },
      { label: 'Régulation & instrumentation', href: '/services/regulation' },
      { label: 'Installation électrique', href: '/services/electrical' },
      { label: 'Maintenance industrielle', href: '/services/maintenance' },
    ],
  },
  {
    title: 'Entreprise',
    links: [
      { label: 'À propos', href: '/about' },
      { label: 'Projets', href: '/projects' },
      { label: 'Produits', href: '/products' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-700 bg-slate-900 text-slate-300">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/">
            <a className="text-lg font-bold tracking-wide text-white">SOMATISME</a>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">{t('footer.tagline')}</p>
        </div>

        {footerLinks.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="text-sm font-semibold text-white">{group.title}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}><a className="transition-colors hover:text-cyan-300">{link.label}</a></Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="text-sm font-semibold text-white">Coordonnées</h2>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-cyan-300" />
              <a href="tel:+212679825646" className="hover:text-cyan-300">+212 6 79 82 56 46</a>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-cyan-300" />
              <a href="mailto:somatisme@gmail.com" className="hover:text-cyan-300">somatisme@gmail.com</a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-cyan-300" />
              <span>{t('footer.address')}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-700">
        <div className="container flex flex-col gap-3 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} SOMATISME. {t('footer.copyright')}</p>
          <div className="flex gap-5">
            <Link href="/privacy"><a className="hover:text-white">{t('footer.privacy')}</a></Link>
            <Link href="/terms"><a className="hover:text-white">{t('footer.terms')}</a></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
