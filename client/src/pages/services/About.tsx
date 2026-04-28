import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  ArrowRight, Award, Zap, TrendingUp, ShieldCheck, HeartPulse, Globe,
  Cpu, Settings, Factory, UtensilsCrossed, Car, FlaskConical, Building2,
  Stethoscope, Hammer, Pill, Layers, Droplets, Heart, Star, Target,
  Clock, CheckCircle2, Wrench, BarChart3, Quote
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  const partners = [
    { name: 'Safran', url: 'https://www.safran-group.com', sector: 'Aéronautique & Défense', desc: 'Groupe international de haute technologie dans l\'aéronautique, la défense et la sécurité.', logoUrl: '/brands/safran.png' },
    { name: 'ADF', url: '#', sector: 'Équipements Industriels', desc: 'Partenaire industriel spécialisé dans la conception et la fourniture d\'équipements de process.', logoUrl: '/brands/ADF.png' },
    { name: 'Scantech Australia', url: 'https://www.scantech.com.au', sector: 'Analyse & Instrumentation', desc: 'Leader mondial des analyseurs en ligne pour l\'industrie minière, cimentière et des matériaux.', logoUrl: '/brands/Scantech Australia.png' },
    { name: 'OCP', url: 'https://www.ocpgroup.ma', sector: 'Mines & Phosphates', desc: 'Office Chérifien des Phosphates – Leader mondial de la production et transformation de phosphate.', logoUrl: '/brands/ocp.png' },
    { name: 'Bimbo', url: 'https://www.grupobimbo.com', sector: 'Agroalimentaire', desc: 'Multinationale de boulangerie industrielle présente dans plus de 33 pays dont le Maroc.', logoUrl: '/brands/bimbo.png' },
    { name: 'Somasteel', url: '#', sector: 'Sidérurgie', desc: 'Entreprise marocaine spécialisée dans la sidérurgie et la transformation de l\'acier.', logoUrl: '/brands/somasteel.png' },
    { name: 'Sonasid', url: 'https://www.sonasid.ma', sector: 'Sidérurgie', desc: 'Société Nationale de Sidérurgie – Premier producteur d\'acier au Maroc, filiale d\'ArcelorMittal.', logoUrl: '/brands/sonasid.png' },
    { name: 'Somachame', url: '#', sector: 'Industrie Chimique', desc: 'Industrie chimique et traitement de surface au Maroc pour divers secteurs industriels.', logoUrl: '/brands/Somachame.png' },
    { name: 'Danone', url: 'https://www.danone.com', sector: 'Agroalimentaire', desc: 'Multinationale agroalimentaire – Produits laitiers, eaux et nutrition médicale à haut débit.', logoUrl: '/brands/danone.png' },
    { name: 'Coca-Cola', url: 'https://www.coca-cola.ma', sector: 'Boissons', desc: 'Leader mondial des boissons rafraîchissantes. Embouteillage industriel à grande cadence.', logoUrl: '/brands/Coca-cola.png' },
    { name: 'P&G', url: 'https://www.pg.com', sector: 'Grande Consommation', desc: 'Procter & Gamble – Leader mondial des produits hygiène et beauté avec lignes automatisées.', logoUrl: '/pg.png' },
    { name: 'Fater', url: '#', sector: 'Hygiène & Santé', desc: 'Fabrication de produits d\'hygiène et absorption pour le marché africain et mondial.', logoUrl: '/brands/FATER.png' },
    { name: 'Leaderfood', url: '#', sector: 'Agroalimentaire', desc: 'Industrie agroalimentaire marocaine – Transformation et conditionnement de produits alimentaires.', logoUrl: '/brands/Leaderfood.png' },
  ];

  const sectors = [
    { key: 'agro',         icon: UtensilsCrossed, color: 'from-green-500 to-emerald-600',   bg: 'bg-green-500/10 border-green-500/20' },
    { key: 'auto',         icon: Car,             color: 'from-blue-500 to-blue-600',        bg: 'bg-blue-500/10 border-blue-500/20' },
    { key: 'chimie',       icon: FlaskConical,    color: 'from-purple-500 to-purple-600',    bg: 'bg-purple-500/10 border-purple-500/20' },
    { key: 'ciment',       icon: Building2,       color: 'from-stone-500 to-stone-600',      bg: 'bg-stone-500/10 border-stone-500/20' },
    { key: 'medical',      icon: Stethoscope,     color: 'from-red-500 to-red-600',          bg: 'bg-red-500/10 border-red-500/20' },
    { key: 'metallurgie',  icon: Hammer,          color: 'from-orange-500 to-orange-600',    bg: 'bg-orange-500/10 border-orange-500/20' },
    { key: 'micro',        icon: Cpu,             color: 'from-cyan-500 to-cyan-600',        bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { key: 'pharmacie',    icon: Pill,            color: 'from-pink-500 to-pink-600',        bg: 'bg-pink-500/10 border-pink-500/20' },
    { key: 'plasturgie',   icon: Layers,          color: 'from-indigo-500 to-indigo-600',    bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { key: 'energie',      icon: Zap,             color: 'from-yellow-500 to-yellow-600',    bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { key: 'siderurgie',   icon: Factory,         color: 'from-slate-500 to-slate-600',      bg: 'bg-slate-500/10 border-slate-500/20' },
    { key: 'sante',        icon: Heart,           color: 'from-rose-500 to-rose-600',        bg: 'bg-rose-500/10 border-rose-500/20' },
    { key: 'eau',          icon: Droplets,        color: 'from-teal-500 to-teal-600',        bg: 'bg-teal-500/10 border-teal-500/20' },
  ];

  const stats = [
    { value: '15+', label: 'Années d\'expérience', icon: Clock,     color: 'text-cyan-400' },
    { value: '50+', label: 'Projets réalisés',     icon: Target,    color: 'text-orange-400' },
    { value: '100%', label: 'Clients satisfaits',  icon: Star,      color: 'text-yellow-400' },
    { value: '24/7', label: 'Support technique',   icon: HeartPulse, color: 'text-rose-400' },
  ];

  const cultureValues = [
    { icon: Cpu,       key: 'passion',    gradient: 'from-cyan-500/20 to-cyan-600/5',    border: 'border-cyan-500/30',    iconColor: 'text-cyan-400',   iconBg: 'bg-cyan-500/20' },
    { icon: Zap,       key: 'innovation', gradient: 'from-orange-500/20 to-orange-600/5', border: 'border-orange-500/30', iconColor: 'text-orange-400', iconBg: 'bg-orange-500/20' },
    { icon: HeartPulse, key: 'service',   gradient: 'from-rose-500/20 to-rose-600/5',    border: 'border-rose-500/30',   iconColor: 'text-rose-400',   iconBg: 'bg-rose-500/20' },
    { icon: Award,     key: 'integrity',  gradient: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/30', iconColor: 'text-purple-400', iconBg: 'bg-purple-500/20' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ═══ HERO — 2-column layout with inline stats ═══ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-primary to-slate-900">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(0deg,transparent 24%,rgba(255,255,255,.05)25%,rgba(255,255,255,.05)26%,transparent 27%,transparent 74%,rgba(255,255,255,.05)75%,rgba(255,255,255,.05)76%,transparent 77%),linear-gradient(90deg,transparent 24%,rgba(255,255,255,.05)25%,rgba(255,255,255,.05)26%,transparent 27%,transparent 74%,rgba(255,255,255,.05)75%,rgba(255,255,255,.05)76%,transparent 77%)', backgroundSize: '50px 50px' }}></div>

        <div className="container relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — Text */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }} className="space-y-8">
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest">Notre Histoire</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight">
                À Propos de<br />
                <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 bg-clip-text text-transparent">SOMATISME</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl">
                {t('about.hero.subtitle')}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/30">
                    Contactez-nous <ArrowRight size={18} />
                  </motion.button>
                </Link>
                <Link href="/services">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="px-7 py-3.5 border-2 border-cyan-400/40 text-white font-bold rounded-xl hover:bg-cyan-400/10 transition-all flex items-center gap-2">
                    Nos Services <ArrowRight size={18} />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right — Stats grid */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.9 }}
              className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }} whileHover={{ y: -6, scale: 1.03 }}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 flex flex-col items-center text-center gap-3">
                  <div className={`p-3 rounded-xl bg-white/10 ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <p className="text-3xl sm:text-4xl font-black text-white">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-gray-400 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ SECTEURS — unique icons + colored per sector ═══ */}
      <section className="py-16 sm:py-24 lg:py-28 relative overflow-hidden bg-background">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(6,182,212,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168,85,247,0.06) 0%, transparent 50%)' }}></div>
        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-xs font-bold uppercase tracking-widest mb-4">Domaines d'expertise</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4">{t('about.sectors.title')}</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">{t('about.sectors.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sectors.map((sector, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }} whileHover={{ y: -8, scale: 1.04 }}
                className={`group relative overflow-hidden rounded-2xl border ${sector.bg} backdrop-blur-sm p-5 cursor-pointer transition-all duration-300`}>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${sector.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <sector.icon className="text-white w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors leading-tight">{t(`sector.${sector.key}`)}</span>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-br ${sector.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CROISSANCE + FINANCE ═══ */}
      <section className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary to-slate-900">
        <div className="absolute top-20 right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-slate-800/60 rounded-full blur-[100px]"></div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="inline-flex p-4 rounded-2xl bg-cyan-500/15 border border-cyan-500/20">
                <TrendingUp size={32} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4">{t('about.growth.title')}</h2>
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg">{t('about.growth.desc')}</p>
              </div>
              <motion.div whileHover={{ scale: 1.01 }}
                className="relative rounded-2xl border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm p-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-l-2xl"></div>
                <div className="pl-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Quote size={18} className="text-cyan-400" />
                    <span className="text-white font-bold text-sm">{t('about.finance.title')}</span>
                  </div>
                  <p className="text-gray-200 italic leading-relaxed text-sm sm:text-base">"{t('about.finance.desc')}"</p>
                </div>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '15+', label: 'Ans de stabilité',  icon: BarChart3, color: 'from-cyan-500 to-cyan-600' },
                { value: '50+', label: 'Projets livrés',    icon: CheckCircle2, color: 'from-green-500 to-emerald-600' },
                { value: 'ISO', label: 'Qualité garantie',  icon: ShieldCheck, color: 'from-purple-500 to-purple-600' },
                { value: 'B2B', label: 'Expertise métier',  icon: Wrench, color: 'from-orange-500 to-orange-600' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 flex flex-col items-center text-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
                    <item.icon className="text-white" size={22} />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-white">{item.value}</span>
                  <span className="text-xs text-gray-400 font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ INFRASTRUCTURE ═══ */}
      <section className="py-16 sm:py-24 relative overflow-hidden bg-background">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.1) 0%, transparent 60%)' }}></div>
        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4">Moyens & Outils</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground mb-4">{t('about.infra.title')}</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">{t('about.infra.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Bureau d'études */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} whileHover={{ y: -6 }}
              className="group relative rounded-2xl border border-border bg-card overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-cyan-400"></div>
              <div className="p-8">
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-14 h-14 shrink-0 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-all">
                    <Settings size={26} className="text-cyan-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{t('about.infra.be.title')}</h3>
                    <span className="text-xs text-cyan-500 font-semibold uppercase tracking-wider">Ingénierie & Conception</span>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">{t('about.infra.be.desc')}</p>
                <div className="flex flex-wrap gap-2">
                  {['EPLAN', 'AutoCAD', 'CAO/DAO', 'Simulation', 'Bilan puissance', 'Sélectivité'].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Atelier */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} whileHover={{ y: -6 }}
              className="group relative rounded-2xl border border-border bg-card overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-400"></div>
              <div className="p-8">
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-14 h-14 shrink-0 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-all">
                    <Factory size={26} className="text-orange-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{t('about.infra.atelier.title')}</h3>
                    <span className="text-xs text-orange-500 font-semibold uppercase tracking-wider">Mohammedia · Maroc</span>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">{t('about.infra.atelier.desc')}</p>
                <div className="flex flex-wrap gap-2">
                  {['Armoires', 'Pupitres', 'TGBT', 'FAT', 'Test continuité', 'Forte puissance'].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-500 border border-orange-500/20">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CULTURE D'ENTREPRISE ═══ */}
      <section className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-background to-primary/10">
        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4">ADN de l'entreprise</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground mb-4">{t('about.culture.title')}</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">{t('about.culture.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cultureValues.map((item, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }} whileHover={{ y: -10, scale: 1.02 }}
                className={`group relative rounded-2xl border ${item.border} bg-gradient-to-br ${item.gradient} backdrop-blur-sm p-7 overflow-hidden`}>
                <div className={`w-14 h-14 rounded-2xl ${item.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <item.icon className={item.iconColor} size={28} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{t(`about.culture.${item.key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`about.culture.${item.key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PARTENAIRES ═══ */}
      <section className="py-16 sm:py-24 relative overflow-hidden bg-background">
        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-xs font-bold uppercase tracking-widest mb-4">Références clients</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground mb-4">{t('about.partners.title')}</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full mx-auto mb-4"></div>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">{t('about.partners.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {partners.map((partner, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }} whileHover={{ y: -8 }}
                className="group relative rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 overflow-hidden transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-hover:via-cyan-500/60 transition-all duration-500"></div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 shrink-0 rounded-xl bg-white flex items-center justify-center border border-border group-hover:border-cyan-400/40 transition-all p-2.5 shadow-sm">
                    <img src={partner.logoUrl} alt={partner.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=0e7490&color=fff&bold=true&size=200`; }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-cyan-400 transition-colors">{partner.name}</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">{partner.sector}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{partner.desc}</p>

                {partner.url !== '#' ? (
                  <a href={partner.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-500 hover:text-cyan-400 transition-colors">
                    <Globe size={12} />
                    {partner.url.replace('https://www.', '').replace('https://', '')}
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground/40 italic">Site web non disponible</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary to-slate-900">
        <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500/15 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-[100px]"></div>
        <div className="container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4">{t('cta.ready')}</h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 text-base sm:text-lg">Discutons de votre prochain projet industriel. Notre équipe est disponible pour vous accompagner.</p>
            <Link href="/contact">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold px-8 py-4 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-cyan-500/30">
                {t('cta.contact')} <ArrowRight size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
