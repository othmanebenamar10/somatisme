import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Cpu, CheckCircle2, Server, Settings, ShieldCheck, Zap, Factory, Droplets } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * SOMATISME - Page Projets/Réalisations
 * Design: Minimalisme Technologique Épuré
 */

export default function Projects() {
  const { t } = useLanguage();

  const projects = [
    {
      title: 'Automatisation Usine Textile',
      description: 'Ingénierie complète et programmation d\'une ligne de production. Intégration de 40 variateurs de vitesse et synchronisation multi-axes.',
      category: 'Automatisme',
      tech: 'Siemens S7-1500, WinCC OA, Profinet',
      result: '+25% de productivité, traçabilité totale',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663572602219/DJ3UxwC3g4oRjvX9YeHeX4/somatisme-automation-tech-FSEKAzPRsDfEawe3XPbZBV.webp',
    },
    {
      title: 'Installation Électrique Complexe',
      description: 'Conception et montage de TGBT 3200A. Étude de sélectivité et déploiement de canalisations préfabriquées pour unité de sidérurgie.',
      category: 'Installation Électrique',
      tech: 'TGBT 2500A, Etude de sélectivité, Canalisations préfabriquées',
      result: 'Conformité NFC 15-100, continuité de service assurée',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663572602219/DJ3UxwC3g4oRjvX9YeHeX4/somatisme-electrical-installation-oYfQNxYRmAM255cbCAQrfv.webp',
    },
    {
      title: 'Système de Régulation Avancé',
      description: 'Instrumentation complète d\'un réacteur chimique. Contrôle précis de température et pression avec boucles PID complexes.',
      category: 'Régulation',
      tech: 'Capteurs Endress+Hauser, Vannes de régulation, Boucles PID',
      result: 'Précision de mesure < 0.1%, réduction pertes matières',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663572602219/DJ3UxwC3g4oRjvX9YeHeX4/somatisme-automation-tech-FSEKAzPRsDfEawe3XPbZBV.webp',
    },
    {
      title: 'Maintenance Préventive 24/7',
      description: 'Contrat de maintenance globale multi-sites. Audit thermographique et analyse vibratoire périodique des moteurs critiques.',
      category: 'Maintenance',
      tech: 'Audit thermographique, Analyse vibratoire, Supervision SCADA',
      result: 'Réduction de 15% des arrêts non programmés',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663572602219/DJ3UxwC3g4oRjvX9YeHeX4/somatisme-maintenance-service-SMhhN34tGncAZQFNgaur8M.webp',
    },
    {
      title: 'Retrofit Presse Hydraulique 500T',
      description: 'Modernisation complète de la commande. Remplacement automate obsolète par architecture Fail-safe et HMI tactile.',
      category: 'Modernisation',
      tech: 'Siemens S7-1500F, Safety I/O, Profisafe',
      result: 'Temps de cycle -18%, conformité sécurité machine',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
    },
    {
      title: 'Contrôle Commande Station Pompage',
      description: 'Automatisation d\'une station de traitement d\'eau avec télégestion et remontée d\'alarmes par réseau sans fil.',
      category: 'Traitement Eau',
      tech: 'Schneider M580, Radio/GPRS, Logiciel de supervision',
      result: 'Optimisation énergétique de 20%, monitoring 24/7',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-muted/50 to-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-display text-foreground mb-6">
              {t('projects.hero.title').split(' ')[0]} <span className="text-accent">{t('projects.hero.title').split(' ')[1]}</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('projects.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-3">
                    {project.category}
                  </span>
                  <h3 className="text-subheading text-foreground mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                  
                  <div className="space-y-3 mb-6 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <Settings size={14} className="text-accent" />
                      <span>{project.tech}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <CheckCircle2 size={14} className="text-accent" />
                      <span>{project.result}</span>
                    </div>
                  </div>

                  <Link href="/contact">
                    <a className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all">
                      {t('services.more')}
                      <ArrowRight size={16} />
                    </a>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Execution Process Section */}
      <section className="py-24 bg-background border-y border-border">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-heading text-foreground mb-4">{t('projects.process.title')}</h2>
            <p className="text-muted-foreground">{t('projects.process.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Settings, step: "01", title: t('projects.process.step1.title'), desc: t('projects.process.step1.desc') },
              { icon: Cpu, step: "02", title: t('projects.process.step2.title'), desc: t('projects.process.step2.desc') },
              { icon: Factory, step: "03", title: t('projects.process.step3.title'), desc: t('projects.process.step3.desc') },
              { icon: Droplets, step: "04", title: t('projects.process.step4.title'), desc: t('projects.process.step4.desc') }
            ].map((item, i) => (
              <div key={i} className="relative p-8 bg-card border border-border rounded-3xl group hover:border-accent transition-all duration-300">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                <span className="absolute top-8 right-8 text-4xl font-black text-muted/10">{item.step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { number: '50+', label: 'Projets réalisés' },
              { number: '100%', label: 'Clients satisfaits' },
              { number: '15+', label: 'Années d\'expérience' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
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
              Prêt à démarrer votre projet ?
            </h2>
            <Link href="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary gap-2">
                Nous contacter
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
