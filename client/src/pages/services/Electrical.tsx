import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, ShieldAlert, Zap, Layers, BarChart3 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * SOMATISME - Service: Installation Électrique Industrielle
 * Design: Minimalisme Technologique Épuré
 */

export default function Electrical() {
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
              {t('service.electrical.title').split(' ')[0]} <span className="text-accent">Industrielle</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Solutions électriques sécurisées, conformes aux normes et optimisées pour la performance de vos installations.
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
              <h2 className="text-heading text-foreground mb-6">Nos Services</h2>
              <div className="space-y-4">
                {[
                  'Conception et réalisation de TGBT et tableaux de distribution',
                  'Câblage d\'armoires de commande et de relayage en atelier',
                  'Installation de variateurs de puissance et démarreurs progressifs',
                  'Analyse de la qualité d\'énergie (harmoniques, facteur de puissance)',
                  'Mise en conformité selon les normes NFC 15-100 et internationales',
                  'Réseaux de terre et protection contre les surtensions/foudre',
                  'Instrumentation et raccordement de capteurs process',
                  'Audit thermographique et diagnostic d\'installations',
                  'Éclairage industriel intelligent et basse consommation',
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
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663572602219/DJ3UxwC3g4oRjvX9YeHeX4/somatisme-electrical-installation-oYfQNxYRmAM255cbCAQrfv.webp"
                alt="Installation Électrique Industrielle"
                className="rounded-lg shadow-lg w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Power Distribution & Quality */}
      <section className="py-20 bg-primary/5 border-y border-border">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-heading mb-4">Distribution & Qualité d'Énergie</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Une infrastructure électrique robuste est la colonne vertébrale de votre production.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                title: "TGBT Haute Puissance",
                desc: "Étude et réalisation d'armoires de distribution jusqu'à 3200A avec jeux de barres optimisés."
              },
              {
                icon: BarChart3,
                title: "Analyse Harmonique",
                desc: "Mesures et filtrage des perturbations pour protéger vos équipements électroniques sensibles."
              },
              {
                icon: ShieldAlert,
                title: "Protection Foudre",
                desc: "Mise en place de réseaux de terre et de paratonnerres conformes aux risques industriels."
              }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-card border border-border rounded-2xl">
                <item.icon className="text-accent mb-4" size={32} />
                <h4 className="font-bold mb-3">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
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
                title: 'Sécurité Maximale',
                description: 'Installations conformes aux normes de sécurité les plus strictes.',
              },
              {
                title: 'Fiabilité',
                description: 'Systèmes robustes et durables pour une continuité de service.',
              },
              {
                title: 'Efficacité Énergétique',
                description: 'Solutions optimisées pour réduire votre consommation électrique.',
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
              Besoin d'une installation électrique ?
            </h2>
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-accent-foreground gap-2">
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
