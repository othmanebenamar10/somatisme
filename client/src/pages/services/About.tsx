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
              {t('nav.about')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('about.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Secteurs d'activité */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-12"
          >
            <h2 className="text-heading text-foreground mb-4">{t('about.sectors.title')}</h2>
            <p className="text-muted-foreground">{t('about.sectors.subtitle')}</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "agro", "auto", "chimie", "ciment",
              "medical", "metallurgie", "micro", "pharmacie",
              "plasturgie", "energie", "siderurgie", "sante", "eau"
            ].map((sector, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg border border-border/50"
              >
                <CheckCircle2 className="text-accent w-5 h-5" />
                <span className="font-medium">{t(`sector.${sector}`)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Croissance et Finance */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="inline-block p-3 bg-accent/10 rounded-full mb-6 text-accent">
                <TrendingUp size={32} />
              </div>
              <h2 className="text-heading text-foreground mb-6">{t('about.growth.title')}</h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t('about.growth.desc')}
              </p>
              
              <div className="bg-primary/5 border-l-4 border-accent p-6 rounded-r-lg">
                <div className="flex items-center gap-4 mb-3 text-primary font-bold">
                  <ShieldCheck className="text-accent" />
                  <span>{t('about.finance.title')}</span>
                </div>
                <p className="text-muted-foreground italic">
                  "{t('about.finance.desc')}"
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-muted rounded-2xl overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" alt="Industrie" className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all" />
              </div>
              <div className="aspect-square bg-accent rounded-2xl flex flex-col justify-center p-6 text-accent-foreground">
                <span className="text-4xl font-bold">15+</span>
                <span className="text-sm opacity-80">Ans de stabilité</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-heading text-foreground mb-4">{t('about.infra.title')}</h2>
            <p className="text-muted-foreground">{t('about.infra.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="p-10 bg-card border border-border rounded-3xl hover:border-accent/40 transition-colors group"
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-all">
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
              className="p-10 bg-card border border-border rounded-3xl hover:border-accent/40 transition-colors group"
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-all">
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

      {/* Culture d'entreprise */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading text-foreground mb-4">{t('about.culture.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
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
                className="bg-card p-8 rounded-xl border border-border hover:shadow-xl transition-shadow"
              >
                <item.icon className="text-accent mb-4" size={32} />
                <h3 className="text-subheading mb-3">{t(`about.culture.${item.key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`about.culture.${item.key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '15+', label: 'Années d\'expérience' },
              { number: '50+', label: 'Projets réalisés' },
              { number: '100%', label: 'Clients satisfaits' },
              { number: '24/7', label: 'Support technique' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <p className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</p>
                <p className="text-primary-foreground/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-background border-y border-border/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading text-foreground mb-4">{t('about.partners.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
                className="group p-8 bg-card rounded-2xl border border-border hover:border-accent/50 transition-all hover:shadow-xl flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-muted rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-all duration-500 border border-transparent group-hover:border-accent/20 p-4">
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

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-heading text-foreground mb-6">
              {t('cta.ready')}
            </h2>
            <Link href="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                {t('cta.contact')}
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
