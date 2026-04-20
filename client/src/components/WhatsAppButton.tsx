import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
          <svg
            className="w-8 h-8 text-white relative z-10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.347l-.355.203-.368-.066c-1.286-.264-2.514-.666-3.635-1.285l-.635-.343-.667.254c-1.086.412-2.053 1.086-2.814 1.955-.381.44-.744.922-1.08 1.426-.168.252-.525.974-.525 1.988 0 1.907.584 3.774 1.711 5.494l.323.47-.964 2.875c-.359 1.079-.699 2.095-.699 2.95 0 .607.163 1.159.502 1.591.169.215.382.39.629.51.139.07.293.117.448.117.219 0 .435-.033.646-.1l3.04-.968.472.341c1.512 1.095 3.342 1.874 5.223 2.038 1.881.165 3.7-.255 5.228-1.231 1.528-.976 2.594-2.314 3.152-3.833.558-1.519.558-3.159 0-4.678-.558-1.519-1.624-2.857-3.152-3.833-1.528-.976-3.347-1.396-5.228-1.231-1.881.164-3.711.943-5.223 2.038l-.472.341-3.04-.968c-.211-.067-.427-.1-.646-.1-.155 0-.309.047-.448.117-.247.12-.46.295-.629.51-.339.432-.502.984-.502 1.591 0 .855.34 1.871.699 2.95l.964 2.875-.323-.47c-1.127-1.72-1.711-3.587-1.711-5.494 0-1.014.357-1.736.525-1.988.336-.504.699-.986 1.08-1.426.761-.869 1.728-1.543 2.814-1.955l.667-.254.635.343c1.121.619 2.349 1.021 3.635 1.285l.368.066.355-.203a9.87 9.87 0 014.946-1.347z" />
          </svg>

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
