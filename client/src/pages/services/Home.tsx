import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Wrench, Cpu, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSEO } from '@/hooks/useSEO';

/**
 * SOMATISME - Page d'Accueil
 * Design: Minimalisme Technologique Épuré
 * Couleurs: Bleu profond (#0F172A), Cyan Premium (#06B6D4)
 */

export default function Home() {
  const { t } = useLanguage();

  useSEO({
    title: 'Automatisme Industriel & Solutions Techniques',
    description: 'SOMATISME : Solutions d\'automatisme industriel, régulation, installation électrique et maintenance. Expertise B2B pour l\'industrie.',
    keywords: 'automatisme industriel, régulation, installation électrique, maintenance industrielle, solutions techniques',
    ogTitle: 'SOMATISME - Solutions d\'Automatisme Industriel',
    ogDescription: 'Solutions complètes d\'automatisme industriel, régulation et maintenance pour les entreprises B2B.',
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7 },
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8 },
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6 },
  };

  const partnersData = [
    { name: 'Procter & Gamble', url: 'www.pg.ma', logoUrl: '/pg.png' },
    { name: 'Smart Strategies', url: 'www.smartstrategies.ma', logoUrl: '/brands/Smart-Strategies.png' },
    { name: 'Espace Metal', url: 'www.espacemetal.net', logoUrl: '/brands/Espace-Metal.png' },
    { name: 'Comaprom', url: '', logoUrl: '/brands/Comaprom.png' },
    { name: 'Electroprint', url: '', logoUrl: '/brands/Electroprint.png' },
    { name: 'FATER', url: '', logoUrl: '/brands/FATER.png' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section - CLASSIC PROFESSIONAL DESIGN */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-white">
        <div className="absolute inset-0 gradient-hero opacity-5"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>

        <div className="container relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="inline-block"
              >
                <span className="text-accent font-semibold text-sm uppercase tracking-wide">{t('home.hero.badge')}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl md:text-6xl font-bold text-foreground leading-tight"
              >
                {t('home.hero.title')}
                <span className="text-accent"> {t('home.hero.title.accent')}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-lg text-muted-foreground max-w-xl leading-relaxed"
              >
                {t('home.hero.desc')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all flex items-center gap-2"
                  >
                    {t('home.hero.cta.quote')}
                    <ArrowRight size={18} />
                  </motion.button>
                </Link>
                <Link href="/services">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 border-2 border-accent text-accent font-semibold rounded-lg hover:bg-accent/5 transition-all"
                  >
                    {t('home.hero.cta.discover')}
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex gap-8 pt-8"
              >
                {[
                  { value: '50+', label: t('home.hero.stats.projects') },
                  { value: '15+', label: t('home.hero.stats.experience') },
                  { value: '100%', label: t('home.hero.stats.satisfaction') },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -3 }}
                    className="group"
                  >
                    <p className="text-3xl font-bold text-accent mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border">
                <img
                  src="/somatisme.png"
                  alt="Automatisme industriel"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>

              {/* Floating Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-white p-5 rounded-xl max-w-xs shadow-lg border border-border"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Zap size={20} className="text-accent" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{t('home.hero.card.title')}</p>
                </div>
                <p className="text-xs text-muted-foreground">{t('home.hero.card.desc')}</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Ticker Section - CLASSIC STYLE */}
      <section className="py-20 overflow-hidden relative bg-muted/30">
        <div className="container mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3">{t('about.partners.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('about.partners.subtitle')}</p>
          </motion.div>
        </div>

        <div className="relative flex overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex flex-none gap-16 pr-16 items-center"
          >
            {[...partnersData, ...partnersData].map((partner, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="h-20 w-auto object-contain max-w-[200px]"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${partner.name}&background=random`; }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Overview Section - CLASSIC STYLE */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('home.expertise.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.expertise.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Cpu,
                title: t('home.expertise.automation.title'),
                description: t('home.expertise.automation.desc'),
                href: '/services/automation',
              },
              {
                icon: Zap,
                title: t('home.expertise.regulation.title'),
                description: t('home.expertise.regulation.desc'),
                href: '/services/regulation',
              },
              {
                icon: Shield,
                title: t('home.expertise.electrical.title'),
                description: t('home.expertise.electrical.desc'),
                href: '/services/electrical',
              },
              {
                icon: Wrench,
                title: t('home.expertise.maintenance.title'),
                description: t('home.expertise.maintenance.desc'),
                href: '/services/maintenance',
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="card-premium p-8 group cursor-pointer border border-border hover:border-accent transition-all"
              >
                <div className="mb-6 inline-flex p-4 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-all">
                  <service.icon className="text-accent" size={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{service.description}</p>
                <Link href={service.href}>
                  <motion.a
                    whileHover={{ x: 3 }}
                    className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
                  >
                    {t('services.more')}
                    <ArrowRight size={16} />
                  </motion.a>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Methodology Process Section - Ultra Pro */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading text-foreground mb-4">{t('home.process.title')}</h2>
            <div className="divider-gradient w-32 mx-auto mb-4"></div>
            <p className="text-body-large text-muted-foreground">{t('home.process.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: t('home.process.step1.title'), desc: t('home.process.step1.desc') },
              { step: "02", title: t('home.process.step2.title'), desc: t('home.process.step2.desc') },
              { step: "03", title: t('home.process.step3.title'), desc: t('home.process.step3.desc') },
              { step: "04", title: t('home.process.step4.title'), desc: t('home.process.step4.desc') }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="card-premium p-8 relative group cursor-pointer"
              >
                <span className="text-6xl font-black gradient-text opacity-20 absolute top-4 right-6 group-hover:opacity-40 transition-opacity">{item.step}</span>
                <h3 className="text-xl font-bold mb-3 mt-4">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Ultra Pro */}
      <section className="section-padding section-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-20 w-64 h-64 bg-accent/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]"></div>
        </div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-heading text-white mb-6">{t('home.why.title')}</h2>
              <p className="text-lg text-gray-300 mb-8">{t('home.why.subtitle')}</p>
              <div className="space-y-4">
                {[
                  t('home.why.item1'),
                  t('home.why.item2'),
                  t('home.why.item3'),
                  t('home.why.item4'),
                  t('home.why.item5'),
                ].map((text, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 card-glass px-4 py-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                      <Zap size={16} />
                    </div>
                    <span className="font-medium text-white">{text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-glow-strong border border-accent/20">
                <img src="/somatisme.png" alt="SOMATISME" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Ultra Pro */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-accent/20 rounded-full blur-[80px] animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-display text-foreground mb-6">
              {t('cta.home.title')}
            </h2>
            <p className="text-body-large text-muted-foreground max-w-2xl mx-auto mb-10">
              {t('cta.home.subtitle')}
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-accent text-lg px-10 py-5"
              >
                {t('cta.home.button')}
                <ArrowRight size={20} className="ml-2" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
