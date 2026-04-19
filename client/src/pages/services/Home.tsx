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
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const partnersData = [
    { name: 'Procter & Gamble', url: 'www.pg.ma', logoUrl: '/logo-pg.png' },
    { name: 'Smart Strategies', url: 'www.smartstrategies.ma', logoUrl: '/logo-smart.png' },
    { name: 'Espace Metal', url: 'www.espacemetal.net', logoUrl: '/logo-espace-metal.png' },
    { name: 'Comaprom', url: '', logoUrl: '/logo-comaprom.png' },
    { name: 'Electroprint', url: '', logoUrl: '/logo-electroprint.png' },
    { name: 'FATER', url: '', logoUrl: '/logo-fater.png' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-block px-4 py-2 bg-accent/10 rounded-lg border border-accent/30">
                <span className="text-accent font-semibold text-sm">{t('home.hero.badge')}</span>
              </div>

              <h1 className="text-display text-foreground">
                {t('home.hero.title')}
                <span className="text-accent">{t('home.hero.title.accent')}</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg">
                {t('home.hero.desc')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                    {t('home.hero.cta.quote')}
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline">
                    {t('home.hero.cta.discover')}
                  </Button>
                </Link>
              </div>

              <div className="flex gap-8 pt-8">
                <div>
                  <p className="text-2xl font-bold text-primary">50+</p>
                  <p className="text-sm text-muted-foreground">Projets réalisés</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">15+</p>
                  <p className="text-sm text-muted-foreground">Années d'expérience</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">100%</p>
                  <p className="text-sm text-muted-foreground">Client satisfaits</p>
                </div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663572602219/DJ3UxwC3g4oRjvX9YeHeX4/somatisme-hero-industrial-eHKFdvCVLBVo9w8jk262oq.webp"
                  alt="Automatisme industriel"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>

              {/* Floating Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs"
              >
                <p className="text-sm font-semibold text-foreground mb-2">Technologie de Pointe</p>
                <p className="text-xs text-muted-foreground">Systèmes d'automatisme dernière génération</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Ticker Section */}
      <section className="py-12 border-y border-border bg-background overflow-hidden">
        <div className="container mb-8">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
            {t('about.partners.title')}
          </h2>
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
        className="flex flex-none gap-24 pr-24 items-center"
          >
        {[...partnersData, ...partnersData].map((partner, index) => (
              <div
                key={index}
                className="flex items-center gap-2 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <img 
                  src={partner.logoUrl} 
                  alt={partner.name} 
                  className="h-12 w-auto object-contain max-w-[150px]" 
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${partner.name}&background=random`; }} 
                />
              </div>
            ))}
          </motion.div>
        </div>
  </section>

      {/* Services Overview Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading text-foreground mb-4">{t('home.expertise.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.expertise.subtitle')}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: Cpu,
                title: 'Automatisme Industriel',
                description: 'Systèmes de contrôle et d\'automatisation avancés',
                href: '/services/automation',
              },
              {
                icon: Zap,
                title: 'Régulation & Instrumentation',
                description: 'Mesure et contrôle de précision',
                href: '/services/regulation',
              },
              {
                icon: Shield,
                title: 'Installation Électrique',
                description: 'Solutions électriques sécurisées et conformes',
                href: '/services/electrical',
              },
              {
                icon: Wrench,
                title: 'Maintenance Industrielle',
                description: 'Support technique et maintenance préventive',
                href: '/services/maintenance',
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group bg-card border border-border rounded-lg p-6 hover:border-accent transition-all duration-300 hover:shadow-lg"
              >
                <div className="mb-4 inline-block p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <service.icon className="text-accent" size={24} />
                </div>
                <h3 className="text-subheading text-foreground mb-2">{service.title}</h3>
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

      {/* Methodology Process Section */}
      <section className="py-20 md:py-32 bg-background border-y border-border">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-heading text-foreground mb-4">{t('home.process.title')}</h2>
            <p className="text-muted-foreground">{t('home.process.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: t('home.process.step1.title'), desc: t('home.process.step1.desc') },
              { step: "02", title: t('home.process.step2.title'), desc: t('home.process.step2.desc') },
              { step: "03", title: t('home.process.step3.title'), desc: t('home.process.step3.desc') },
              { step: "04", title: t('home.process.step4.title'), desc: t('home.process.step4.desc') }
            ].map((item, i) => (
              <div key={i} className="relative p-8 bg-card border border-border rounded-2xl group hover:border-accent transition-colors">
                <span className="text-5xl font-black text-muted/20 absolute top-4 right-6 group-hover:text-accent/10 transition-colors">{item.step}</span>
                <h3 className="text-xl font-bold mb-3 mt-4">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-muted/20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-heading mb-6">{t('home.why.title')}</h2>
              <p className="text-lg text-muted-foreground mb-8">{t('home.why.subtitle')}</p>
              <div className="space-y-4">
                {[
                  t('home.why.item2'),
                  t('home.why.item3'),
                  t('home.why.item4'),
                  "Accompagnement personnalisé"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                      <Zap size={14} />
                    </div>
                    <span className="font-medium text-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-background">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80" alt="Tech" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-heading text-primary-foreground mb-6">
              Prêt à transformer votre industrie ?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Contactez nos experts pour discuter de vos besoins spécifiques
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                Nous contacter maintenant
                <ArrowRight size={18} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
