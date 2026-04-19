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
              Conditions d'Utilisation
            </h1>
            <p className="text-lg text-muted-foreground">
              Termes et conditions régissant l'utilisation de nos services et de notre site web.
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
                <h2 className="text-2xl font-bold text-foreground mb-4">Acceptation des Conditions</h2>
                <p className="text-muted-foreground leading-relaxed">
                  En accédant à ce site web et en utilisant les services de SOMATISME, vous acceptez ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site ou nos services.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Services de SOMATISME</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  SOMATISME propose des services d'automatisme industriel, de régulation, d'installation électrique et de maintenance pour les entreprises B2B. Nos services incluent :
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Conseil et ingénierie en automatisme industriel</li>
                  <li>Conception et réalisation de systèmes de régulation</li>
                  <li>Installation électrique et câblage industriel</li>
                  <li>Maintenance préventive et curative</li>
                  <li>Formation technique</li>
                  <li>Réalisation et mise en service sur site</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Obligations du Client</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  En utilisant nos services, vous vous engagez à :
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Fournir des informations exactes et complètes</li>
                  <li>Respecter les délais de paiement convenus</li>
                  <li>Fournir un accès sécurisé à vos installations</li>
                  <li>Respecter les règles de sécurité sur site</li>
                  <li>Ne pas utiliser nos services à des fins illégales</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Propriété Intellectuelle</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Tous les éléments du site web (textes, images, logos, designs, logiciels) sont la propriété exclusive de SOMATISME ou de ses partenaires et sont protégés par les lois sur la propriété intellectuelle. Toute reproduction, modification ou utilisation non autorisée est strictement interdite.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Limitation de Responsabilité</h2>
                <p className="text-muted-foreground leading-relaxed">
                  SOMATISME s'efforce de fournir des services de haute qualité, mais ne peut garantir l'absence d'erreurs ou d'interruptions. Notre responsabilité est limitée aux montants prévus dans nos contrats et conformément à la législation en vigueur.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Prix et Paiement</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Les prix de nos services sont déterminés dans nos devis et contrats. Les modalités de paiement sont :
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Accompte de 30% à la commande</li>
                  <li>Solde à la livraison ou selon échéancier convenu</li>
                  <li>Paiement par virement bancaire ou chèque</li>
                  <li>Tout retard de paiement entraînera des pénalités de retard</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Annulation et Remboursement</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Toute annulation de commande doit être notifiée par écrit. Les conditions de remboursement dépendent du stade d'avancement du projet et seront déterminées au cas par cas, conformément à nos conditions générales de vente.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Confidentialité</h2>
                <p className="text-muted-foreground leading-relaxed">
                  SOMATISME s'engage à maintenir la confidentialité de toutes les informations techniques et commerciales partagées par nos clients. Cette obligation de confidentialité persiste après la fin de nos relations commerciales.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Modification des Conditions</h2>
                <p className="text-muted-foreground leading-relaxed">
                  SOMATISME se réserve le droit de modifier ces conditions d'utilisation à tout moment. Les modifications prendront effet dès leur publication sur notre site. Il est de votre responsabilité de consulter régulièrement ces conditions.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Loi Applicable et Juridiction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ces conditions d'utilisation sont régies par le droit marocain. Tout litige relatif à l'utilisation de nos services sera soumis à la juridiction compétente des tribunaux marocains.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter à : info@somatisme.ma ou par téléphone au 05 23 30 28 29.
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
