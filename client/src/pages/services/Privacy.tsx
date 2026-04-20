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

      {/* Hero Section - RADICAL DESIGN */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-slate-800 to-primary">
        {/* Animated Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animation: 'float 8s ease-in-out infinite' }}></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-400/10 rounded-full blur-[120px] animate-pulse" style={{ animation: 'float 10s ease-in-out infinite 2s' }}></div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/40 backdrop-blur-sm mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              <span className="text-accent font-bold text-sm uppercase tracking-widest">Sécurité & Confidentialité</span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
              Politique de <br />
              <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent">Confidentialité</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Protection de vos données personnelles et transparence dans leur utilisation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section - RADICAL DESIGN */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-primary/5">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-8 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                SOMATISME s'engage à protéger la confidentialité de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous visitez notre site web ou utilisez nos services.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-8 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">Collecte des Données</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nous collectons les types de données suivants :
              </p>
              <ul className="space-y-3">
                {['Informations de contact (nom, email, téléphone, entreprise)', 'Informations de projet (détails techniques, besoins spécifiques)', 'Données de navigation (adresse IP, type de navigateur, système d\'exploitation)', 'Données de communication (historique des échanges, documents partagés)'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-8 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">Utilisation des Données</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Vos données personnelles sont utilisées pour :
              </p>
              <ul className="space-y-3">
                {['Traiter vos demandes de devis et de services', 'Vous fournir des informations sur nos solutions', 'Améliorer la qualité de nos services', 'Communiquer avec vous sur vos projets', 'Respecter nos obligations légales et réglementaires'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-8 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">🔒 Protection des Données</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre l'accès non autorisé, la modification, la divulgation ou la destruction. Vos données sont stockées sur des serveurs sécurisés et accessibles uniquement par le personnel autorisé.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-8 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">Partage des Données</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nous ne vendons ni ne louons vos données personnelles à des tiers. Vos données peuvent être partagées uniquement avec nos partenaires techniques nécessaires à la prestation de nos services, dans le strict respect de la confidentialité et de la réglementation en vigueur.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-8 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">Vos Droits</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Conformément à la réglementation, vous disposez des droits suivants :
              </p>
              <ul className="space-y-3">
                {['Droit d\'accès à vos données personnelles', 'Droit de rectification de vos données', 'Droit à l\'oubli', 'Droit à la portabilité des données'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-8 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">📧 Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                Pour toute question concernant cette politique de confidentialité ou l'utilisation de vos données, vous pouvez nous contacter à : <span className="text-accent font-semibold">somatisme@gmail.com</span> ou par téléphone au <span className="text-accent font-semibold">+212 679 825 646</span>.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-8 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">📝 Mises à Jour</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cette politique de confidentialité peut être mise à jour périodiquement pour refléter les changements dans nos pratiques ou les exigences légales. Nous vous informerons de toute modification importante en publiant la nouvelle politique sur notre site.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
