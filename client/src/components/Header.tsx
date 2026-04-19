import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/logo.png" 
              alt="SOMATISME" 
              className="h-10 md:h-12 w-auto object-contain"
            />
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/about">
            <a className="text-foreground hover:text-primary transition-colors font-medium">{t('nav.about')}</a>
          </Link>
          <Link href="/services">
            <a className="text-foreground hover:text-primary transition-colors font-medium">{t('nav.services')}</a>
          </Link>
          <Link href="/projects">
            <a className="text-foreground hover:text-primary transition-colors font-medium">{t('nav.projects')}</a>
          </Link>
          <Link href="/contact">
            <Button className="bg-accent hover:bg-accent/90">
              {t('cta.contact')}
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-6 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Link href="/about">
                <a className="text-foreground hover:text-primary transition-colors font-medium text-lg">{t('nav.about')}</a>
              </Link>
              <Link href="/services">
                <a className="text-foreground hover:text-primary transition-colors font-medium text-lg">{t('nav.services')}</a>
              </Link>
              <Link href="/projects">
                <a className="text-foreground hover:text-primary transition-colors font-medium text-lg">{t('nav.projects')}</a>
              </Link>
            </div>
            <Link href="/contact">
              <Button className="w-full bg-accent hover:bg-accent/90">
                {t('cta.contact')}
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
