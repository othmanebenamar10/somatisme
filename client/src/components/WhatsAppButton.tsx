import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

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
        <button
          onClick={handleClick}
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute right-full mr-3 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
            Discuter sur WhatsApp
          </span>
        </button>
      )}
    </>
  );
}
