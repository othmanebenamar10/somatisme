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

      {/* Hero Section - RADICAL NEW DESIGN 2026 */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary via-purple-900 to-primary">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/40 rounded-full blur-[120px] animate-pulse" style={{ animation: 'float 8s ease-in-out infinite' }}></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/30 rounded-full blur-[120px] animate-pulse" style={{ animation: 'float 10s ease-in-out infinite 2s' }}></div>
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-accent/20 rounded-full blur-[100px] animate-pulse" style={{ animation: 'float 12s ease-in-out infinite 4s' }}></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }}></div>

        <div className="container relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left Content - NEW STYLE */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="space-y-10"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/40 backdrop-blur-sm"
              >
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                <span className="text-accent font-bold text-sm uppercase tracking-widest">{t('home.hero.badge')}</span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight"
              >
                {t('home.hero.title')}
                <br />
                <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent">{t('home.hero.title.accent')}</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl text-gray-200 max-w-2xl leading-relaxed"
              >
                {t('home.hero.desc')}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-6 pt-4"
              >
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(234, 88, 12, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-accent to-orange-500 text-primary font-bold rounded-xl flex items-center gap-2 shadow-lg hover:shadow-2xl transition-all"
                  >
                    {t('home.hero.cta.quote')}
                    <ArrowRight size={20} />
                  </motion.button>
                </Link>
                <Link href="/services">
                  <motion.button
                    whileHover={{ scale: 1.05, borderColor: 'rgba(234, 88, 12, 0.8)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 border-2 border-accent/50 text-white font-bold rounded-xl hover:bg-accent/10 transition-all"
                  >
                    {t('home.hero.cta.discover')}
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex gap-12 pt-8 border-t border-white/10"
              >
                {[
                  { value: '50+', label: t('home.hero.stats.projects') },
                  { value: '15+', label: t('home.hero.stats.experience') },
                  { value: '100%', label: t('home.hero.stats.satisfaction') },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <p className="text-4xl font-black bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-2">{stat.value}</p>
                    <p className="text-sm text-gray-300 group-hover:text-accent transition-colors">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Visual - NEW STYLE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.9 }}
              className="relative"
            >
              {/* Glowing Background Shape */}
              <div className="absolute -inset-8 bg-gradient-to-r from-accent/20 via-secondary/20 to-accent/20 rounded-3xl blur-3xl opacity-50"></div>

              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-accent/30 backdrop-blur-sm">
                <img
                  src="/somatisme.png"
                  alt="Automatisme industriel"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent"></div>
              </div>

              {/* Floating Stats Cards */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-8 -left-8 bg-gradient-to-br from-accent/90 to-orange-600 p-6 rounded-2xl max-w-xs shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Zap size={24} className="text-white" />
                  </div>
                  <p className="text-sm font-bold text-white">{t('home.hero.card.title')}</p>
                </div>
                <p className="text-xs text-white/80">{t('home.hero.card.desc')}</p>
              </motion.div>

              {/* Corner Accent */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-4 -right-4 w-32 h-32 border-2 border-accent/30 rounded-full"
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Ticker Section - RADICAL NEW DESIGN */}
      <section className="py-24 overflow-hidden relative bg-gradient-to-r from-primary/50 via-secondary/30 to-primary/50">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(234, 88, 12, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)'
        }}></div>

        <div className="container mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-5xl font-black text-white mb-4">{t('about.partners.title')}</h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">{t('about.partners.subtitle')}</p>
          </motion.div>
        </div>

        <div className="relative flex overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex flex-none gap-24 pr-24 items-center"
          >
            {[...partnersData, ...partnersData].map((partner, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.15, filter: 'drop-shadow(0 0 20px rgba(234, 88, 12, 0.6))' }}
                className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="h-24 w-auto object-contain max-w-[220px]"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=ea580c&color=fff&bold=true&size=200`; }}
                  title={partner.name}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Overview Section - RADICAL NEW DESIGN */}
      <section className="py-32 relative overflow-hidden bg-background">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'linear-gradient(45deg, transparent 30%, rgba(234, 88, 12, 0.1) 50%, transparent 70%), linear-gradient(-45deg, transparent 30%, rgba(168, 85, 247, 0.1) 50%, transparent 70%)',
          backgroundSize: '100px 100px'
        }}></div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black text-foreground mb-6">{t('home.expertise.title')}</h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('home.expertise.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: Cpu,
                title: t('home.expertise.automation.title'),
                description: t('home.expertise.automation.desc'),
                href: '/services/automation',
                color: 'from-accent to-orange-500'
              },
              {
                icon: Zap,
                title: t('home.expertise.regulation.title'),
                description: t('home.expertise.regulation.desc'),
                href: '/services/regulation',
                color: 'from-secondary to-purple-500'
              },
              {
                icon: Shield,
                title: t('home.expertise.electrical.title'),
                description: t('home.expertise.electrical.desc'),
                href: '/services/electrical',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Wrench,
                title: t('home.expertise.maintenance.title'),
                description: t('home.expertise.maintenance.desc'),
                href: '/services/maintenance',
                color: 'from-green-500 to-emerald-500'
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -15, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-sm cursor-pointer"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                {/* Content */}
                <div className="relative p-8 h-full flex flex-col">
                  <div className={`mb-6 inline-flex p-4 rounded-xl bg-gradient-to-br ${service.color} w-fit`}>
                    <service.icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 flex-grow">{service.description}</p>
                  <Link href={service.href}>
                    <motion.a
                      whileHover={{ x: 5 }}
                      className="inline-flex items-center gap-2 font-bold text-accent group-hover:gap-3 transition-all"
                    >
                      {t('services.more')}
                      <ArrowRight size={18} />
                    </motion.a>
                  </Link>
                </div>

                {/* Border Gradient */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`} style={{ padding: '1px' }}></div>
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
