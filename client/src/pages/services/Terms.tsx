import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * SOMATISME - Conditions d'Utilisation
 */

export default function Terms() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section - RADICAL DESIGN */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-purple-900 to-primary">
        {/* Animated Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/50 rounded-full blur-[120px] animate-pulse" style={{ animation: 'float 8s ease-in-out infinite' }}></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-secondary/40 rounded-full blur-[120px] animate-pulse" style={{ animation: 'float 10s ease-in-out infinite 2s' }}></div>

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
              <span className="text-accent font-bold text-sm uppercase tracking-widest">Termes & Conditions</span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
              Conditions <br />
              <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent">d'Utilisation</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Termes et conditions régissant l'utilisation de nos services et de notre site web.
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
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">✓ Acceptation des Conditions</h2>
              <p className="text-muted-foreground leading-relaxed">
                En accédant à ce site web et en utilisant les services de SOMATISME, vous acceptez ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site ou nos services.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-8 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">⚙️ Services de SOMATISME</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SOMATISME propose des services d'automatisme industriel, de régulation, d'installation électrique et de maintenance pour les entreprises B2B. Nos services incluent :
              </p>
              <ul className="space-y-3">
                {['Conseil et ingénierie en automatisme industriel', 'Conception et réalisation de systèmes de régulation', 'Installation électrique et câblage industriel', 'Maintenance préventive et curative', 'Formation technique', 'Réalisation et mise en service sur site'].map((item, i) => (
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
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">📋 Obligations du Client</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                En utilisant nos services, vous vous engagez à :
              </p>
              <ul className="space-y-3">
                {['Fournir des informations exactes et complètes', 'Respecter les délais de paiement convenus', 'Fournir un accès sécurisé à vos installations', 'Respecter les règles de sécurité sur site', 'Ne pas utiliser nos services à des fins illégales'].map((item, i) => (
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
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">🔐 Propriété Intellectuelle</h2>
              <p className="text-muted-foreground leading-relaxed">
                Tous les éléments du site web (textes, images, logos, designs, logiciels) sont la propriété exclusive de SOMATISME ou de ses partenaires et sont protégés par les lois sur la propriété intellectuelle. Toute reproduction, modification ou utilisation non autorisée est strictement interdite.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-8 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">⚖️ Limitation de Responsabilité</h2>
              <p className="text-muted-foreground leading-relaxed">
                SOMATISME s'efforce de fournir des services de haute qualité, mais ne peut garantir l'absence d'erreurs ou d'interruptions. Notre responsabilité est limitée aux montants prévus dans nos contrats et conformément à la législation en vigueur.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-8 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">💳 Prix et Paiement</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Les prix de nos services sont déterminés dans nos devis et contrats. Les modalités de paiement sont :
              </p>
              <ul className="space-y-3">
                {['Accompte de 30% à la commande', 'Solde à la livraison ou selon échéancier convenu', 'Paiement par virement bancaire ou chèque', 'Tout retard de paiement entraînera des pénalités de retard'].map((item, i) => (
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
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">🔄 Annulation et Remboursement</h2>
              <p className="text-muted-foreground leading-relaxed">
                Toute annulation de commande doit être notifiée par écrit. Les conditions de remboursement dépendent du stade d'avancement du projet et seront déterminées au cas par cas, conformément à nos conditions générales de vente.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-8 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">🤝 Confidentialité</h2>
              <p className="text-muted-foreground leading-relaxed">
                SOMATISME s'engage à maintenir la confidentialité de toutes les informations techniques et commerciales partagées par nos clients. Cette obligation de confidentialité persiste après la fin de nos relations commerciales.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-8 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">📝 Modification des Conditions</h2>
              <p className="text-muted-foreground leading-relaxed">
                SOMATISME se réserve le droit de modifier ces conditions d'utilisation à tout moment. Les modifications prendront effet dès leur publication sur notre site. Il est de votre responsabilité de consulter régulièrement ces conditions.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
