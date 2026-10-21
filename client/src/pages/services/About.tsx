import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight, Award, Users, Zap, CheckCircle2, TrendingUp, ShieldCheck, HeartPulse, Globe, Cpu, Settings, Factory } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const partnerTranslations: Record<'en' | 'es', Record<string, { sector: string; description: string }>> = {
  en: {
    safran: { sector: 'Aerospace & Defence', description: 'International high-technology group working in aerospace, defence and security, with a global presence and a focus on precision equipment.' },
    adf: { sector: 'Industrial Equipment', description: 'Industrial partner specializing in the design and supply of process equipment.' },
    scantech: { sector: 'Analysis & Instrumentation', description: 'Global supplier of online analysers for mining, cement and bulk-material industries, with technology focused on process quality control.' },
    ocp: { sector: 'Mining & Phosphates', description: 'Morocco-based phosphate producer and processor, and a major contributor to the country’s industrial sector.' },
    bimbo: { sector: 'Food & Beverage', description: 'International industrial bakery group operating in more than 33 countries, including Morocco. Large-scale production relies on advanced automation.' },
    somasteel: { sector: 'Steelmaking', description: 'Moroccan company specializing in steelmaking and steel processing, including the production of industrial sections and metal structures.' },
    sonasid: { sector: 'Steelmaking', description: 'Morocco’s national steel producer and a leading name in the country’s metals industry.' },
    somachame: { sector: 'Chemical Industry', description: 'Moroccan chemical and surface-treatment business producing and processing industrial chemicals for a range of sectors.' },
    danone: { sector: 'Food & Beverage', description: 'International food company active in dairy, water and medical nutrition, with high-throughput automated production lines.' },
    cocacola: { sector: 'Beverages', description: 'Global beverage company whose high-speed bottling and production processes rely on dependable automation.' },
    pg: { sector: 'Consumer Goods', description: 'Procter & Gamble makes consumer, hygiene and beauty products using highly automated production lines.' },
    fater: { sector: 'Hygiene & Healthcare', description: 'Manufacturer of hygiene and healthcare products, including absorbent products for African and international markets.' },
    leaderfood: { sector: 'Food & Beverage', description: 'Moroccan food industry business involved in processing, packaging and distributing products for the domestic market.' },
  },
  es: {
    safran: { sector: 'Aeronáutica y defensa', description: 'Grupo internacional de alta tecnología especializado en aeronáutica, defensa y seguridad, con presencia mundial y equipos de precisión.' },
    adf: { sector: 'Equipos industriales', description: 'Socio industrial especializado en el diseño y suministro de equipos para procesos industriales.' },
    scantech: { sector: 'Análisis e instrumentación', description: 'Proveedor mundial de analizadores en línea para las industrias minera, cementera y de materiales a granel, con tecnología para el control de procesos.' },
    ocp: { sector: 'Minería y fosfatos', description: 'Productor y transformador de fosfatos con sede en Marruecos y actor destacado de la industria del país.' },
    bimbo: { sector: 'Alimentación y bebidas', description: 'Grupo internacional de panificación industrial presente en más de 33 países, incluido Marruecos. Su producción a gran escala requiere automatización avanzada.' },
    somasteel: { sector: 'Siderurgia', description: 'Empresa marroquí especializada en siderurgia y transformación del acero, incluidos perfiles y estructuras metálicas para la industria.' },
    sonasid: { sector: 'Siderurgia', description: 'Productor nacional de acero de Marruecos y una empresa de referencia en la industria metalúrgica del país.' },
    somachame: { sector: 'Industria química', description: 'Empresa marroquí de productos químicos y tratamiento de superficies, con actividad para distintos sectores industriales.' },
    danone: { sector: 'Alimentación y bebidas', description: 'Empresa internacional de alimentación presente en los sectores lácteo, del agua y de la nutrición médica, con líneas de producción automatizadas de alto rendimiento.' },
    cocacola: { sector: 'Bebidas', description: 'Empresa mundial de bebidas cuyos procesos de embotellado y producción de alta velocidad requieren una automatización fiable.' },
    pg: { sector: 'Bienes de consumo', description: 'Procter & Gamble fabrica productos de consumo, higiene y belleza mediante líneas de producción altamente automatizadas.' },
    fater: { sector: 'Higiene y salud', description: 'Fabricante de productos de higiene y salud, incluidos productos absorbentes para los mercados africano e internacional.' },
    leaderfood: { sector: 'Alimentación y bebidas', description: 'Empresa marroquí del sector alimentario dedicada a la transformación, el envasado y la distribución en el mercado nacional.' },
  },
};

