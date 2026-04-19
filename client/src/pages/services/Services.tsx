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
              Nos <span className="text-accent">{t('nav.services')}</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('services.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-32">
        <div className="container space-y-20">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative group grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-8 rounded-2xl transition-all duration-500 hover:bg-muted/50 border border-transparent hover:border-border/50 ${
                index % 2 === 1 ? 'md:grid-cols-2 md:auto-cols-auto' : ''
              }`}
            >
              {/* Image */}
              <motion.div 
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className={`relative ${index % 2 === 1 ? 'md:order-2' : ''}`}
              >
                <div className="rounded-xl overflow-hidden shadow-2xl border border-border">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </motion.div>

              {/* Content */}
              <motion.div 
                initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className={index % 2 === 1 ? 'md:order-1' : ''}
              >
                <div className="inline-block p-3 bg-accent/10 rounded-lg mb-4">
                  <service.icon className="text-accent" size={28} />
                </div>
                <h2 className="text-heading text-foreground mb-4">{service.title}</h2>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0 shadow-[0_0_8px_oklch(var(--accent))]"></div>
                      <span className="text-sm text-foreground/90">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href={service.href}>
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                    {t('services.more')}
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Quality Standards Section */}
      <section className="py-20 bg-muted/20 border-y border-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
              <h2 className="text-heading mb-6">{t('services.quality.title')}</h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t('services.quality.desc')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {['item1', 'item2', 'item3', 'item4'].map((item) => (
                  <div key={item} className="flex gap-3">
                    <Shield className="text-accent shrink-0" size={20} />
                    <p className="text-sm font-medium text-foreground">{t(`services.quality.${item}`)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-background"
            >
              <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80" alt="Qualité" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
            </motion.div>
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
              {t('services.cta.title')}
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              {t('services.cta.desc')}
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                {t('cta.contact')}
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
