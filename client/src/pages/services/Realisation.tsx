import { motion } from 'framer-motion';
import { HardHat, CheckCircle2, ArrowRight, ShieldAlert, Truck, Ruler, Factory, Settings2, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Realisation() {
  const { t } = useLanguage();

  const realisationSteps = Array.from({ length: 9 }, (_, index) => t(`service.realisation.step${index + 1}`));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <section className="py-20 bg-muted/30 border-b border-border">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="p-4 bg-accent/10 rounded-2xl mb-6">
                <HardHat className="text-accent w-12 h-12" />
              </div>
              <h1 className="text-display mb-6">{t('service.realisation.title').split(' ')[0]} <span className="text-accent">{t('service.realisation.title').split(' ').slice(1).join(' ')}</span></h1>
              <p className="text-xl text-muted-foreground">
                {t('service.realisation.hero')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Expertise Domains */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-heading mb-4">{t('service.realisation.domains.title')}</h2>
              <p className="text-muted-foreground">{t('service.realisation.domains.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Factory, title: t('service.realisation.domain1.title'), desc: t('service.realisation.domain1.description') },
                { icon: Zap, title: t('service.realisation.domain2.title'), desc: t('service.realisation.domain2.description') },
                { icon: Settings2, title: t('service.realisation.domain3.title'), desc: t('service.realisation.domain3.description') }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-card border border-border rounded-2xl hover:border-accent transition-colors group">
                  <item.icon className="text-accent mb-4 group-hover:scale-110 transition-transform" size={32} />
                  <h4 className="font-bold text-xl mb-3">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content with Workflow */}
        <section className="py-20">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-heading">{t('service.realisation.subtitle')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('service.realisation.desc')}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-xl border border-border">
                    <Truck className="text-accent mb-2" size={24} />
                    <h5 className="font-bold text-sm">{t('service.realisation.logistics.title')}</h5>
                    <p className="text-xs text-muted-foreground">{t('service.realisation.logistics.description')}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl border border-border">
                    <Ruler className="text-accent mb-2" size={24} />
                    <h5 className="font-bold text-sm">{t('service.realisation.fat.title')}</h5>
                    <p className="text-xs text-muted-foreground">{t('service.realisation.fat.description')}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {realisationSteps.map((step, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: 20 }} 
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-accent/50 transition-all hover:shadow-md"
                  >
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="font-medium text-sm md:text-base">{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Safety Commitment Section */}
        <section className="py-20 bg-muted/30 border-y border-border">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-bold mb-6">
                  <ShieldAlert size={14} />
                  {t('service.realisation.safety.badge')}
                </div>
                <h2 className="text-heading mb-6">{t('service.realisation.safety.title')}</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {t('service.realisation.safety.desc')}
                </p>
                <ul className="space-y-4">
                  {[1, 2, 3, 4].map((number, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
                      <span className="font-medium text-foreground">{t(`service.realisation.safety.item${number}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:w-1/2 rounded-3xl overflow-hidden shadow-2xl border-4 border-background">
                <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80" alt={t('service.realisation.safety.imageAlt')} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-heading mb-8">{t('service.realisation.cta.title')}</h2>
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 gap-2">
                {t('service.realisation.cta.btn')}
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
