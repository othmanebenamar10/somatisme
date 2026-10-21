import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

function WhatsAppMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 448 512"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M380.9 97.1C339 55.1 283.2 32 224 32 101.5 32 1.9 131.6 1.9 254.1c0 39.2 10.2 77.5 29.6 111.1L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.5 0 222.1-99.6 222.1-222.1 0-59.2-23.1-115-65.1-156.9zM224 438.7c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.9 18.3 18.7-68.1-4.4-7c-18.5-29.4-28.2-63.2-28.2-98.1C39.5 148 122 65.5 223.9 65.5c49.3 0 95.7 19.2 130.6 54.1 34.9 34.9 54.1 81.3 54.1 130.6-.1 101.9-82.6 184.5-184.6 184.5zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 18-17.6 21.7c-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.4 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.5-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.7 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.4-5.1-3.8-10.6-6.5z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState('suggestion');
  const [customMessage, setCustomMessage] = useState('');
  const [location] = useLocation();

  useEffect(() => {
    // Show button immediately on page load
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  const phoneNumber = '212679825646'; // User's WhatsApp number

  const generateMessage = () => {
    const page = location.replace(/\/+$/, '') || '/';
    const contextKeyByPage: Record<string, string> = {
      '/products': 'whatsapp.context.products',
      '/services': 'whatsapp.context.services',
      '/services/automation': 'whatsapp.context.automation',
      '/services/regulation': 'whatsapp.context.regulation',
      '/services/electrical': 'whatsapp.context.electrical',
      '/services/maintenance': 'whatsapp.context.maintenance',
      '/services/conseil': 'whatsapp.context.conseil',
      '/services/formation': 'whatsapp.context.formation',
      '/services/realisation': 'whatsapp.context.realisation',
      '/contact': 'whatsapp.context.contact',
      '/projects': 'whatsapp.context.projects',
    };
    const contextKey = page.startsWith('/projects/')
      ? 'whatsapp.context.projectDetail'
      : contextKeyByPage[page] || 'whatsapp.context.default';
    return `${t('whatsapp.message.contextIntro')} ${t(contextKey)}\n\n${t('whatsapp.message.followup')}`;
  };

  const messageOptions = [
    { id: 'quote', label: t('whatsapp.choice.quote'), text: t('whatsapp.option.quote') },
    { id: 'services', label: t('whatsapp.choice.services'), text: t('whatsapp.option.services') },
    { id: 'products', label: t('whatsapp.choice.products'), text: t('whatsapp.option.products') },
    { id: 'maintenance', label: t('whatsapp.choice.maintenance'), text: t('whatsapp.option.maintenance') },
    { id: 'project', label: t('whatsapp.choice.project'), text: t('whatsapp.option.project') },
  ];
  const selectedText = selectedMessage === 'custom'
    ? customMessage.trim() || t('whatsapp.custom.empty')
    : selectedMessage === 'suggestion'
      ? generateMessage()
      : messageOptions.find((option) => option.id === selectedMessage)?.text || messageOptions[0].text;
  const message = `${t('whatsapp.message.intro')}\n\n${selectedText}\n\n${t('whatsapp.message.outro')}`;
  const canContinue = selectedMessage !== 'custom' || customMessage.trim().length > 0;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <>
      {isVisible && (
        <motion.button
          type="button"
          onClick={() => setIsOpen(true)}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-[#25D366] text-white shadow-2xl shadow-green-500/50 hover:bg-[#1ebe5d] hover:shadow-green-500/70 transition-all flex items-center justify-center group"
          aria-label="WhatsApp"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          {/* WhatsApp Icon */}
          <WhatsAppMark className="relative z-10 h-8 w-8" />

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-full mr-3 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none"
          >
            {t('whatsapp.tooltip')}
            <div className="absolute left-full top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900"></div>
          </motion.div>
        </motion.button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="whatsapp-dialog-title"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <h2 id="whatsapp-dialog-title" className="text-lg font-bold text-slate-900">
                  {t('whatsapp.dialog.title')}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {t('whatsapp.dialog.description')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label={t('whatsapp.dialog.close')}
                autoFocus
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5">
              <label htmlFor="whatsapp-message-choice" className="mb-2 block text-sm font-semibold text-slate-800">
                {t('whatsapp.choice.label')}
              </label>
              <select
                id="whatsapp-message-choice"
                value={selectedMessage}
                onChange={(event) => setSelectedMessage(event.target.value)}
                className="mb-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              >
                <option value="suggestion">{t('whatsapp.choice.suggestion')}</option>
                {messageOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
                <option value="custom">{t('whatsapp.choice.custom')}</option>
              </select>
              {selectedMessage === 'custom' && (
                <textarea
                  value={customMessage}
                  onChange={(event) => setCustomMessage(event.target.value.slice(0, 1000))}
                  placeholder={t('whatsapp.custom.placeholder')}
                  rows={3}
                  maxLength={1000}
                  className="mb-4 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                />
              )}
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{t('whatsapp.preview')}</p>
              <div className="max-h-56 overflow-y-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {message}
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                {t('whatsapp.disclaimer')}
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {t('whatsapp.cancel')}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!canContinue}
                tabIndex={canContinue ? 0 : -1}
                onClick={(event) => {
                  if (!canContinue) {
                    event.preventDefault();
                    return;
                  }
                  setIsOpen(false);
                }}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${canContinue ? 'bg-green-600 hover:bg-green-700' : 'pointer-events-none bg-green-600/50'}`}
              >
                <WhatsAppMark className="h-4 w-4" />
                {t('whatsapp.continue')}
              </a>
            </div>
          </motion.section>
        </div>
      )}
    </>
  );
}
