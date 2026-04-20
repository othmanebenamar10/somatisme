import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Cpu, Zap, Shield, Wrench, ClipboardList, GraduationCap, HardHat, Activity, LayoutGrid } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * SOMATISME - Page Services
 * Design: Minimalisme Technologique Épuré
 */

export default function Services() {
  const { t } = useLanguage();
  
  const services = [
    {
      icon: ClipboardList,
      title: t('service.conseil.title'),
      description: 'Expertise opérationnelle, tout au long de la vie de votre installation.',
      features: [
        "Expertises et diagnostics d'obsolescence (Audit de parc)",
        "Études de faisabilité technique et Industrie 4.0",
        "Optimisation énergétique et rendement (OEE/TRS)",
        "Définition d'architectures (Centralisé, Distribué, Cloud)",
        "Analyses fonctionnelles détaillées et spécifications",
        "Rédaction d'APS, APD et cahiers des charges fonctionnels",
        "Audit de cybersécurité des réseaux industriels",
      ],
      href: '/services/conseil',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663572602219/DJ3UxwC3g4oRjvX9YeHeX4/somatisme-automation-tech-FSEKAzPRsDfEawe3XPbZBV.webp',
    },
    {
      icon: Cpu,
      title: t('service.automation.title'),
      description: 'De l’automate programmable aux systèmes automatisés les plus complexes et réseaux élaborés.',
      features: [
        "Automates : Siemens (S7-1200/1500), Schneider (M580/M340), Rockwell",
        "Migration de systèmes (Retrofit S5 vers S7, TSX vers M580)",
        "Systèmes SCADA complexes (WinCC, Ignition, PCVue)",
        "Régulation de process et boucles PID complexes",
        "Réseaux industriels (Profinet, EtherNet/IP, Modbus TCP)",
        "Interfaçage HMI ergonomique et gestion de Batch",
      ],
      href: '/services/automation',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663572602219/DJ3UxwC3g4oRjvX9YeHeX4/somatisme-automation-tech-FSEKAzPRsDfEawe3XPbZBV.webp',
    },
    {
      icon: Zap,
      title: t('service.electrical.title'),
      description: 'Parce que l\'automation en a aussi besoin... SOMATISME met son énergie à votre disposition.',
      features: [
        "Conception et réalisation de TGBT et tableaux de distribution",
        "Câblage d'armoires de commande et relayage en atelier",
        "Installation de variateurs de puissance jusqu'à 330KW",
        "Analyse de la qualité d'énergie (harmoniques, facteur de puissance)",
        "Mise en conformité selon les normes NFC 15-100",
        "Audit thermographique et diagnostic d'installations",
      ],
      href: '/services/electrical',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663572602219/DJ3UxwC3g4oRjvX9YeHeX4/somatisme-electrical-installation-oYfQNxYRmAM255cbCAQrfv.webp',
    },
    {
      icon: HardHat,
      title: t('service.realisation.title'),
      description: 'Montage et mise en service sur site : La maîtrise technique et la tenue des délais.',
      features: [
        "Supervision technique de montage et coordination (PPSPS)",
        "Installation d'équipements : cheminements et raccordements",
        "Tests de continuité et vérification du câblage I/O",
        "Mise en service industrielle et validation des performances (SAT)",
        "Assistance au démarrage et remise du dossier (DOE)",
      ],
      href: '/services/realisation',
      image: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80',
    },
    {
      icon: Activity,
      title: t('service.maintenance.title'),
      description: 'Assistance technique disponible : La sérénité de vos opérateurs et la disponibilité de vos installations.',
      features: [
        "Intervention corrective d'urgence sur site (24h/48h)",
        "Télédiagnostic et assistance à distance (VPN sécurisé)",
        "Maintenance préventive personnalisée et curative",
        "Mise à jour (Upgrade) software automates et SCADA",
        "Dépannage d'urgence sur variateurs et servomoteurs",
        "Audit de disponibilité et gestion de l'obsolescence",
      ],
      href: '/services/maintenance',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663572602219/DJ3UxwC3g4oRjvX9YeHeX4/somatisme-maintenance-service-SMhhN34tGncAZQFNgaur8M.webp',
    },
    {
      icon: GraduationCap,
      title: t('service.formation.title'),
      description: 'Formations à la carte, pratiques et efficaces par des hommes de terrain expérimentés.',
      features: [
        "Diagnostic de pannes sur systèmes automatisés (Niveau 1 & 2)",
        "Programmation d'automates (LADDER, SCL, GRAFCET)",
        "Maintenance et exploitation de systèmes SCADA / HMI",
        "Formation sur équipements spécifiques (Siemens, Schneider, etc.)",
      ],
      href: '/services/formation',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section - Ultra Pro */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent/15 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-primary/15 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 grid-pattern opacity-30"></div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-display text-foreground mb-6">
              Nos <span className="gradient-text">{t('nav.services')}</span>
            </h1>
            <p className="text-body-large text-muted-foreground mb-8">
              {t('services.hero.subtitle')}
            </p>
            <div className="divider-gradient w-32 mx-auto"></div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid - Ultra Pro */}
      <section className="section-padding relative">
        <div className="container space-y-24">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}
              >
                <div className="rounded-2xl overflow-hidden shadow-glow-strong border border-accent/20">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`card-premium p-8 ${index % 2 === 1 ? 'lg:order-1' : ''}`}
              >
                <div className="inline-flex p-4 rounded-xl bg-accent/10 mb-6">
                  <service.icon className="text-accent" size={32} />
                </div>
                <h2 className="text-heading text-foreground mb-4">{service.title}</h2>
                <p className="text-body-large text-muted-foreground mb-6">{service.description}</p>
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <Link href={service.href}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-accent"
                  >
                    {t('services.more')}
                    <ArrowRight size={18} className="ml-2" />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quality Standards Section - Ultra Pro */}
      <section className="section-padding section-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-20 w-64 h-64 bg-accent/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]"></div>
        </div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
              <h2 className="text-heading text-white mb-6">{t('services.quality.title')}</h2>
              <p className="text-body-large text-gray-300 mb-8">
                {t('services.quality.desc')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {['item1', 'item2', 'item3', 'item4'].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="card-glass px-4 py-3"
                  >
                    <div className="flex gap-3 items-center">
                      <Shield className="text-accent shrink-0" size={20} />
                      <p className="text-sm font-medium text-white">{t(`services.quality.${item}`)}</p>
                    </div>
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
                <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80" alt="Qualité" className="w-full h-full object-cover" />
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
              {t('services.cta.title')}
            </h2>
            <p className="text-body-large text-muted-foreground max-w-2xl mx-auto mb-10">
              {t('services.cta.desc')}
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-accent text-lg px-10 py-5"
              >
                {t('cta.contact')}
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
