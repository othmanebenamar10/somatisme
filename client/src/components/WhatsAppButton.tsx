import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppButton() {
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
    const contextByPage: Record<string, string> = {
      '/products': 'vos équipements industriels. Pourriez-vous me renseigner sur les caractéristiques, le prix et la disponibilité d’un produit ?',
      '/services': 'vos services industriels. J’aimerais vous présenter mon besoin et connaître les solutions que vous proposez.',
      '/services/automation': 'vos solutions d’automatisme industriel. J’aimerais vous présenter mon besoin et échanger avec un spécialiste.',
      '/services/regulation': 'vos solutions de régulation et d’instrumentation. J’aimerais vous présenter mon besoin et échanger avec un spécialiste.',
      '/services/electrical': 'vos services d’électricité industrielle. J’aimerais vous présenter mon projet et échanger avec un spécialiste.',
      '/services/maintenance': 'vos services de maintenance industrielle. J’aimerais vous présenter mon besoin et connaître vos disponibilités.',
      '/services/conseil': 'vos services de conseil industriel. J’aimerais vous présenter mon projet et connaître votre accompagnement.',
      '/services/formation': 'vos formations techniques. J’aimerais connaître les sujets proposés et les prochaines disponibilités.',
      '/services/realisation': 'vos réalisations industrielles. J’aimerais échanger avec vous au sujet de mon projet.',
      '/contact': 'un projet industriel. J’aimerais échanger avec votre équipe pour vous expliquer mon besoin.',
      '/projects': 'vos réalisations industrielles. J’aimerais savoir si vous pouvez m’accompagner sur un projet similaire.',
    };
    const context = page.startsWith('/projects/')
      ? 'l’un de vos projets industriels. J’aimerais échanger avec vous au sujet d’un besoin similaire.'
      : contextByPage[page] || 'une solution d’automatisme industriel. J’aimerais vous présenter mon besoin et recevoir vos conseils.';

    return `Bonjour l’équipe SOMATISME,\n\nJe vous contacte au sujet de ${context}\n\nPouvez-vous me répondre ici pour que nous en discutions ?\n\nMerci.`;
  };

  const messageOptions = [
    { id: 'quote', label: 'Demander un devis', text: 'Je souhaite recevoir un devis pour un besoin ou un équipement industriel. Pouvez-vous me guider ?' },
    { id: 'services', label: 'Découvrir vos services', text: 'Je souhaite en savoir plus sur vos services en automatisme, régulation et électricité industrielle.' },
    { id: 'products', label: 'Question sur un produit', text: 'Je souhaite obtenir des informations sur un équipement industriel, notamment son prix, ses caractéristiques et sa disponibilité.' },
    { id: 'maintenance', label: 'Maintenance industrielle', text: 'Je recherche une solution de maintenance industrielle et souhaite échanger avec vous au sujet de mon installation.' },
    { id: 'project', label: 'Présenter un projet', text: 'J’ai un projet industriel à vous présenter et aimerais discuter des solutions possibles avec votre équipe.' },
  ];
  const selectedText = selectedMessage === 'custom'
    ? customMessage.trim() || 'Écrivez votre message dans le champ ci-dessus.'
    : selectedMessage === 'suggestion'
      ? generateMessage().replace(/^Bonjour l’équipe SOMATISME,\n\n/, '').replace(/\n\nMerci\.$/, '')
      : messageOptions.find((option) => option.id === selectedMessage)?.text || messageOptions[0].text;
  const message = `Bonjour l’équipe SOMATISME,\n\n${selectedText}\n\nMerci.`;
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
          className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-2xl shadow-green-500/50 hover:shadow-green-500/70 transition-all flex items-center justify-center group"
          aria-label="WhatsApp"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-green-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* WhatsApp Icon */}
          <MessageCircle className="w-8 h-8 text-white relative z-10" strokeWidth={1.5} />

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-full mr-3 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none"
          >
            Discuter sur WhatsApp
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
                  Votre message WhatsApp
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Voici le message qui sera préparé pour l’équipe SOMATISME.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Fermer"
                autoFocus
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5">
              <label htmlFor="whatsapp-message-choice" className="mb-2 block text-sm font-semibold text-slate-800">
                Choisissez le message à envoyer
              </label>
              <select
                id="whatsapp-message-choice"
                value={selectedMessage}
                onChange={(event) => setSelectedMessage(event.target.value)}
                className="mb-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              >
                <option value="suggestion">Suggestion selon la page visitée</option>
                {messageOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
                <option value="custom">Écrire un message personnalisé</option>
              </select>
              {selectedMessage === 'custom' && (
                <textarea
                  value={customMessage}
                  onChange={(event) => setCustomMessage(event.target.value.slice(0, 1000))}
                  placeholder="Écrivez votre message ici…"
                  rows={3}
                  maxLength={1000}
                  className="mb-4 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                />
              )}
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Aperçu du message</p>
              <div className="max-h-56 overflow-y-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {message}
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                WhatsApp s’ouvrira avec ce texte prêt à envoyer. Vous pourrez le modifier, puis confirmer l’envoi dans WhatsApp.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Annuler
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
                <MessageCircle className="h-4 w-4" />
                Continuer sur WhatsApp
              </a>
            </div>
          </motion.section>
        </div>
      )}
    </>
  );
}
