import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    // Show button immediately on page load
    setIsVisible(true);
  }, []);

  const phoneNumber = '212679825646'; // User's WhatsApp number

  const generateMessage = () => {
    let message = 'Bonjour SOMATISME,\n\n';
    
    // Add context based on current page
    if (location === '/products') {
      message += 'Je suis intéressé par vos produits industriels.\n';
      message += 'Pourriez-vous me donner plus d\'informations sur vos équipements ?\n';
    } else if (location === '/services') {
      message += 'Je souhaite en savoir plus sur vos services industriels.\n';
      message += 'Quels services pouvez-vous me proposer ?\n';
    } else if (location === '/contact') {
      message += 'Je souhaite vous contacter pour un projet.\n';
    } else if (location === '/projects') {
      message += 'J\'ai vu vos projets réalisés et je suis impressionné.\n';
      message += 'Pourriez-vous me faire une proposition ?\n';
    } else {
      message += 'Je suis intéressé par vos solutions d\'automatisme industriel.\n';
    }
    
    message += '\nMerci de votre réponse.';
    return message;
  };

  const handleClick = () => {
    const message = generateMessage();
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {isVisible && (
        <motion.button
          onClick={handleClick}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-2xl shadow-green-500/50 hover:shadow-green-500/70 transition-all flex items-center justify-center group"
          aria-label="WhatsApp"
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
    </>
  );
}
