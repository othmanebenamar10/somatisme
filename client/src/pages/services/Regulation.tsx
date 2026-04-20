import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/**
 * SOMATISME - Service: Régulation & Instrumentation
 * Design: Minimalisme Technologique Épuré
 */

export default function Regulation() {
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
              Régulation & <span className="text-accent">Instrumentation</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Solutions de mesure et de contrôle de précision pour vos processus critiques, garantissant une performance optimale et une conformité aux normes.
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
              <h2 className="text-heading text-foreground mb-6">Nos Compétences</h2>
              <div className="space-y-4">
                {[
                  'Installation de capteurs et transmetteurs',
                  'Systèmes de régulation avancés',
                  'Calibration d\'instruments de précision',
                  'Monitoring en temps réel',
                  'Acquisition de données',
                  'Conformité aux normes internationales',
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
                alt="Régulation & Instrumentation"
                className="rounded-lg shadow-lg w-full"
              />
            </motion.div>
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
                title: 'Précision Garantie',
                description: 'Mesures précises et fiables pour un contrôle optimal de vos processus.',
              },
              {
                title: 'Conformité Normes',
                description: 'Respect des normes ISO et réglementations industrielles.',
              },
              {
                title: 'Support Technique',
                description: 'Assistance continue et maintenance préventive de vos systèmes.',
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
              Besoin de solutions de régulation ?
            </h2>
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-primary gap-2">
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
