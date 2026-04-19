import { Link } from 'wouter';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <Link href="/">
              <a className="inline-block mb-4 hover:opacity-80 transition-opacity">
                <img src="/logo-somatisme.png" alt="SOMATISME" className="h-12 w-auto object-contain brightness-0 invert opacity-90" />
              </a>
            </Link>
            <p className="text-sm opacity-90 mb-4">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/fouad-ben-amar-20295354?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/automation">
                  <a className="hover:opacity-80 transition-opacity">Automatisme Industriel</a>
                </Link>
              </li>
              <li>
                <Link href="/services/regulation">
                  <a className="hover:opacity-80 transition-opacity">Régulation & Instrumentation</a>
                </Link>
              </li>
              <li>
                <Link href="/services/electrical">
                  <a className="hover:opacity-80 transition-opacity">Installation Électrique</a>
                </Link>
              </li>
              <li>
                <Link href="/services/maintenance">
                  <a className="hover:opacity-80 transition-opacity">Maintenance Industrielle</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about">
                  <a className="hover:opacity-80 transition-opacity">À propos</a>
                </Link>
              </li>
              <li>
                <Link href="/projects">
                  <a className="hover:opacity-80 transition-opacity">Projets</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:opacity-80 transition-opacity">Nous contacter</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Coordonnées</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <a href="tel:+212523302829" className="hover:opacity-80 transition-opacity">
                  {t('footer.phone')}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 flex-shrink-0 opacity-0" />
                <span className="opacity-80 text-xs">{t('footer.fax')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <a href="mailto:info@somatisme.ma" className="hover:opacity-80 transition-opacity">
                  {t('footer.email')}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <Link href="/contact">
                  <a className="hover:opacity-80 transition-opacity">{t('footer.address')}</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm opacity-70">
            <p>{t('footer.copyright')}</p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              <a href="/privacy" className="hover:opacity-100 transition-opacity">{t('footer.privacy')}</a>
              <a href="/terms" className="hover:opacity-100 transition-opacity">{t('footer.terms')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
