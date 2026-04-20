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
      description: 'Installation complète d\'une ligne de production textile avec synchronisation multi-axes. Intégration de 40 variateurs de vitesse ABB ACS580, API Siemens S7-1500 pour le contrôle centralisé, et système de supervision WinCC OA pour le monitoring en temps réel. Projet réalisé pour usine textile à Casablanca.',
      category: 'Automatisme',
      tech: 'Siemens S7-1500, WinCC OA, Profinet, Variateurs ABB ACS580',
      result: '+25% de productivité, traçabilité totale, réduction des rebuts',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.22.55 PM.jpeg',
    },
    {
      title: 'Installation Électrique Complexe',
      description: 'Conception et montage de TGBT 3200A pour unité de sidérurgie. Étude de sélectivité complète, déploiement de canalisations préfabriquées, installation de disjoncteurs Schneider Masterpact, et mise en conformité NFC 15-100. Projet réalisé pour complexe sidérurgique à Jorf Lasfar.',
      category: 'Installation Électrique',
      tech: 'TGBT 3200A, Disjoncteurs Masterpact, Etude de sélectivité, Canalisations préfabriquées',
      result: 'Conformité NFC 15-100, continuité de service assurée, sécurité renforcée',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.22.55 PM (1).jpeg',
    },
    {
      title: 'Système de Régulation Avancé',
      description: 'Instrumentation complète d\'un réacteur chimique avec contrôle précis de température et pression. Installation de capteurs Endress+Hauser, vannes de régulation Fisher, et boucles PID complexes pour contrôle de réaction. Projet réalisé pour industrie chimique à Mohammedia.',
      category: 'Régulation',
      tech: 'Capteurs Endress+Hauser, Vannes de régulation Fisher, Boucles PID Yokogawa',
      result: 'Précision de mesure < 0.1%, réduction pertes matières de 15%',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.22.55 PM (2).jpeg',
    },
    {
      title: 'Maintenance Préventive 24/7',
      description: 'Contrat de maintenance globale multi-sites pour industrie agroalimentaire. Audit thermographique périodique des équipements, analyse vibratoire des moteurs critiques, supervision SCADA pour monitoring 24/7, et intervention rapide en cas d\'urgence.',
      category: 'Maintenance',
      tech: 'Audit thermographique FLIR, Analyse vibratoire Emerson, Supervision SCADA',
      result: 'Réduction de 15% des arrêts non programmés, allongement durée de vie équipements',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.22.55 PM (3).jpeg',
    },
    {
      title: 'Retrofit Presse Hydraulique 500T',
      description: 'Modernisation complète de la commande d\'une presse hydraulique 500T. Remplacement automate obsolète par architecture Fail-safe Siemens S7-1500F, installation de Safety I/O Profisafe, et intégration HMI tactile WinCC Unified. Projet réalisé pour industrie automobile à Tanger.',
      category: 'Modernisation',
      tech: 'Siemens S7-1500F, Safety I/O, Profisafe, HMI TP1200',
      result: 'Temps de cycle -18%, conformité sécurité machine CE',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.22.55 PM (4).jpeg',
    },
    {
      title: 'Contrôle Commande Station Pompage',
      description: 'Automatisation complète d\'une station de traitement d\'eau avec télégestion et remontée d\'alarmes par réseau sans fil. Installation de Schneider M580, modules Radio/GPRS pour communication à distance, et logiciel de supervision pour monitoring 24/7. Projet réalisé pour ONEE.',
      category: 'Traitement Eau',
      tech: 'Schneider M580, Radio/GPRS, Logiciel de supervision Vijeo Citect',
      result: 'Optimisation énergétique de 20%, monitoring 24/7, réduction interventions terrain',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.23.53 PM.jpeg',
    },
    {
      title: 'Modernisation Tableau de Commande',
      description: 'Remplacement d\'anciens relais par API moderne Siemens S7-1200 avec interface HMI tactile TP1200. Amélioration de la fiabilité, de l\'ergonomie, et ajout de communication Ethernet pour supervision à distance. Projet réalisé pour cimenterie à Safi.',
      category: 'Modernisation',
      tech: 'Siemens S7-1200, HMI TP1200, Communication Ethernet PROFINET',
      result: 'Disponibilité +30%, opérateurs satisfaits, diagnostic facilité',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.23.59 PM.jpeg',
    },
    {
      title: 'Installation Capteurs Industriels',
      description: 'Déploiement complet de capteurs de pression Endress+Hauser, température Yokogawa, et débit Krohne pour système de supervision centralisé. Communication 4-20mA et HART pour intégration avec SCADA. Projet réalisé pour raffinerie à Mohammedia.',
      category: 'Instrumentation',
      tech: 'Capteurs Endress+Hauser, Yokogawa, Krohne, Communication 4-20mA, HART',
      result: 'Précision améliorée, maintenance prédictive, conformité normes industrielles',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.23.59 PM (1).jpeg',
    },
    {
      title: 'Câblage Industriel',
      description: 'Installation complète de câblage industriel pour unité de production. Câbles multiconducteurs, gaines techniques, et mise aux normes. Projet réalisé pour usine pharmaceutique à Casablanca.',
      category: 'Installation Électrique',
      tech: 'Câbles Nexans, Gaines techniques, Mise aux normes',
      result: 'Conformité NFC 15-100, sécurité renforcée',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.24.10 PM.jpeg',
    },
    {
      title: 'Installation Motéducteurs',
      description: 'Installation de motéducteurs SEW-Eurodrive pour convoyeurs. Mise en service et alignement précis. Projet réalisé pour industrie logistique.',
      category: 'Automatisme',
      tech: 'Motéducteurs SEW-Eurodrive, Variateurs, Alignement',
      result: 'Fiabilité améliorée, maintenance facilitée',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.24.10 PM (1).jpeg',
    },
    {
      title: 'Tableau de Distribution Secondaire',
      description: 'Conception et montage de tableaux de distribution secondaires. Disjoncteurs, différentiels, et protection. Projet réalisé pour bâtiment tertiaire.',
      category: 'Installation Électrique',
      tech: 'Tableaux Schneider, Disjoncteurs, Protection différentielle',
      result: 'Sécurité renforcée, conformité normes',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.24.10 PM (2).jpeg',
    },
    {
      title: 'Installation Prises Industrielles',
      description: 'Installation de prises industrielles Schneider P17 pour atelier. IP44, type 17, 16A 250V. Projet réalisé pour atelier mécanique.',
      category: 'Installation Électrique',
      tech: 'Prises Schneider P17, IP44, Protection',
      result: 'Sécurité opérateurs, conformité normes',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.24.10 PM (3).jpeg',
    },
    {
      title: 'Câblage API',
      description: 'Câblage d\'API Siemens S7-1500 avec modules E/S ET200SP. PROFINET, 16 canaux. Projet réalisé pour ligne d\'assemblage.',
      category: 'Automatisme',
      tech: 'API Siemens S7-1500, Modules E/S ET200SP, PROFINET',
      result: 'Performance optimale, diagnostic facilité',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.24.59 PM.jpeg',
    },
    {
      title: 'Installation Contacteurs',
      description: 'Installation de contacteurs Siemens 3RT pour commande moteurs. 3 pôles, 24V DC. Projet réalisé pour station de pompage.',
      category: 'Installation Électrique',
      tech: 'Contacteurs Siemens 3RT, Protection moteur, 24V DC',
      result: 'Fiabilité améliorée, maintenance facilitée',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.25.40 PM.jpeg',
    },
    {
      title: 'Installation Variateurs',
      description: 'Installation de variateurs ABB ACS580 pour moteurs asynchrones. 7.5kW, contrôle vectoriel. Projet réalisé pour convoyeurs.',
      category: 'Automatisme',
      tech: 'Variateurs ABB ACS580, Contrôle vectoriel, Mise en service',
      result: 'Économie d\'énergie, contrôle précis',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.25.41 PM.jpeg',
    },
    {
      title: 'Câblage Régulateurs PID',
      description: 'Câblage de régulateurs PID Yokogawa UT520. Entrées universelles, sorties relais. Projet réalisé pour réacteur chimique.',
      category: 'Régulation',
      tech: 'Régulateurs Yokogawa UT520, Entrées universelles, Sorties relais',
      result: 'Précision de contrôle, stabilité améliorée',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.25.41 PM (1).jpeg',
    },
    {
      title: 'Installation Disjoncteurs',
      description: 'Installation de disjoncteurs Schneider Compact NSX. 250A, Micrologic, sélectivité. Projet réalisé pour TGBT.',
      category: 'Installation Électrique',
      tech: 'Disjoncteurs Schneider NSX, Micrologic, Sélectivité',
      result: 'Protection optimale, sélectivité assurée',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.25.41 PM (2).jpeg',
    },
    {
      title: 'Installation Capteurs Température',
      description: 'Installation de capteurs de température PT100. Plage -50 à +200°C, haute précision. Projet réalisé pour réacteur.',
      category: 'Instrumentation',
      tech: 'Capteurs PT100, -50 à +200°C, Haute précision',
      result: 'Précision de mesure, fiabilité',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.25.41 PM (3).jpeg',
    },
    {
      title: 'Installation Démarreurs Progressifs',
      description: 'Installation de démarreurs progressifs Schneider ATS48. Moteurs jusqu\'à 75kW. Projet réalisé pour compresseurs.',
      category: 'Installation Électrique',
      tech: 'Démarreurs Schneider ATS48, 75kW, Mise en service',
      result: 'Démarrage progressif, protection moteur',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.25.42 PM.jpeg',
    },
    {
      title: 'Installation Transformateurs',
      description: 'Installation de transformateurs de courant et de tension. Classe 0.5, 100/5A. Projet réalisé pour tableau de mesure.',
      category: 'Installation Électrique',
      tech: 'Transformateurs, Classe 0.5, 100/5A',
      result: 'Précision de mesure, conformité',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.25.42 PM (1).jpeg',
    },
    {
      title: 'Câblage HMI',
      description: 'Câblage d\'HMI Siemens TP1200 avec API S7-1500. WinCC Unified, multi-touch. Projet réalisé pour poste de commande.',
      category: 'Automatisme',
      tech: 'HMI Siemens TP1200, WinCC Unified, API S7-1500',
      result: 'Interface intuitive, supervision facilitée',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.25.43 PM.jpeg',
    },
    {
      title: 'Installation Vannes Régulation',
      description: 'Installation de vannes de régulation pneumatiques. Contrôle précis du débit. Projet réalisé pour circuit process.',
      category: 'Régulation',
      tech: 'Vannes pneumatiques, Positionneurs, Contrôle débit',
      result: 'Contrôle précis, stabilité',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.25.43 PM (1).jpeg',
    },
    {
      title: 'Installation Relais Protection',
      description: 'Installation de relais de protection numérique. Surveillance moteur, surcharge. Projet réalisé pour moteurs critiques.',
      category: 'Installation Électrique',
      tech: 'Relais de protection, Surveillance moteur, Surcharge',
      result: 'Protection optimale, diagnostic',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.25.43 PM (2).jpeg',
    },
    {
      title: 'Câblage Modules E/S',
      description: 'Câblage de modules d\'entrées/sorties Siemens ET200SP. PROFINET, 16 canaux. Projet réalisé pour armoire API.',
      category: 'Automatisme',
      tech: 'Modules E/S ET200SP, PROFINET, 16 canaux',
      result: 'Installation propre, diagnostic facilité',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.27.46 PM.jpeg',
    },
    {
      title: 'Installation Transmetteurs Pression',
      description: 'Installation de transmetteurs de pression intelligents. HART, 4-20mA, 0-100 bar. Projet réalisé pour process.',
      category: 'Instrumentation',
      tech: 'Transmetteurs pression, HART, 4-20mA, 0-100 bar',
      result: 'Précision, communication HART',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.27.46 PM (1).jpeg',
    },
    {
      title: 'Installation Analyseurs Réseau',
      description: 'Installation d\'analyseurs de qualité de réseau électrique. THD, harmoniques, EN50160. Projet réalisé pour TGBT.',
      category: 'Installation Électrique',
      tech: 'Analyseurs réseau, THD, Harmoniques, EN50160',
      result: 'Qualité réseau, conformité',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.27.46 PM (2).jpeg',
    },
    {
      title: 'Installation Variateurs Sécurité',
      description: 'Installation de variateurs de sécurité Siemens SIRIUS. STO, SS1, SIL 3. Projet réalisé pour machine dangereuse.',
      category: 'Automatisme',
      tech: 'Variateurs sécurité Siemens SIRIUS, STO, SS1, SIL 3',
      result: 'Sécurité machine, conformité CE',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.27.46 PM (3).jpeg',
    },
    {
      title: 'Câblage Transformateurs Mesure',
      description: 'Câblage de transformateurs de courant et de tension. Classe 0.5, 100/5A. Projet réalisé pour comptage.',
      category: 'Installation Électrique',
      tech: 'Transformateurs mesure, Classe 0.5, 100/5A',
      result: 'Précision comptage, conformité',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.27.47 PM.jpeg',
    },
    {
      title: 'Installation Débitmètres',
      description: 'Installation de débitmètres électromagnétiques. Précision ±0.5%, communication HART. Projet réalisé pour process.',
      category: 'Instrumentation',
      tech: 'Débitmètres électromagnétiques, ±0.5%, HART',
      result: 'Précision mesure, monitoring',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.27.47 PM (1).jpeg',
    },
    {
      title: 'Câblage API Modbus',
      description: 'Câblage de module de communication Modbus RTU. 8 entrées/8 sorties, isolé galvaniquement. Projet réalisé pour armoire.',
      category: 'Automatisme',
      tech: 'Module Modbus RTU, 8 E/S, Isolation galvanique',
      result: 'Communication fiable, isolation',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.27.47 PM (2).jpeg',
    },
    {
      title: 'Installation Câbles Industriels',
      description: 'Installation de câbles multiconducteurs 1.5mm², 3 conducteurs, cuivre, RO2. Projet réalisé pour installation industrielle.',
      category: 'Installation Électrique',
      tech: 'Câbles 1.5mm², 3 conducteurs, Cuivre, RO2',
      result: 'Conformité, durabilité',
      image: '/projects/WhatsApp Image 2026-04-19 at 11.29.05 PM.jpeg',
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section - RADICAL NEW DESIGN */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-purple-900 to-primary">
        {/* Animated Orbs */}
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-accent/50 rounded-full blur-[120px] animate-pulse" style={{ animation: 'float 8s ease-in-out infinite' }}></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-secondary/40 rounded-full blur-[120px] animate-pulse" style={{ animation: 'float 10s ease-in-out infinite 2s' }}></div>

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

            <h1 className="text-7xl md:text-8xl font-black text-white mb-8 leading-tight">
              Projets <br />
              <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent">Réussis</span>
            </h1>
            <p className="text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
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
                      className="btn-accent w-full"
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
