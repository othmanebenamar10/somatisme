import { motion } from 'framer-motion';
import { ClipboardList, CheckCircle2, ArrowRight, ShieldCheck, Target, Lightbulb } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Conseil() {
  const { t } = useLanguage();

  const expertises = [
    "Expertises et diagnostics d'obsolescence (Audit de parc machine)",
    "Études de faisabilité technique et technico-économiques",
    "Recherches de solutions innovantes pour l'Industrie 4.0",
    "Optimisation énergétique des process et amélioration du rendement (OEE/TRS)",
    "Conception d'architectures de contrôle-commande (Centralisé, Distribué, Cloud)",
    "Analyses fonctionnelles détaillées et spécifications organiques",
    "Rédaction d'APS (Avant-projets sommaires) et budgétisation",
    "Dossiers d'exécution (APD) et cahiers des charges fonctionnels",
    "Gestion de projets et maîtrise d’ouvrage déléguée",
    "Aide à la décision : Analyse comparative de technologies (PLC, SCADA, Réseaux)",
    "Études de sécurité machine et conformité réglementaire",
    "Audit de cybersécurité des réseaux industriels"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border/50">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex flex-col items-center text-center max-w-4xl mx-auto"
            >
              <div className="p-4 bg-accent/10 rounded-3xl mb-8 shadow-inner">
                <ClipboardList className="text-accent w-12 h-12" />
              </div>
              <h1 className="text-display mb-6">{t('service.conseil.title').split('&')[0]} & <span className="text-accent">{t('service.conseil.title').split('&')[1]}</span></h1>
              <p className="text-2xl font-light text-muted-foreground leading-relaxed">
                {t('service.conseil.hero')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-24">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              {/* Text side */}
              <div className="lg:col-span-5 space-y-10">
                <div className="space-y-6">
                  <h2 className="text-heading text-foreground tracking-tight">{t('service.conseil.subtitle')}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {t('service.conseil.desc')}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {[
                    { icon: Target, key: "feature1" },
                    { icon: Lightbulb, key: "feature2" },
                    { icon: ShieldCheck, key: "feature3" }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                      <feature.icon className="text-accent shrink-0" size={24} />
                      <div>
                        <h4 className="font-bold text-foreground">{t(`service.conseil.${feature.key}.title`)}</h4>
                        <p className="text-sm text-muted-foreground">{t(`service.conseil.${feature.key}.desc`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* List side */}
              <div className="lg:col-span-7 grid grid-cols-1 gap-3">
                {expertises.map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: 20 }} 
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-6 bg-card border border-border rounded-2xl hover:border-accent/40 hover:shadow-md transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="font-medium text-foreground text-sm md:text-lg">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center text-primary-foreground overflow-hidden relative">
              <div className="relative z-10">
                <h2 className="text-heading mb-8">{t('service.conseil.cta')}</h2>
                <Link href="/contact">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary-foreground font-bold px-10 h-14 rounded-full gap-2">
                    {t('service.conseil.btn')}
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px] -mr-32 -mt-32"></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}