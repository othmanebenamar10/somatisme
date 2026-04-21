import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Mail, Phone, MapPin, ArrowRight, User, Building, MessageSquare, Send, CheckCircle2, ShieldCheck, ClipboardCheck, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * SOMATISME - Page Contact
 * Design: Minimalisme Technologique Épuré
 */

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });
  const [botField, setBotField] = useState(''); // Anti-spam Honeypot
  const [formStartTime] = useState(() => Date.now()); // Timing bot detection
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getToken } = useRecaptcha();
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Contact Info, Step 2: Details, Step 3: Confirm
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) errors.name = 'Le nom est requis';
      if (!formData.email.trim()) errors.email = 'L\'email est requis';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) errors.email = 'Email invalide';
      if (formData.phone) {
        const phoneRegex = /^(06\d{8}|(\+212|00212)\d{9})$/;
        if (!phoneRegex.test(formData.phone)) errors.phone = 'Téléphone invalide';
      }
    }

    if (step === 2) {
      if (!formData.subject.trim()) errors.subject = 'Le sujet est requis';
      if (!formData.message.trim()) errors.message = 'Le message est requis';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    if (currentStep < 3) {
      handleNextStep();
      return;
    }

    // Sécurité : Si le champ caché est rempli, c'est un bot
    if (botField) {
      toast.error('Erreur de soumission');
      return;
    }

    // Timing bot check: humans take > 3 seconds to fill a multi-step form
    if (Date.now() - formStartTime < 3000) {
      toast.error('Erreur de soumission');
      return;
    }

    // Show terms dialog first
    setShowTermsDialog(true);
  };

  const handleTermsAccept = async () => {
    if (!termsAccepted) return;
    setShowTermsDialog(false);
    setIsSubmitting(true);

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await getToken('contact_form');

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
          _duration: Date.now() - formStartTime,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || t('contact.form.success'));
        setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
      } else {
        toast.error(data.error || t('contact.form.error'));
      }
    } catch (error) {
      toast.error(t('contact.form.error'));
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
      setTermsAccepted(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section - RADICAL NEW DESIGN */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-slate-800 to-primary">
        {/* Animated Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animation: 'float 8s ease-in-out infinite' }}></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-cyan-400/10 rounded-full blur-[120px] animate-pulse" style={{ animation: 'float 10s ease-in-out infinite 2s' }}></div>

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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/40 backdrop-blur-sm mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              <span className="text-accent font-bold text-sm uppercase tracking-widest">Nous Contacter</span>
            </motion.div>

            <h1 className="text-7xl md:text-8xl font-black text-white mb-8 leading-tight">
              Parlons de Votre <br />
              <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent">Projet</span>
            </h1>
            <p className="text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {t('contact.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section - Ultra Pro */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-card opacity-30"></div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="card-premium p-6 mb-8">
                <h3 className="text-subheading text-foreground mb-2">{t('contact.info.title')}</h3>
                <div className="divider-gradient w-16 mb-4"></div>
                <p className="text-sm text-muted-foreground">Notre equipe est a votre disposition pour repondre a toutes vos questions.</p>
              </div>

              {[
                {
                  icon: Phone,
                  title: t('contact.info.phone'),
                  value: '05 23 30 28 29',
                  href: 'tel:+212523302829',
                },
                {
                  icon: MapPin,
                  title: t('contact.info.hq'),
                  value: t('contact.info.hq.address'),
                  href: '#',
                },
                {
                  icon: Mail,
                  title: t('contact.info.email'),
                  value: 'info@somatisme.ma',
                  href: 'mailto:info@somatisme.ma',
                },
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="card-glass p-4 flex items-start gap-4 group"
                >
                  <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent group-hover:text-white transition-all">
                    <item.icon className="text-accent group-hover:text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>

            {/* Contact Form - STEP BY STEP */}
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              onSubmit={handleSubmit}
              className="lg:col-span-2 card-premium p-8 md:p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-3xl -mr-32 -mt-32"></div>

              {/* Step Indicator */}
              <div className="mb-10 pb-8 border-b border-border/50">
                <div className="flex items-center justify-between mb-6">
                  {[1, 2, 3].map((step) => (
                    <motion.div
                      key={step}
                      className="flex flex-col items-center flex-1"
                      animate={{ opacity: currentStep >= step ? 1 : 0.4 }}
                    >
                      <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all ${
                          currentStep >= step
                            ? 'bg-gradient-to-r from-accent to-secondary text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                        animate={{ scale: currentStep === step ? 1.1 : 1 }}
                      >
                        {currentStep > step ? '✓' : step}
                      </motion.div>
                      <span className="text-xs font-semibold text-foreground text-center">
                        {step === 1 && 'Infos'}
                        {step === 2 && 'Détails'}
                        {step === 3 && 'Confirmer'}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-secondary"
                    animate={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <ClipboardCheck className="text-accent" size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {currentStep === 1 && 'Vos Informations'}
                  {currentStep === 2 && 'Détails de la Demande'}
                  {currentStep === 3 && 'Résumé & Confirmation'}
                </h3>
              </div>

              {/* Anti-spam Honeypot (Invisible) */}
              <input 
                type="text" 
                className="hidden" 
                value={botField} 
                onChange={(e) => setBotField(e.target.value)} 
              />

              {/* STEP 1: Contact Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        {t('contact.form.name')}
                      </label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={t('contact.form.name.placeholder')}
                          className={`pl-10 bg-background/50 border-border focus:border-accent/50 focus:ring-accent/20 transition-all h-12 rounded-xl ${formErrors.name ? 'border-destructive' : ''}`}
                        />
                      </div>
                      {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        {t('contact.form.email')}
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t('contact.form.email.placeholder')}
                          className={`pl-10 bg-background/50 border-border focus:border-accent/50 focus:ring-accent/20 transition-all h-12 rounded-xl ${formErrors.email ? 'border-destructive' : ''}`}
                        />
                      </div>
                      {formErrors.email && <p className="text-xs text-destructive mt-1">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        {t('contact.form.phone')}
                      </label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder={t('contact.form.phone.placeholder')}
                          className={`pl-10 bg-background/50 border-border focus:border-accent/50 focus:ring-accent/20 transition-all h-12 rounded-xl ${formErrors.phone ? 'border-destructive' : ''}`}
                        />
                      </div>
                      {formErrors.phone && <p className="text-xs text-destructive mt-1">{formErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        {t('contact.form.company')}
                      </label>
                      <div className="relative group">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                        <Input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder={t('contact.form.company.placeholder')}
                          className="pl-10 bg-background/50 border-border focus:border-accent/50 focus:ring-accent/20 transition-all h-12 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Request Details */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      {t('contact.form.subject')}
                    </label>
                    <div className="relative group">
                      <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors z-10" size={18} />
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border border-border rounded-xl bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all h-12 appearance-none cursor-pointer ${formErrors.subject ? 'border-destructive' : ''}`}
                      >
                        <option value="">{t('contact.form.subject.placeholder')}</option>
                        <option value="automation">{t('contact.form.subject.automation')}</option>
                        <option value="regulation">{t('contact.form.subject.regulation')}</option>
                        <option value="electrical">{t('contact.form.subject.electrical')}</option>
                        <option value="maintenance">{t('contact.form.subject.maintenance')}</option>
                        <option value="other">{t('contact.form.subject.other')}</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        <ArrowRight size={16} className="rotate-90" />
                      </div>
                    </div>
                    {formErrors.subject && <p className="text-xs text-destructive mt-1">{formErrors.subject}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      {t('contact.form.message')}
                    </label>
                    <div className="relative group">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className={`w-full p-4 border border-border rounded-xl bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all resize-none ${formErrors.message ? 'border-destructive' : ''}`}
                        placeholder={t('contact.form.message.placeholder')}
                      ></textarea>
                    </div>
                    {formErrors.message && <p className="text-xs text-destructive mt-1">{formErrors.message}</p>}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Review & Confirm */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">Nom:</span>
                      <span className="font-semibold text-foreground">{formData.name}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <span className="font-semibold text-foreground">{formData.email}</span>
                    </div>
                    {formData.phone && (
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">Téléphone:</span>
                        <span className="font-semibold text-foreground">{formData.phone}</span>
                      </div>
                    )}
                    {formData.company && (
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">Entreprise:</span>
                        <span className="font-semibold text-foreground">{formData.company}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-muted-foreground">Sujet:</span>
                        <span className="font-semibold text-foreground">{formData.subject}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">Message:</span>
                        <span className="font-semibold text-foreground text-right max-w-xs">{formData.message.substring(0, 50)}...</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                    ✓ Vérifiez vos informations avant de soumettre. Vous recevrez une confirmation par email.
                  </p>
                </motion.div>
              )}

              <div className="flex items-center gap-2 mb-8 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                <ShieldCheck size={16} className="text-accent" />
                <span>{t('contact.form.privacy')}</span>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {currentStep > 1 && (
                  <motion.button
                    type="button"
                    onClick={handlePrevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 border-2 border-accent/30 text-accent rounded-xl font-bold uppercase tracking-wide hover:border-accent/60 hover:bg-accent/10 transition-all h-14"
                  >
                    ← Précédent
                  </motion.button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white gap-2 h-14 rounded-xl text-lg font-bold shadow-lg shadow-cyan-500/20 group overflow-hidden relative uppercase tracking-wide ${currentStep > 1 ? '' : 'w-full'}`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? 'Envoi...' : (
                      <>
                        {currentStep === 3 ? 'Envoyer' : 'Suivant'}
                        <Send size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </>
                    )}
                  </span>
                  {!isSubmitting && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                  )}
                </Button>
              </div>
            </motion.form>

          </div>

          {/* Google Maps Integration */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 rounded-3xl overflow-hidden border-2 border-accent/20 shadow-2xl shadow-accent/10 h-[400px] relative"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.4441551046!2d-7.3871439!3d33.684534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDQxJzA0LjMiTiA3wrAyMycxMy43Ilc!5e0!3m2!1sfr!2sma!4v1713600000000!5m2!1sfr!2sma" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale contrast-125 opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section - Ultra Pro */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20"></div>
        <div className="container max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-heading text-foreground mb-4">{t('contact.faq.title')}</h2>
            <div className="divider-gradient w-24 mx-auto"></div>
          </motion.div>
          <div className="space-y-6">
            {[
              { q: t('contact.faq.q1'), a: t('contact.faq.a1') },
              { q: t('contact.faq.q2'), a: t('contact.faq.a2') },
              { q: t('contact.faq.q3'), a: t('contact.faq.a3') },
              { q: t('contact.faq.q4'), a: t('contact.faq.a4') }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3 }}
                className="card-premium p-6"
              >
                <h4 className="font-bold text-foreground mb-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-sm">{i + 1}</div>
                  {item.q}
                </h4>
                <p className="text-sm text-muted-foreground pl-11">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('contact.terms.title')}</DialogTitle>
            <DialogDescription>{t('contact.terms.description')}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2 my-4 text-sm text-muted-foreground space-y-4">
            <div className="space-y-4">
              <h3 className="font-bold text-foreground">Acceptation des Conditions</h3>
              <p>En soumettant ce formulaire, vous acceptez que SOMATISME traite vos données personnelles aux fins de répondre à votre demande de devis ou de service.</p>

              <h3 className="font-bold text-foreground">Collecte des Données</h3>
              <p>Nous collectons vos informations de contact (nom, email, téléphone, entreprise) et les détails de votre projet uniquement pour vous fournir nos services industriels.</p>

              <h3 className="font-bold text-foreground">Utilisation des Données</h3>
              <p>Vos données sont utilisées pour traiter vos demandes, vous fournir des informations sur nos solutions, et communiquer avec vous sur vos projets. Nous ne vendons ni ne louons vos données à des tiers.</p>

              <h3 className="font-bold text-foreground">Protection des Données</h3>
              <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre l'accès non autorisé, conformément à la réglementation en vigueur.</p>

              <h3 className="font-bold text-foreground">Vos Droits</h3>
              <p>Vous avez le droit d'accéder, rectifier, supprimer ou limiter le traitement de vos données personnelles. Pour exercer ces droits, contactez-nous à info@somatisme.ma.</p>

              <h3 className="font-bold text-foreground">Délai de Conservation</h3>
              <p>Vos données sont conservées uniquement pendant la durée nécessaire à la prestation de nos services et conformément aux obligations légales.</p>

              <h3 className="font-bold text-foreground">Contact</h3>
              <p>Pour toute question concernant le traitement de vos données, contactez-nous à info@somatisme.ma ou par téléphone au 05 23 30 28 29.</p>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-border">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-border text-accent focus:ring-accent"
              />
              <span className="text-sm text-foreground">
                {t('contact.terms.accept')}
              </span>
            </label>
            <Button
              onClick={handleTermsAccept}
              disabled={!termsAccepted}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-accent-foreground"
            >
              {t('contact.terms.submit')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
