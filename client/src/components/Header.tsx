import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.services'), href: '/services' },
    { label: t('nav.projects'), href: '/projects' },
    { label: t('nav.products'), href: '/products' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-background via-primary/5 to-background border-b border-accent/20 backdrop-blur-sm">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-accent via-secondary to-accent"></div>

      <div className="container flex items-center justify-between h-20">
        {/* Logo - Premium */}
        <Link href="/">
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-secondary rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative px-3 py-2 bg-background rounded-lg">
                <Zap size={24} className="text-accent" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent leading-tight">
                SOMATISME
              </span>
              <span className="text-xs font-bold text-accent uppercase tracking-widest">Automatisation</span>
            </div>
          </motion.a>
        </Link>

        {/* Desktop Navigation - Premium */}
        <nav className="hidden lg:flex items-center gap-12">
          {navItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <motion.a
                whileHover={{ y: -2 }}
                className="relative text-foreground font-semibold text-sm uppercase tracking-wide hover:text-accent transition-colors group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-secondary group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            </Link>
          ))}
        </nav>

        {/* CTA Button - Premium */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/contact">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-gradient-to-r from-accent to-orange-500 hover:from-accent/90 hover:to-orange-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
                {t('cta.contact')}
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Mobile Menu Button - Premium */}
        <motion.button
          onClick={toggleMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="lg:hidden p-2 hover:bg-accent/10 rounded-lg transition-colors border border-accent/20"
        >
          {isOpen ? <X size={24} className="text-accent" /> : <Menu size={24} className="text-accent" />}
        </motion.button>
      </div>

      {/* Mobile Navigation - Premium */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden border-t border-accent/20 bg-gradient-to-b from-background to-primary/5 backdrop-blur-sm"
        >
          <nav className="container py-8 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {navItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <motion.a
                    whileHover={{ x: 5 }}
                    className="text-foreground hover:text-accent transition-colors font-bold text-lg uppercase tracking-wide flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    {item.label}
                  </motion.a>
                </Link>
              ))}
            </div>
            <Link href="/contact">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="w-full bg-gradient-to-r from-accent to-orange-500 hover:from-accent/90 hover:to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg">
                  {t('cta.contact')}
                </Button>
              </motion.div>
            </Link>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