/**
 * SOMATISME - Page À Propos
 * Contenu détaillé : Secteurs, Croissance, Bilan et Culture
 */

export default function About() {
  const { language, t } = useLanguage();

  const partners = [
    { key: 'safran', name: 'Safran', url: 'https://www.safran-group.com', sector: 'Aéronautique & Défense', desc: 'Groupe international de haute technologie dans l\'aéronautique, la défense et la sécurité. Présence mondiale avec des équipements de haute précision.', logoUrl: '/brands/safran.png' },
    { key: 'adf', name: 'ADF', url: '#', sector: 'Équipements Industriels', desc: 'Partenaire industriel spécialisé dans la conception et la fourniture d\'équipements de process pour l\'industrie.', logoUrl: '/brands/ADF.png' },
    { key: 'scantech', name: 'Scantech Australia', url: 'https://www.scantech.com.au', sector: 'Analyse & Instrumentation', desc: 'Leader mondial des analyseurs en ligne pour l\'industrie minière, cimentière et des matériaux en vrac. Technologie de pointe pour le contrôle qualité.', logoUrl: '/brands/Scantech Australia.png' },
    { key: 'ocp', name: 'OCP', url: 'https://www.ocpgroup.ma', sector: 'Mines & Phosphates', desc: 'Office Chérifien des Phosphates – Leader mondial de la production et transformation de phosphate. Acteur clé de l\'industrie marocaine.', logoUrl: '/brands/ocp.png' },
    { key: 'bimbo', name: 'Bimbo', url: 'https://www.grupobimbo.com', sector: 'Agroalimentaire', desc: 'Multinationale de boulangerie industrielle, présente dans plus de 33 pays dont le Maroc. Production à grande échelle nécessitant une automatisation avancée.', logoUrl: '/brands/bimbo.png' },
    { key: 'somasteel', name: 'Somasteel', url: '#', sector: 'Sidérurgie', desc: 'Entreprise marocaine spécialisée dans la sidérurgie et la transformation de l\'acier. Production de profilés et structures métalliques pour l\'industrie.', logoUrl: '/brands/somasteel.png' },
    { key: 'sonasid', name: 'Sonasid', url: 'https://www.sonasid.ma', sector: 'Sidérurgie', desc: 'Société Nationale de Sidérurgie – Premier producteur d\'acier au Maroc. Filiale d\'ArcelorMittal, référence de l\'industrie métallurgique nationale.', logoUrl: '/brands/sonasid.png' },
    { key: 'somachame', name: 'Somachame', url: '#', sector: 'Industrie Chimique', desc: 'Industrie chimique et traitement de surface au Maroc. Fabrication et traitement de produits chimiques industriels pour divers secteurs.', logoUrl: '/brands/Somachame.png' },
    { key: 'danone', name: 'Danone', url: 'https://www.danone.com', sector: 'Agroalimentaire', desc: 'Multinationale agroalimentaire de référence – Produits laitiers, eaux et nutrition médicale. Ligne de production automatisée à haut débit.', logoUrl: '/brands/danone.png' },
    { key: 'cocacola', name: 'Coca-Cola', url: 'https://www.coca-cola.ma', sector: 'Boissons', desc: 'Leader mondial des boissons rafraîchissantes. Embouteillage et process industriel à grande cadence nécessitant des solutions d\'automatisation fiables.', logoUrl: '/brands/Coca-cola.png' },
    { key: 'pg', name: 'P&G', url: 'https://www.pg.com', sector: 'Grande Consommation', desc: 'Procter & Gamble – Leader mondial des produits de grande consommation, hygiène et beauté. Lignes de production hautement automatisées.', logoUrl: '/pg.png' },
    { key: 'fater', name: 'Fater', url: '#', sector: 'Hygiène & Santé', desc: 'Partenaire industriel en produits d\'hygiène et santé. Conception et fabrication de produits d\'absorption pour le marché africain et mondial.', logoUrl: '/brands/FATER.png' },
    { key: 'leaderfood', name: 'Leaderfood', url: '#', sector: 'Agroalimentaire', desc: 'Industrie agroalimentaire marocaine – Transformation, conditionnement et distribution de produits alimentaires sur le marché national.', logoUrl: '/brands/Leaderfood.png' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section - RADICAL NEW DESIGN */}
      <section className="relative min-h-[55vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-slate-800 to-primary">
        {/* Animated Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animation: 'float 8s ease-in-out infinite' }}></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-400/10 rounded-full blur-[120px] animate-pulse" style={{ animation: 'float 10s ease-in-out infinite 2s' }}></div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/40 backdrop-blur-sm mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
              <span className="text-cyan-400 font-bold text-sm uppercase tracking-widest">{t('about.hero.eyebrow')}</span>
            </motion.div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 sm:mb-8 leading-tight">
              {t('about.hero.heading')} <br />
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 bg-clip-text text-transparent">SOMATISME</span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {t('about.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Secteurs d'activité - INDUSTRIAL PROFESSIONAL DESIGN */}
      <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden bg-background">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(45, 55, 72, 0.15) 0%, transparent 50%)'
        }}></div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-6">{t('about.sectors.title')}</h2>
            <p className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">{t('about.sectors.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              "agro", "auto", "chimie", "ciment",
              "medical", "metallurgie", "micro", "pharmacie",
              "plasturgie", "energie", "siderurgie", "sante", "eau"
            ].map((sector, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-sm p-6 bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-accent/20 hover:to-secondary/20 transition-all"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="text-white w-6 h-6" />
                  </div>
                  <span className="font-bold text-foreground group-hover:text-accent transition-colors">{t(`sector.${sector}`)}</span>
                </div>
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
              <div className="inline-flex p-4 rounded-xl bg-cyan-500/10 mb-6 text-cyan-500">
                <TrendingUp size={32} />
              </div>
              <h2 className="text-heading text-white mb-6">{t('about.growth.title')}</h2>
              <p className="text-body-large text-gray-100 mb-8">
                {t('about.growth.desc')}
              </p>

              <div className="card-glass p-6 border-l-4 border-cyan-500">
                <div className="flex items-center gap-4 mb-3 text-white font-bold">
                  <ShieldCheck className="text-cyan-500" />
                  <span>{t('about.finance.title')}</span>
                </div>
                <p className="text-white italic leading-relaxed">
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
                <span className="text-sm text-gray-400 mt-2">{t('about.experience')}</span>
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
              { number: '15+', key: 'experience' },
              { number: '50+', key: 'projectsLabel' },
              { number: '100%', key: 'clients' },
              { number: '24/7', key: 'supportLabel' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-glass p-6"
              >
                <p className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.number}</p>
                <p className="text-gray-400">{t(`about.stats.${stat.key}`)}</p>
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(6,182,212,0.12)' }}
                className="card-premium p-7 group flex flex-col gap-5"
              >
                {/* Logo + sector badge */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 shrink-0 bg-white rounded-2xl flex items-center justify-center border border-border group-hover:border-cyan-400/40 transition-all p-3 shadow-sm">
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=0e7490&color=fff&bold=true&size=200`; }}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-cyan-400 transition-colors leading-tight">{partner.name}</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">{language === 'fr' ? partner.sector : partnerTranslations[language][partner.key].sector}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{language === 'fr' ? partner.desc : partnerTranslations[language][partner.key].description}</p>

                {/* Website link */}
                {partner.url !== '#' ? (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-500 hover:text-cyan-400 transition-colors mt-auto"
                  >
                    <Globe size={13} />
                    {partner.url.replace('https://www.', '').replace('https://', '')}
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground/50 mt-auto">{t('about.partner.websiteUnavailable')}</span>
                )}
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
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
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
