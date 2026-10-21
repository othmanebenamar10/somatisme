import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X, ArrowRight, Globe2 } from 'lucide-react';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

function LanguageSelect() {
  const { language, setLanguage, t } = useLanguage();
  const languages: { value: Language; short: string; label: string }[] = [
    { value: 'fr', short: 'FR', label: 'Français' },
    { value: 'en', short: 'EN', label: 'English' },
    { value: 'es', short: 'ES', label: 'Español' },
  ];

  return (
    <div
      role="group"
      aria-label={t('language.select')}
      className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-slate-200 bg-white/90 p-1 shadow-sm shadow-slate-900/5"
    >
      <Globe2 aria-hidden="true" className="mx-1 hidden h-4 w-4 text-slate-500 sm:block" />
      {languages.map((option) => {
        const isActive = language === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-label={`${t('language.select')}: ${option.label}`}
            aria-pressed={isActive}
            title={option.label}
            onClick={() => setLanguage(option.value)}
            className={`min-w-8 rounded-full px-2 py-1.5 text-[11px] font-extrabold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-1 sm:min-w-10 sm:px-2.5 sm:text-xs ${
              isActive
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            {option.short}
          </button>
        );
      })}
    </div>
  );
}

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-accent/20">
      <div className="h-1 bg-gradient-to-r from-accent via-secondary to-accent"></div>

      <div className="container flex items-center justify-between h-20 sm:h-24">
        {/* Brand */}
        <Link href="/">
          <motion.a 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="hover:opacity-85 transition-opacity"
          >
            <img
              src="/logo-somatisme-green.png"
              alt="SOMATISME — Automatisme industriel"
              className="h-11 w-auto max-w-[48vw] object-contain sm:h-12"
            />
          </motion.a>
        </Link>

        {/* Desktop Navigation - SPECTACULAR */}
        <motion.nav 
          className="hidden lg:flex items-center gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {navItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <motion.a
                variants={itemVariants}
                whileHover={{ y: -3, color: '#ea580c' }}
                whileTap={{ scale: 0.95 }}
                className="relative text-foreground font-bold text-sm uppercase tracking-wider transition-colors group"
              >
                <span className="flex items-center gap-1">
                  {item.label}
                  <motion.span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={14} />
                  </motion.span>
                </span>
                
                {/* Animated underline */}
                <motion.span 
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-accent to-secondary"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                ></motion.span>
              </motion.a>
            </Link>
          ))}
        </motion.nav>

        {/* CTA Button - SPECTACULAR */}
        <motion.div 
          className="hidden lg:flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <LanguageSelect />
          <Link href="/contact">
            <motion.div
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.92 }}
            >
              <motion.button
                className="relative px-8 py-3 rounded-xl font-bold uppercase tracking-wide text-sm text-white bg-gradient-to-r from-accent to-orange-500 shadow-lg shadow-accent/50 overflow-hidden group"
              >
                {/* Animated background shine */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                ></motion.div>
                
                <span className="relative flex items-center gap-2">
                  {t('cta.contact')}
                  <motion.span>
                    <ArrowRight size={16} />
                  </motion.span>
                </span>
              </motion.button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Mobile Menu Button - SPECTACULAR */}
        <div className="lg:hidden flex items-center gap-2">
          <LanguageSelect />
          <motion.button
            type="button"
            onClick={toggleMenu}
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-accent/10 rounded-lg transition-colors border-2 border-accent/30 hover:border-accent/60"
            aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={isOpen}
          >
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              {isOpen ? <X size={24} className="text-accent" /> : <Menu size={24} className="text-accent" />}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation - SPECTACULAR */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden border-t-2 border-accent/20 bg-background overflow-hidden"
        >
          <nav className="container py-8 flex flex-col gap-6">
            <motion.div 
              className="flex flex-col gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {navItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <motion.a
                    onClick={() => setIsOpen(false)}
                    variants={itemVariants}
                    whileHover={{ x: 8, color: '#ea580c' }}
                    whileTap={{ scale: 0.95 }}
                    className="text-foreground transition-colors font-bold text-lg uppercase tracking-wide flex items-center gap-3 group"
                  >
                    <motion.span className="w-2 h-2 rounded-full bg-gradient-to-r from-accent to-secondary"></motion.span>
                    {item.label}
                    <motion.span className="opacity-0 group-hover:opacity-100 ml-auto transition-opacity">
                      <ArrowRight size={16} />
                    </motion.span>
                  </motion.a>
                </Link>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/contact">
                <motion.button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-4 rounded-xl font-bold uppercase tracking-wide text-sm text-white bg-gradient-to-r from-accent to-orange-500 shadow-lg shadow-accent/50 flex items-center justify-center gap-2 group"
                >
                  {t('cta.contact')}
                  <motion.span>
                    <ArrowRight size={16} />
                  </motion.span>
                </motion.button>
              </Link>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
