import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, Zap, Wrench, Cpu, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSEO } from '@/hooks/useSEO';

/**
 * SOMATISME - Page d'Accueil
 * Design: Minimalisme Technologique Ã‰purÃ©
 * Couleurs: Bleu profond (#0F172A), Cyan Premium (#06B6D4)
 */

export default function Home() {
  const { t } = useLanguage();

  useSEO({
    title: 'Automatisme Industriel & Solutions Techniques',
    description: 'SOMATISME : Solutions d\'automatisme industriel, rÃ©gulation, installation Ã©lectrique et maintenance. Expertise B2B pour l\'industrie.',
    keywords: 'automatisme industriel, rÃ©gulation, installation Ã©lectrique, maintenance industrielle, solutions techniques',
    ogTitle: 'SOMATISME - Solutions d\'Automatisme Industriel',
    ogDescription: 'Solutions complÃ¨tes d\'automatisme industriel, rÃ©gulation et maintenance pour les entreprises B2B.',
  });

  const partnersData = [
    { name: 'Safran', logoUrl: '/brands/safran.png' },
    { name: 'ADF', logoUrl: '/brands/ADF.png' },
    { name: 'Scantech Australia', logoUrl: '/brands/Scantech Australia.png' },
    { name: 'OCP', logoUrl: '/brands/ocp.png' },
    { name: 'Bimbo', logoUrl: '/brands/bimbo.png' },
    { name: 'Somasteel', logoUrl: '/brands/somasteel.png' },
    { name: 'Sonasid', logoUrl: '/brands/sonasid.png' },
    { name: 'Somachame', logoUrl: '/brands/Somachame.png' },
    { name: 'Danone', logoUrl: '/brands/danone.png' },
    { name: 'Coca-Cola', logoUrl: '/brands/Coca-cola.png' },
    { name: 'P&G', logoUrl: '/pg.png' },
    { name: 'Fater', logoUrl: '/brands/FATER.png' },
    { name: 'Leaderfood', logoUrl: '/brands/Leaderfood.png' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="container grid min-h-[620px] grid-cols-1 items-center gap-12 py-16 md:py-20 lg:grid-cols-2">
          <div className="max-w-2xl">
            <p className="mb-6 inline-flex border-l-2 border-cyan-400 pl-3 text-sm font-semibold tracking-wide text-cyan-300">{t('home.hero.badge')}</p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {t('home.hero.title')} <span className="text-cyan-300">{t('home.hero.title.accent')}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{t('home.hero.desc')}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact">
                <a className="inline-flex items-center gap-2 rounded-md bg-cyan-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-cyan-500">
                  {t('home.hero.cta.quote')} <ArrowRight size={18} />
                </a>
              </Link>
              <Link href="/services">
                <a className="rounded-md border border-slate-500 px-6 py-3.5 font-semibold text-white transition-colors hover:border-white">{t('home.hero.cta.discover')}</a>
              </Link>
            </div>
            <div className="mt-12 grid max-w-lg grid-cols-3 gap-5 border-t border-slate-700 pt-6">
              {[
                { value: '50+', label: t('home.hero.stats.projects') },
                { value: '15+', label: t('home.hero.stats.experience') },
                { value: '100%', label: t('home.hero.stats.satisfaction') },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src="/somatisme.png" alt="Équipement et solutions d’automatisme industriel" className="aspect-[4/3] w-full rounded-lg object-cover" />
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-400"><span className="h-px w-8 bg-cyan-400" />{t('home.hero.card.title')}</div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-14">
        <div className="container">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">{t('about.partners.title')}</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{t('about.partners.subtitle')}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {partnersData.map((partner) => (
              <div key={partner.name} className="flex h-16 items-center justify-center rounded-md border border-slate-200 bg-white px-3">
                <img src={partner.logoUrl} alt={partner.name} title={partner.name} className="max-h-10 max-w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services overview */}
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
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-6">{t('home.expertise.title')}</h2>
            <p className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
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
                color: 'from-cyan-500 to-cyan-600'
              },
              {
                icon: Zap,
                title: t('home.expertise.regulation.title'),
                description: t('home.expertise.regulation.desc'),
                href: '/services/regulation',
                color: 'from-cyan-400 to-cyan-500'
              },
              {
                icon: Shield,
                title: t('home.expertise.electrical.title'),
                description: t('home.expertise.electrical.desc'),
                href: '/services/electrical',
                color: 'from-cyan-500 to-cyan-600'
              },
              {
                icon: Wrench,
                title: t('home.expertise.maintenance.title'),
                description: t('home.expertise.maintenance.desc'),
                href: '/services/maintenance',
                color: 'from-cyan-400 to-cyan-500'
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
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
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



