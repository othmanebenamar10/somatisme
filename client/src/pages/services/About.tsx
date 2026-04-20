import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight, Award, Users, Zap, CheckCircle2, TrendingUp, ShieldCheck, HeartPulse, Globe, Cpu, Settings, Factory } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * SOMATISME - Page À Propos
 * Contenu détaillé : Secteurs, Croissance, Bilan et Culture
 */

export default function About() {
  const { t } = useLanguage();

  const partners = [
    { name: 'Procter & Gamble', url: 'https://www.pg.ma', desc: 'Leader mondial des produits de grande consommation.', logoUrl: '/pg.png' },
    { name: 'Smart Strategies', url: 'https://www.smartstrategies.ma', desc: 'Société spécialisée dans l\'industrie de la sidérurgie.', logoUrl: '/brands/Smart-Strategies.png' },
    { name: 'Espace Metal', url: 'http://www.espacemetal.net/', desc: 'Chaudronnerie, charpente métallique et tuyauterie.', logoUrl: '/brands/Espace-Metal.png' },
    { name: 'Comaprom', url: '#', desc: 'Produits métallurgiques et industrie du tube soudé.', logoUrl: '/brands/Comaprom.png' },
    { name: 'Electroprint', url: '#', desc: 'Solutions avancées de marquage et impression industrielle.', logoUrl: '/brands/Electroprint.png' },
    { name: 'FATER', url: '#', desc: 'Partenaire industriel majeur en produits d\'hygiène et santé.', logoUrl: '/brands/FATER.png' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section - Ultra Pro */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-accent/15 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/15 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 grid-pattern opacity-30"></div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-display text-foreground mb-6">
              {t('nav.about')}
            </h1>
            <p className="text-body-large text-muted-foreground mb-8">
              {t('about.hero.subtitle')}
            </p>
            <div className="divider-gradient w-32 mx-auto"></div>
          </motion.div>
        </div>
      </section>

      {/* Secteurs d'activité - Ultra Pro */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-card opacity-30"></div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-heading text-foreground mb-4">{t('about.sectors.title')}</h2>
            <p className="text-body-large text-muted-foreground">{t('about.sectors.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "agro", "auto", "chimie", "ciment",
              "medical", "metallurgie", "micro", "pharmacie",
              "plasturgie", "energie", "siderurgie", "sante", "eau"
            ].map((sector, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ x: 5, scale: 1.02 }}
                className="card-glass px-4 py-3 flex items-center gap-3"
              >
                <CheckCircle2 className="text-accent w-5 h-5" />
                <span className="font-medium text-foreground">{t(`sector.${sector}`)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Croissance et Finance - Ultra Pro */}
      <section className="section-padding section-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-20 w-64 h-64 bg-accent/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]"></div>
        </div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="inline-flex p-4 rounded-xl bg-accent/10 mb-6 text-accent">
                <TrendingUp size={32} />
              </div>
              <h2 className="text-heading text-white mb-6">{t('about.growth.title')}</h2>
              <p className="text-body-large text-gray-300 mb-8">
                {t('about.growth.desc')}
              </p>

              <div className="card-glass p-6 border-l-4 border-accent">
                <div className="flex items-center gap-4 mb-3 text-white font-bold">
                  <ShieldCheck className="text-accent" />
                  <span>{t('about.finance.title')}</span>
                </div>
                <p className="text-gray-300 italic">
                  "{t('about.finance.desc')}"
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="aspect-square rounded-2xl overflow-hidden relative group"
              >
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" alt="Industrie" className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="aspect-square card-dark rounded-2xl flex flex-col justify-center p-6"
              >
                <span className="text-5xl font-bold gradient-text">15+</span>
                <span className="text-sm text-gray-400 mt-2">Ans de stabilite</span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Section - Ultra Pro */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20"></div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading text-foreground mb-4">{t('about.infra.title')}</h2>
            <p className="text-body-large text-muted-foreground">{t('about.infra.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ y: -5 }}
              className="card-premium p-10 group"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-all">
                <Settings size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('about.infra.be.title')}</h3>
              <p className="text-muted-foreground leading-relaxed italic">
                {t('about.infra.be.desc')}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ y: -5 }}
              className="card-premium p-10 group"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-all">
                <Factory size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('about.infra.atelier.title')}</h3>
              <p className="text-muted-foreground leading-relaxed italic">
                {t('about.infra.atelier.desc')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Culture d'entreprise - Ultra Pro */}
      <section className="section-padding section-gradient relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30"></div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading text-foreground mb-4">{t('about.culture.title')}</h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
              {t('about.culture.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Cpu, key: 'passion' },
              { icon: Zap, key: 'innovation' },
              { icon: HeartPulse, key: 'service' },
              { icon: Award, key: 'integrity' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="card-premium p-8"
              >
                <item.icon className="text-accent mb-4" size={32} />
                <h3 className="text-subheading mb-3">{t(`about.culture.${item.key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`about.culture.${item.key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Ultra Pro */}
      <section className="section-padding section-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-64 h-64 bg-accent/15 rounded-full blur-[80px] animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="container relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '15+', label: 'Annees d\'experience' },
              { number: '50+', label: 'Projets realises' },
              { number: '100%', label: 'Clients satisfaits' },
              { number: '24/7', label: 'Support technique' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-glass p-6"
              >
                <p className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.number}</p>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section - Ultra Pro */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-card opacity-30"></div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading text-foreground mb-4">{t('about.partners.title')}</h2>
            <div className="divider-gradient w-24 mx-auto mb-4"></div>
            <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
              {t('about.partners.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="card-premium p-8 group text-center"
              >
                <div className="w-24 h-24 mx-auto bg-muted rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-all duration-500 border border-transparent group-hover:border-accent/20 p-4">
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${partner.name}&background=random`; }}
                  />
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                    {partner.name}
                  </h3>
                  {partner.url !== '#' && (
                    <a href={partner.url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline inline-flex items-center gap-1 mt-1">
                      {partner.url.replace('https://', '').replace('http://', '')} <Globe size={12} />
                    </a>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  {partner.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Ultra Pro */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-accent/20 rounded-full blur-[80px] animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-display text-foreground mb-6">
              {t('cta.ready')}
            </h2>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-accent text-lg px-10 py-5"
              >
                {t('cta.contact')}
                <ArrowRight size={20} className="ml-2" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
