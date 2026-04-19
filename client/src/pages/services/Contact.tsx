import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, ArrowRight, User, Building, MessageSquare, Send, CheckCircle2, ShieldCheck, ClipboardCheck } from 'lucide-react';
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sécurité : Si le champ caché est rempli, c'est un bot
    if (botField) return;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return toast.error(t('contact.form.validation.email'));
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t('contact.form.success'));
        setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
      } else {
        toast.error(data.error || t('contact.form.error'));
      }
    } catch (error) {
      toast.error(t('contact.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

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
              {t('contact.hero.title').split(' ')[0]} <span className="text-accent">{t('contact.hero.title').split(' ')[1]}</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('contact.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-subheading text-foreground mb-6">{t('contact.info.title')}</h3>
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
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <item.icon className="text-accent" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-muted-foreground">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>

            {/* Contact Form */}
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              onSubmit={handleSubmit}
              className="lg:col-span-2 bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl -mr-16 -mt-16"></div>
              
              <div className="flex items-center gap-3 mb-10 pb-4 border-b border-border/50">
                <ClipboardCheck className="text-accent" size={24} />
                <h3 className="text-xl font-bold text-foreground">Détails de la demande</h3>
              </div>

              {/* Anti-spam Honeypot (Invisible) */}
              <input 
                type="text" 
                className="hidden" 
                value={botField} 
                onChange={(e) => setBotField(e.target.value)} 
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                      required
                      placeholder="Ex: Jean Dupont"
                      className="pl-10 bg-background/50 border-border focus:border-accent/50 focus:ring-accent/20 transition-all h-12 rounded-xl"
                    />
                  </div>
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
                      required
                      placeholder="contact@entreprise.ma"
                      className="pl-10 bg-background/50 border-border focus:border-accent/50 focus:ring-accent/20 transition-all h-12 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                      placeholder="05 XX XX XX XX"
                      className="pl-10 bg-background/50 border-border focus:border-accent/50 focus:ring-accent/20 transition-all h-12 rounded-xl"
                    />
                  </div>
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
                      placeholder="Nom de votre société"
                      className="pl-10 bg-background/50 border-border focus:border-accent/50 focus:ring-accent/20 transition-all h-12 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('contact.form.subject')}
                </label>
                <div className="relative group">
                  <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors z-10" size={18} />
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-xl bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all h-12 appearance-none cursor-pointer"
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
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('contact.form.message')}
                </label>
                <div className="relative group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full p-4 border border-border rounded-xl bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all resize-none"
                    placeholder={t('contact.form.message.placeholder')}
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-8 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                <ShieldCheck size={16} className="text-accent" />
                <span>{t('contact.form.privacy')}</span>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2 h-14 rounded-xl text-lg font-bold shadow-lg shadow-accent/20 group overflow-hidden relative"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? t('contact.form.submitting') : (
                    <>
                      {t('contact.form.submit')}
                      <Send size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </>
                  )}
                </span>
                {!isSubmitting && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                )}
              </Button>
            </motion.form>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-0">
        <div className="container">
          <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.9!2d-7.401109!3d33.6805959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7b6641b741d3d:0x7afd60ececc03ab2!2sSOMATISME!5e0!4m5!1s0xda7b6641b741d3d:0x7afd60ececc03ab2!8m2!3d33.6805959!4d-7.401109!16s%2Fg%2F11csqxwr59"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section to fill space and add value */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-4xl">
          <h2 className="text-heading text-center mb-12">{t('contact.faq.title')}</h2>
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
                className="p-6 bg-card border border-border rounded-xl"
              >
                <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  {item.q}
                </h4>
                <p className="text-sm text-muted-foreground pl-4 border-l border-border/50 ml-0.5">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
