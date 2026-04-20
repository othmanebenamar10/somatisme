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

      {/* Hero Section - Ultra Pro Design */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-hero opacity-5"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 grid-pattern opacity-50"></div>

        <div className="container relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={fadeInLeft.initial}
              animate={fadeInLeft.animate}
              transition={fadeInLeft.transition}
              className="space-y-8"
            >
              <motion.div
                initial={fadeInUp.initial}
                animate={fadeInUp.animate}
                transition={{ ...fadeInUp.transition, delay: 0.1 }}
                className="badge-premium"
              >
                <span className="font-semibold tracking-wide uppercase">{t('home.hero.badge')}</span>
              </motion.div>

              <motion.h1
                initial={fadeInUp.initial}
                animate={fadeInUp.animate}
                transition={{ ...fadeInUp.transition, delay: 0.2 }}
                className="text-display text-foreground"
              >
                {t('home.hero.title')}
                <span className="gradient-text">{t('home.hero.title.accent')}</span>
              </motion.h1>

              <motion.p
                initial={fadeInUp.initial}
                animate={fadeInUp.animate}
                transition={{ ...fadeInUp.transition, delay: 0.3 }}
                className="text-body-large text-muted-foreground max-w-xl"
              >
                {t('home.hero.desc')}
              </motion.p>

              <motion.div
                initial={fadeInUp.initial}
                animate={fadeInUp.animate}
                transition={{ ...fadeInUp.transition, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-accent"
                  >
                    {t('home.hero.cta.quote')}
                    <ArrowRight size={18} className="ml-2" />
                  </motion.button>
                </Link>
                <Link href="/services">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-outline"
                  >
                    {t('home.hero.cta.discover')}
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                initial={fadeInUp.initial}
                animate={fadeInUp.animate}
                transition={{ ...fadeInUp.transition, delay: 0.5 }}
                className="flex gap-8 pt-8"
              >
                {[
                  { value: '50+', label: t('home.hero.stats.projects') },
                  { value: '15+', label: t('home.hero.stats.experience') },
                  { value: '100%', label: t('home.hero.stats.satisfaction') },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="card-glass px-6 py-4"
                  >
                    <p className="text-3xl font-bold gradient-text mb-1">{stat.value}</p>
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
              <div className="relative rounded-2xl overflow-hidden shadow-glow-strong">
                <img
                  src="/somatisme.png"
                  alt="Automatisme industriel"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
              </div>

              {/* Floating Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 card-dark p-5 max-w-xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Zap size={20} className="text-accent" />
                  </div>
                  <p className="text-sm font-semibold text-white">{t('home.hero.card.title')}</p>
                </div>
                <p className="text-xs text-gray-300">{t('home.hero.card.desc')}</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Ticker Section - Ultra Pro */}
      <section className="py-20 overflow-hidden relative">
        <div className="absolute inset-0 gradient-card opacity-30"></div>
        <div className="container mb-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-heading text-foreground mb-3">{t('about.partners.title')}</h2>
            <div className="divider-gradient w-24 mx-auto mb-3"></div>
            <p className="text-muted-foreground">{t('about.partners.subtitle')}</p>
          </motion.div>
        </div>
        <div className="relative flex">
          <motion.div
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
            className="flex flex-none gap-32 pr-32 items-center"
          >
            {[...partnersData, ...partnersData].map((partner, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
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

      {/* Services Overview Section - Ultra Pro */}
      <section className="section-padding section-gradient relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30"></div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading text-foreground mb-4">{t('home.expertise.title')}</h2>
            <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
              {t('home.expertise.subtitle')}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
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
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="card-premium p-8 group cursor-pointer"
              >
                <div className="mb-6 inline-flex p-4 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-all duration-300">
                  <service.icon className="text-accent" size={28} />
                </div>
                <h3 className="text-subheading text-foreground mb-3">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                <Link href={service.href}>
                  <a className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all">
                    {t('services.more')}
                    <ArrowRight size={16} />
                  </a>
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
