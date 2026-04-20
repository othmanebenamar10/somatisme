import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * SOMATISME - Service: Maintenance Industrielle
 * Design: Minimalisme Technologique Épuré
 */

export default function Maintenance() {
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
              {t('service.maintenance.title').split(' ')[0]} <span className="text-accent">{t('service.maintenance.title').split(' ')[1]}</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t('service.maintenance.hero')}
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 gap-2">
                {t('service.conseil.btn')}
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
                  'Contrats de maintenance préventive personnalisés',
                  'Intervention corrective d\'urgence sur site sous 24h/48h',
                  'Télédiagnostic et assistance à distance (VPN sécurisé)',
                  'Mise à jour (Upgrade) de softwares automates et SCADA',
                  'Dépannage d\'urgence sur variateurs de vitesse et servomoteurs',
                  'Analyse de panne approfondie avec rapports techniques',
                  'Audit de disponibilité et gestion de l\'obsolescence composants',
                  'Support technique aux équipes d\'exploitation locales',
                  'Réapprovisionnement et conseil sur les stocks critiques',
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
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663572602219/DJ3UxwC3g4oRjvX9YeHeX4/somatisme-maintenance-service-SMhhN34tGncAZQFNgaur8M.webp"
                alt="Maintenance Industrielle"
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
                title: 'Continuité de Service',
                description: 'Minimisez les arrêts de production avec notre support réactif.',
              },
              {
                title: 'Réduction des Coûts',
                description: 'La maintenance préventive réduit les coûts de réparation d\'urgence.',
              },
              {
                title: 'Expertise Reconnue',
                description: 'Nos techniciens certifiés garantissent une qualité professionnelle.',
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
              Besoin de maintenance industrielle ?
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
