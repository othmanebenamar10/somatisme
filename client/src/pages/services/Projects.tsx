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
      title: 'Installation logiciel pour la qualité assurée',
      description: "L'assurance qualité (AQ) est une approche proactive et systématique visant à garantir la conformité des produits ou services aux exigences définies, prévenant ainsi les défauts avant qu'ils ne surviennent. Elle structure les processus opérationnels, assure le respect des normes (ex: ISO 9001) et améliore la confiance client. Contrairement au contrôle qualité (QC) qui détecte les défauts sur le produit final, l'AQ se concentre sur l'amélioration des processus de production pour éviter les erreurs. La gestion proactive implique la définition de normes, la documentation, la formation du personnel et des audits continus. En informatique, le QA concerne les tests de logiciels pour garantir la conformité, la performance et l'expérience utilisateur, souvent géré par un QA Lead ou un analyste.",
      category: 'Qualité',
      tech: 'ISO 9001, Audit qualité, Documentation process, Formation personnel, Tests logiciels, QA Lead',
      result: 'Conformité process assurée, prévention des défauts, confiance client renforcée',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.22.55 PM.jpeg',
    },
    {
      title: 'Installation et modification unité poudre — Bostik',
      description: "Installation et modification de l'unité poudre au sein de la Société des colles marocain « Bostik ». Intervention complète sur la ligne de production : adaptation des équipements existants, mise à niveau des automatismes et optimisation du process de fabrication des colles en poudre pour répondre aux nouvelles exigences de production.",
      category: 'Automatisme',
      tech: 'Automatismes industriels, Modification ligne process, Instrumentation, Mise en service',
      result: 'Ligne de production modernisée, capacité de production optimisée, conformité process',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.22.55 PM (1).jpeg',
    },
    {
      title: 'Installation de logiciel de qualité — Fater',
      description: "Installation et déploiement d'un logiciel de qualité au sein de l'entreprise Fater. Mise en place des outils de suivi, de contrôle et de traçabilité qualité pour les lignes de production. Paramétrage des indicateurs de performance, formation des équipes et intégration avec les systèmes de supervision existants.",
      category: 'Qualité',
      tech: 'Logiciel qualité, Traçabilité, KPI production, Formation équipes, Intégration SCADA',
      result: 'Traçabilité complète, réduction des non-conformités, amélioration continue assurée',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.22.55 PM (2).jpeg',
    },
    {
      title: 'Installation HMI Siemens et Rockwell',
      description: "Installation et mise en service d'interfaces homme-machine (HMI) sur des plateformes Siemens et Rockwell Automation. Déploiement de panneaux opérateurs Siemens TP/KTP et Allen-Bradley PanelView, développement des écrans de supervision, intégration avec les automates S7 et ControlLogix, et formation des opérateurs à l'utilisation des nouvelles interfaces.",
      category: 'Automatisme',
      tech: 'HMI Siemens TP/KTP, Rockwell PanelView, WinCC, FactoryTalk, API S7 & ControlLogix',
      result: 'Interface opérateur intuitive, supervision facilitée, réduction des erreurs de manipulation',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.22.55 PM (3).jpeg',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section - RADICAL NEW DESIGN */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-slate-800 to-primary">
        {/* Animated Orbs */}
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animation: 'float 8s ease-in-out infinite' }}></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-[120px] animate-pulse" style={{ animation: 'float 10s ease-in-out infinite 2s' }}></div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/40 backdrop-blur-sm mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              <span className="text-accent font-bold text-sm uppercase tracking-widest">Nos Réalisations</span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight">
              Projets <br />
              <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent">Réussis</span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {t('projects.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid - Ultra Pro */}
      <section className="section-padding section-gradient relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20"></div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="card-premium overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden rounded-t-2xl">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="badge-premium text-xs">
                    {project.category}
                  </span>
                  <h3 className="text-subheading text-foreground mb-2 mt-3">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>

                  <div className="space-y-2 mb-6 pt-4 border-t border-border/50">
                    <div className="flex items-start gap-2 text-xs font-medium text-foreground">
                      <Settings size={14} className="text-accent mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{project.tech}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs font-medium text-foreground">
                      <CheckCircle2 size={14} className="text-accent mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{project.result}</span>
                    </div>
                  </div>

                  <Link href="/contact">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 min-h-48 shadow-lg shadow-cyan-500/30 w-full"
                    >
                      {t('services.more')}
                      <ArrowRight size={16} className="ml-2" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Execution Process Section - Ultra Pro */}
      <section className="section-padding section-dark relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20"></div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading text-white mb-4">{t('projects.process.title')}</h2>
            <p className="text-body-large text-gray-300">{t('projects.process.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Settings, step: "01", title: t('projects.process.step1.title'), desc: t('projects.process.step1.desc') },
              { icon: Cpu, step: "02", title: t('projects.process.step2.title'), desc: t('projects.process.step2.desc') },
              { icon: Factory, step: "03", title: t('projects.process.step3.title'), desc: t('projects.process.step3.desc') },
              { icon: Droplets, step: "04", title: t('projects.process.step4.title'), desc: t('projects.process.step4.desc') }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="card-premium p-8 group relative"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-all">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                <span className="absolute top-8 right-8 text-5xl font-black text-accent/10">{item.step}</span>
              </motion.div>
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
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white gap-2">
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
