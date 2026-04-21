import { Link } from 'wouter';
import { Mail, Phone, MapPin, Linkedin, Zap, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Services',
      links: [
        { label: 'Automatisme Industriel', href: '/services/automation' },
        { label: 'Régulation & Instrumentation', href: '/services/regulation' },
        { label: 'Installation Électrique', href: '/services/electrical' },
        { label: 'Maintenance Industrielle', href: '/services/maintenance' },
      ]
    },
    {
      title: 'Entreprise',
      links: [
        { label: 'À propos', href: '/about' },
        { label: 'Projets', href: '/projects' },
        { label: 'Nous contacter', href: '/contact' },
        { label: 'Produits', href: '/products' },
      ]
    },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-primary via-primary to-primary/95 text-primary-foreground overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] opacity-50"></div>

      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-accent via-secondary to-accent"></div>

      <div className="container relative z-10 py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info - Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Link href="/">
              <motion.a
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent to-secondary rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative px-3 py-2 bg-primary rounded-lg">
                    <Zap size={20} className="text-accent" />
                  </div>
                </div>
                <span className="text-xl font-black bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                  SOMATISME
                </span>
              </motion.a>
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <motion.a
              href="https://www.linkedin.com/in/fouad-ben-amar-20295354?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 10 }}
              className="inline-flex p-3 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors"
            >
              <Linkedin size={20} className="text-accent" />
            </motion.a>
          </motion.div>

          {/* Links Sections */}
          {footerLinks.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="space-y-6"
            >
              <h4 className="font-bold text-lg uppercase tracking-wider text-white flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-accent"></span>
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href}>
                      <motion.a
                        whileHover={{ x: 5 }}
                        className="text-gray-300 hover:text-accent transition-colors text-sm flex items-center gap-2 group"
                      >
                        <span className="w-0 h-0.5 bg-accent group-hover:w-4 transition-all"></span>
                        {link.label}
                      </motion.a>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Info - Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h4 className="font-bold text-lg uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-accent"></span>
              Coordonnées
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <Phone size={18} className="mt-0.5 flex-shrink-0 text-accent group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <a href="tel:+212679825646" className="text-gray-300 hover:text-accent transition-colors text-sm font-semibold">
                    {t('footer.phone')}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <Mail size={18} className="mt-0.5 flex-shrink-0 text-accent group-hover:scale-110 transition-transform" />
                <a href="mailto:somatisme@gmail.com" className="text-gray-300 hover:text-accent transition-colors text-sm font-semibold">
                  somatisme@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <MapPin size={18} className="mt-0.5 flex-shrink-0 text-accent group-hover:scale-110 transition-transform" />
                <span className="text-gray-300 text-sm">{t('footer.address')}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-accent/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-400">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              © {currentYear} SOMATISME. {t('footer.copyright')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <Link href="/privacy">
                <a className="hover:text-accent transition-colors flex items-center gap-1">
                  {t('footer.privacy')}
                  <ArrowRight size={12} />
                </a>
              </Link>
              <Link href="/terms">
                <a className="hover:text-accent transition-colors flex items-center gap-1">
                  {t('footer.terms')}
                  <ArrowRight size={12} />
                </a>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
