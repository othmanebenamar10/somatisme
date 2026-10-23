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
              <span className="text-accent font-bold text-sm uppercase tracking-widest">{t('privacy.hero.eyebrow')}</span>
            </motion.div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              {t('privacy.hero.titleFirst')} <br />
              <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent">{t('privacy.hero.titleAccent')}</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              {t('privacy.hero.subtitle')}
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
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">{t('privacy.intro.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacy.intro.body')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-8 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">{t('privacy.collection.title')}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('privacy.collection.lead')}
              </p>
              <ul className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                    {t(`privacy.collection.item${i}`)}
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
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">{t('privacy.use.title')}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('privacy.use.lead')}
              </p>
              <ul className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0"></span>
                    {t(`privacy.use.item${i}`)}
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
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">🔒 {t('privacy.security.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacy.security.body')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-8 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">{t('privacy.sharing.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacy.sharing.body')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-8 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">{t('privacy.rights.title')}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('privacy.rights.lead')}
              </p>
              <ul className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                    {t(`privacy.rights.item${i}`)}
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
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">📧 {t('privacy.contact.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacy.contact.body').replace('{email}', 'somatisme@gmail.com').replace('{phone}', '+212 6 79 82 56 46')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-8 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">📝 {t('privacy.updates.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacy.updates.body')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
