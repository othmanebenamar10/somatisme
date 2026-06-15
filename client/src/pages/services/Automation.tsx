import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Cpu, Settings, Layout, Database, Terminal, Workflow, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * SOMATISME - Service: Automatisme Industriel
 * Design: Minimalisme Technologique Épuré
 */

export default function Automation() {
  const { t } = useLanguage();

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
            className="max-w-3xl"
          >
            <h1 className="text-display text-foreground mb-6">
              Automatisme <span className="text-accent">Industriel</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Systèmes de contrôle et d'automatisation avancés pour optimiser vos processus de production et augmenter votre productivité.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 gap-2">
                Demander un devis
                <ArrowRight size={18} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-heading text-foreground mb-6">Nos Solutions</h2>
              <div className="space-y-4">
                {[
                  'Développement sur automates (Siemens S7-1200/1500, Schneider M580/M340, Rockwell)',
                  'Systèmes SCADA complexes (WinCC, Ignition, Wonderware, PCVue)',
                  'Migration de systèmes obsolètes (Retrofit de S5 vers S7, TSX vers M580)',
                  'Réseaux industriels et bus de terrain (Profinet, EtherNet/IP, Modbus TCP, EtherCAT)',
                  'Régulation de process (Boucles PID complexes, commande prédictive)',
                  'Interfaçage HMI ergonomique pour aide à l\'exploitation',
                  'Intégration de robots industriels et cobotique',
                  'Gestion de Batch et traçabilité avancée',
                  'Systèmes de sécurité machine intégrés (Failsafe)',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-accent flex-shrink-0 mt-1" size={20} />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663572602219/DJ3UxwC3g4oRjvX9YeHeX4/somatisme-automation-tech-FSEKAzPRsDfEawe3XPbZBV.webp"
                alt="Automatisme Industriel"
                className="rounded-lg shadow-lg w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advanced Technical Specifications */}
      <section className="py-20 bg-muted/10 border-y border-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-heading mb-8">Ingénierie de Contrôle</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-accent font-bold">
                    <Terminal size={18} />
                    <span>Protocoles OT</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Maîtrise complète de Profinet, EtherNet/IP, Modbus TCP/RTU, et OPC UA pour l'interopérabilité IIoT.</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-accent font-bold">
                    <Workflow size={18} />
                    <span>Standards Logiciels</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Programmation structurée conforme à la norme CEI 61131-3 (Ladder, SCL, CFC, Grafcet).</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-accent font-bold">
                    <Zap size={18} />
                    <span>Régulation PID</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Optimisation de boucles complexes, cascade, feed-forward et régulation de process critique.</p>
                </div>
              </div>
            </div>
            <div className="bg-primary/5 rounded-3xl p-10 border border-primary/10">
              <h3 className="text-xl font-bold mb-6">Approche Industrie 4.0</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">Nous intégrons des solutions de Edge Computing et de remontée de données Cloud pour transformer vos automates en véritables sources d'intelligence décisionnelle.</p>
              <ul className="space-y-4">
                {['Dashboarding temps réel', 'Maintenance prédictive via IA', 'Cybersécurité des réseaux OT'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Expertise Grid */}
      <section className="py-20 bg-muted/20 border-y border-border">
        <div className="container">
          <h2 className="text-heading text-center mb-16">Expertise Technologique</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <Cpu className="text-accent mb-4" size={32} />
              <h3 className="text-xl font-bold mb-4">PLC & Contrôle</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Siemens (TIA Portal, Step7), Schneider (Control Expert, Machine Expert), Rockwell (Studio 5000). Programmation structurée conforme CEI 61131-3.
              </p>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border">
              <Layout className="text-accent mb-4" size={32} />
              <h3 className="text-xl font-bold mb-4">HMI & SCADA</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Interfaces intuitives WinCC, Ignition, Aveva System Platform. Monitoring en temps réel, archivage de données et reporting avancé.
              </p>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border">
              <Database className="text-accent mb-4" size={32} />
              <h3 className="text-xl font-bold mb-4">Réseaux Industriels</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Architecture Profinet, EtherNet/IP, Modbus TCP. Sécurisation des flux de données et segmentation VLAN pour l'OT.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading text-foreground mb-4">Avantages</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Productivité Accrue',
                description: 'Augmentez votre rendement de production jusqu\'à 40% avec nos systèmes d\'automatisation.',
              },
              {
                title: 'Réduction des Coûts',
                description: 'Diminuez vos coûts opérationnels en automatisant les tâches répétitives.',
              },
              {
                title: 'Qualité Améliorée',
                description: 'Garantissez une qualité constante avec nos systèmes de contrôle de précision.',
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg p-8"
              >
                <h3 className="text-subheading text-foreground mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
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
              Prêt à automatiser votre production ?
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
