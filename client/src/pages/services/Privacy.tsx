import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * SOMATISME - Politique de Confidentialité
 */

export default function Privacy() {
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
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-display text-foreground mb-6">
              Politique de Confidentialité
            </h1>
            <p className="text-lg text-muted-foreground">
              Protection de vos données personnelles et transparence dans leur utilisation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 md:py-32">
        <div className="container max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  SOMATISME s'engage à protéger la confidentialité de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous visitez notre site web ou utilisez nos services.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Collecte des Données</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nous collectons les types de données suivants :
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Informations de contact (nom, email, téléphone, entreprise)</li>
                  <li>Informations de projet (détails techniques, besoins spécifiques)</li>
                  <li>Données de navigation (adresse IP, type de navigateur, système d'exploitation)</li>
                  <li>Données de communication (historique des échanges, documents partagés)</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Utilisation des Données</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Vos données personnelles sont utilisées pour :
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Traiter vos demandes de devis et de services</li>
                  <li>Vous fournir des informations sur nos solutions</li>
                  <li>Améliorer la qualité de nos services</li>
                  <li>Communiquer avec vous sur vos projets</li>
                  <li>Respecter nos obligations légales et réglementaires</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Protection des Données</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre l'accès non autorisé, la modification, la divulgation ou la destruction. Vos données sont stockées sur des serveurs sécurisés et accessibles uniquement par le personnel autorisé.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Partage des Données</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nous ne vendons ni ne louons vos données personnelles à des tiers. Vos données peuvent être partagées uniquement avec nos partenaires techniques nécessaires à la prestation de nos services, dans le strict respect de la confidentialité et de la réglementation en vigueur.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Vos Droits</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Conformément à la réglementation, vous disposez des droits suivants :
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Droit d'accès à vos données personnelles</li>
                  <li>Droit de rectification des données inexactes</li>
                  <li>Droit à l'effacement de vos données</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit à la portabilité des données</li>
                  <li>Droit d'opposition au traitement</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Pour toute question concernant cette politique de confidentialité ou l'utilisation de vos données, vous pouvez nous contacter à : info@somatisme.ma ou par téléphone au 05 23 30 28 29.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Mises à Jour</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Cette politique de confidentialité peut être mise à jour périodiquement pour refléter les changements dans nos pratiques ou les exigences légales. Nous vous informerons de toute modification importante en publiant la nouvelle politique sur notre site.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
