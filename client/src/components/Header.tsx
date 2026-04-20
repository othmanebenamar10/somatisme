import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X, Zap, Sparkles, ArrowRight } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-background via-primary/5 to-background border-b border-accent/20 backdrop-blur-xl">
      {/* Animated top accent line */}
      <motion.div 
        className="h-1 bg-gradient-to-r from-accent via-secondary to-accent"
        animate={{ backgroundPosition: ['0% center', '100% center'] }}
        transition={{ duration: 3, repeat: Infinity }}
      ></motion.div>

      {/* Decorative animated elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute top-0 left-1/2 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="container flex items-center justify-between h-24">
        {/* Logo - SPECTACULAR */}
        <Link href="/">
          <motion.a 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
          >
            {/* Icon with multiple glow layers */}
            <motion.div 
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              {/* Outer glow */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-accent to-secondary rounded-lg blur-lg opacity-0 group-hover:opacity-100"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
              
              {/* Middle glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-secondary rounded-lg blur opacity-60 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Icon container */}
              <div className="relative px-3 py-2 bg-background rounded-lg">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap size={28} className="text-accent" />
                </motion.div>
              </div>
            </motion.div>

            {/* Text with animations */}
            <div className="flex flex-col gap-0.5">
              <motion.span 
                className="text-2xl md:text-3xl font-black bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent leading-tight"
                animate={{ backgroundPosition: ['0% center', '100% center'] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                SOMATISME
              </motion.span>
              <motion.span 
                className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-1"
                animate={{ x: [0, 2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={12} />
                Automatisation
              </motion.span>
            </div>
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
                  <motion.span
                    className="opacity-0 group-hover:opacity-100"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
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
          <Link href="/contact">
            <motion.div
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.92 }}
            >
              <motion.button
                className="relative px-8 py-3 rounded-xl font-bold uppercase tracking-wide text-sm text-white bg-gradient-to-r from-accent to-orange-500 shadow-lg shadow-accent/50 overflow-hidden group"
                animate={{ boxShadow: ['0 0 20px rgba(234, 88, 12, 0.3)', '0 0 40px rgba(234, 88, 12, 0.6)', '0 0 20px rgba(234, 88, 12, 0.3)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Animated background shine */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                ></motion.div>
                
                <span className="relative flex items-center gap-2">
                  {t('cta.contact')}
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight size={16} />
                  </motion.span>
                </span>
              </motion.button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Mobile Menu Button - SPECTACULAR */}
        <motion.button
          onClick={toggleMenu}
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.85 }}
          className="lg:hidden p-2 hover:bg-accent/10 rounded-lg transition-colors border-2 border-accent/30 hover:border-accent/60"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X size={24} className="text-accent" /> : <Menu size={24} className="text-accent" />}
          </motion.div>
        </motion.button>
      </div>

      {/* Mobile Navigation - SPECTACULAR */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden border-t-2 border-accent/20 bg-gradient-to-b from-background to-primary/10 backdrop-blur-xl overflow-hidden"
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
                    variants={itemVariants}
                    whileHover={{ x: 8, color: '#ea580c' }}
                    whileTap={{ scale: 0.95 }}
                    className="text-foreground transition-colors font-bold text-lg uppercase tracking-wide flex items-center gap-3 group"
                  >
                    <motion.span 
                      className="w-2 h-2 rounded-full bg-gradient-to-r from-accent to-secondary"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    ></motion.span>
                    {item.label}
                    <motion.span
                      className="opacity-0 group-hover:opacity-100 ml-auto"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-4 rounded-xl font-bold uppercase tracking-wide text-sm text-white bg-gradient-to-r from-accent to-orange-500 shadow-lg shadow-accent/50 flex items-center justify-center gap-2 group"
                >
                  {t('cta.contact')}
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
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
