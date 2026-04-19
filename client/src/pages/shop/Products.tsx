import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingCart, Filter, Search, Star, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';

interface Product {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  price: number;
  image: string;
  description: string;
  descriptionAr: string;
  brand: string;
  stock: number;
  featured?: boolean;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Automate Programmable Siemens S7-1200',
    nameAr: 'أتمتة قابلة للبرمجة Siemens S7-1200',
    category: 'automation',
    categoryAr: 'أتمتة',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Automate industriel compact pour applications d\'automatisation. 14 entrées/10 sorties, communication PROFINET.',
    descriptionAr: 'أتمتة صناعية مضغوطة لتطبيقات الأتمتة. 14 مدخل/10 مخرج، اتصال PROFINET.',
    brand: 'Siemens',
    stock: 15,
    featured: true
  },
  {
    id: '2',
    name: 'Variateur de Vitesse ABB ACS580',
    nameAr: 'محول سرعة ABB ACS580',
    category: 'automation',
    categoryAr: 'أتمتة',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Variateur de vitesse pour moteurs asynchrones. Puissance 7.5kW, contrôle vectoriel.',
    descriptionAr: 'محول سرعة للمحركات غير المتزامنة. قدرة 7.5kW، تحكم متجه.',
    brand: 'ABB',
    stock: 8,
    featured: true
  },
  {
    id: '3',
    name: 'Régulateur PID Yokogawa UT520',
    nameAr: 'منظم PID Yokogawa UT520',
    category: 'regulation',
    categoryAr: 'تنظيم',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    description: 'Régulateur PID universel avec affichage numérique. Entrées universelles, sorties relais.',
    descriptionAr: 'منظم PID عالمي مع عرض رقمي. مدخل عالمي، مخرجات ريليه.',
    brand: 'Yokogawa',
    stock: 20
  },
  {
    id: '4',
    name: 'Tableau Électrique TGBT Schneider',
    nameAr: 'لوحة كهربائية TGBT Schneider',
    category: 'electrical',
    categoryAr: 'كهرباء',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
    description: 'Tableau général basse tension Schneider. Disjoncteurs Masterpact, 400A, IP65.',
    descriptionAr: 'لوحة عامة جهد منخفض Schneider. قواطع Masterpact، 400A، IP65.',
    brand: 'Schneider',
    stock: 5,
    featured: true
  },
  {
    id: '5',
    name: 'Capteur de Pression Endress+Hauser',
    nameAr: 'مستشعر ضغط Endress+Hauser',
    category: 'regulation',
    categoryAr: 'تنظيم',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
    description: 'Capteur de pression céramique. 0-10 bar, sortie 4-20mA, IP67.',
    descriptionAr: 'مستشعر ضغط سيراميك. 0-10 بار، مخرج 4-20mA، IP67.',
    brand: 'Endress+Hauser',
    stock: 25
  },
  {
    id: '6',
    name: 'API Modicon M340 Schneider',
    nameAr: 'أتمتة Modicon M340 Schneider',
    category: 'automation',
    categoryAr: 'أتمتة',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1563770095086-a5d7e044a00f?w=400&h=400&fit=crop',
    description: 'Automate programmable Schneider Modicon M340. Haute performance, modularité.',
    descriptionAr: 'أتمتة قابلة للبرمجة Schneider Modicon M340. أداء عالي، معيارية.',
    brand: 'Schneider',
    stock: 12
  },
  {
    id: '7',
    name: 'Contacteur Siemens 3RT',
    nameAr: 'مفتاح Siemens 3RT',
    category: 'electrical',
    categoryAr: 'كهرباء',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&h=400&fit=crop',
    description: 'Contacteur Siemens 3RT. 3 pôles, 24V DC, commande électronique.',
    descriptionAr: 'مفتاح Siemens 3RT. 3 قطب، 24V DC، تحكم إلكتروني.',
    brand: 'Siemens',
    stock: 50
  },
  {
    id: '8',
    name: 'Vanne de Régulation Siemens',
    nameAr: 'صمام تنظيم Siemens',
    category: 'regulation',
    categoryAr: 'تنظيم',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
    description: 'Vanne papillon motorisée DN50. Actionneur pneumatique, positionneur.',
    descriptionAr: 'صمام فراشة محرك DN50. مشغل هوائي، موضع.',
    brand: 'Siemens',
    stock: 30
  },
  {
    id: '9',
    name: 'HMI Siemens TP1200',
    nameAr: 'واجهة HMI Siemens TP1200',
    category: 'automation',
    categoryAr: 'أتمتة',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop',
    description: 'Panneau tactile Siemens TP1200. 12", WinCC Unified, multi-touch.',
    descriptionAr: 'لوحة لمس Siemens TP1200. 12"، WinCC Unified، multi-touch.',
    brand: 'Siemens',
    stock: 8
  },
  {
    id: '10',
    name: 'Disjoncteur Compact NSX',
    nameAr: 'قاطع Compact NSX',
    category: 'electrical',
    categoryAr: 'كهرباء',
    price: 5800,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=400&fit=crop',
    description: 'Disjoncteur Schneider Compact NSX. 250A, Micrologic, sélectivité.',
    descriptionAr: 'قاطع Schneider Compact NSX. 250A، Micrologic، انتقائية.',
    brand: 'Schneider',
    stock: 12
  },
  {
    id: '11',
    name: 'API Siemens S7-1500',
    nameAr: 'أتمتة Siemens S7-1500',
    category: 'automation',
    categoryAr: 'أتمتة',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1563770095086-a5d7e044a00f?w=400&h=400&fit=crop',
    description: 'API Siemens S7-1500. Haute performance, TIA Portal intégré.',
    descriptionAr: 'أتمتة Siemens S7-1500. أداء عالي، TIA Portal مدمج.',
    brand: 'Siemens',
    stock: 6,
    featured: true
  },
  {
    id: '12',
    name: 'Vanne Régulatrice',
    nameAr: 'صمام منظم',
    category: 'regulation',
    categoryAr: 'تنظيم',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop',
    description: 'Vanne régulatrice pneumatique. Contrôle précis du débit.',
    descriptionAr: 'صمام منظم هوائي. تحكم دقيق في التدفق.',
    brand: 'Fisher',
    stock: 20
  },
  {
    id: '13',
    name: 'Relais de Protection',
    nameAr: 'مرحل حماية',
    category: 'electrical',
    categoryAr: 'كهرباء',
    price: 3800,
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&h=400&fit=crop',
    description: 'Relais de protection numérique. Surveillance moteur, surcharge.',
    descriptionAr: 'مرحل حماية رقمي. مراقبة المحرك، الحمل الزائد.',
    brand: 'Schneider',
    stock: 25
  },
  {
    id: '14',
    name: 'Module E/S ET200SP',
    nameAr: 'وحدة E/S ET200SP',
    category: 'automation',
    categoryAr: 'أتمتة',
    price: 6200,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Module d\'entrées/sorties Siemens ET200SP. PROFINET, 16 canaux.',
    descriptionAr: 'وحدة مدخل/مخرج Siemens ET200SP. PROFINET، 16 قناة.',
    brand: 'Siemens',
    stock: 30
  },
  {
    id: '15',
    name: 'Transmetteur de Pression',
    nameAr: 'محول ضغط',
    category: 'regulation',
    categoryAr: 'تنظيم',
    price: 4100,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    description: 'Transmetteur de pression intelligent. HART, 4-20mA, fond d\'échelle 0-100 bar.',
    descriptionAr: 'محول ضغط ذكي. HART، 4-20mA، مقياس 0-100 بار.',
    brand: 'Emerson',
    stock: 22
  },
  {
    id: '16',
    name: 'Débitmètre Électromagnétique',
    nameAr: 'عداد تدفق كهرومغناطيسي',
    category: 'regulation',
    categoryAr: 'تنظيم',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
    description: 'Débitmètre électromagnétique. Précision ±0.5%, communication HART.',
    descriptionAr: 'عداد تدفق كهرومغناطيسي. دقة ±0.5%، اتصال HART.',
    brand: 'Krohne',
    stock: 10
  },
  {
    id: '17',
    name: 'Variateur Sécurité Safe',
    nameAr: 'محول أمان Safe',
    category: 'automation',
    categoryAr: 'أتمتة',
    price: 19500,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Variateur de sécurité Siemens SIRIUS. STO, SS1, SIL 3.',
    descriptionAr: 'محول أمان Siemens SIRIUS. STO، SS1، SIL 3.',
    brand: 'Siemens',
    stock: 5
  },
  {
    id: '18',
    name: 'Transformateur de Mesure',
    nameAr: 'محول قياس',
    category: 'electrical',
    categoryAr: 'كهرباء',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
    description: 'Transformateur de courant et de tension. Classe 0.5, 100/5A.',
    descriptionAr: 'محول تيار وجهد. فئة 0.5، 100/5A.',
    brand: 'Schneider',
    stock: 35
  },
  {
    id: '19',
    name: 'Analyseur de Réseau',
    nameAr: 'محلل شبكة',
    category: 'electrical',
    categoryAr: 'كهرباء',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
    description: 'Analyseur de qualité de réseau électrique. THD, harmoniques, EN50160.',
    descriptionAr: 'محلل جودة الشبكة الكهربائية. THD، توافقيات، EN50160.',
    brand: 'Fluke',
    stock: 15
  },
  {
    id: '20',
    name: 'API Modicon M580',
    nameAr: 'أتمتة Modicon M580',
    category: 'automation',
    categoryAr: 'أتمتة',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1563770095086-a5d7e044a00f?w=400&h=400&fit=crop',
    description: 'API Schneider Modicon M580. Haute disponibilité, Ethernet.',
    descriptionAr: 'أتمتة Schneider Modicon M580. توافر عالي، Ethernet.',
    brand: 'Schneider',
    stock: 4,
    featured: true
  },
  {
    id: '21',
    name: 'Capteur de Niveau',
    nameAr: 'مستشعر مستوى',
    category: 'regulation',
    categoryAr: 'تنظيم',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop',
    description: 'Capteur de niveau ultrasonique. 0-10m, sortie 4-20mA.',
    descriptionAr: 'مستشعر مستوى فوق صوتي. 0-10م، مخرج 4-20mA.',
    brand: 'Endress+Hauser',
    stock: 18
  },
  {
    id: '22',
    name: 'Disjoncteur Masterpact',
    nameAr: 'قاطع Masterpact',
    category: 'electrical',
    categoryAr: 'كهرباء',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&h=400&fit=crop',
    description: 'Disjoncteur Schneider Masterpact. 630A, Micrologic.',
    descriptionAr: 'قاطع Schneider Masterpact. 630A، Micrologic.',
    brand: 'Schneider',
    stock: 8
  },
  {
    id: '23',
    name: 'Variateur Danfoss FC-302',
    nameAr: 'محول Danfoss FC-302',
    category: 'automation',
    categoryAr: 'أتمتة',
    price: 16500,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Variateur de fréquence Danfoss FC-302. Contrôle précis.',
    descriptionAr: 'محول تردد Danfoss FC-302. تحكم دقيق.',
    brand: 'Danfoss',
    stock: 10
  },
  {
    id: '24',
    name: 'Régulateur Honeywell UDC2500',
    nameAr: 'منظم Honeywell UDC2500',
    category: 'regulation',
    categoryAr: 'تنظيم',
    price: 5200,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    description: 'Régulateur universel Honeywell UDC2500. Affichage LCD.',
    descriptionAr: 'منظم عالمي Honeywell UDC2500. عرض LCD.',
    brand: 'Honeywell',
    stock: 18
  },
  {
    id: '25',
    name: 'Module Sécurité F-DI',
    nameAr: 'وحدة أمان F-DI',
    category: 'automation',
    categoryAr: 'أتمتة',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
    description: 'Module d\'entrées de sécurité Siemens F-DI. 8 canaux.',
    descriptionAr: 'وحدة مدخل أمان Siemens F-DI. 8 قنوات.',
    brand: 'Siemens',
    stock: 12
  }
];

const categories = [
  { id: 'all', name: 'Tous', nameAr: 'الكل' },
  { id: 'automation', name: 'Automatisme', nameAr: 'أتمتة' },
  { id: 'regulation', name: 'Régulation', nameAr: 'تنظيم' },
  { id: 'electrical', name: 'Électricité', nameAr: 'كهرباء' }
];

export default function Products() {
  const { t } = useLanguage();
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'inperson'>('stripe');
  const [orderForm, setOrderForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameAr.includes(searchQuery) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleOrderSubmit = async () => {
    if (!orderForm.name || !orderForm.email || !orderForm.phone) {
      toast.error(language === 'ar' ? 'الرجاء ملء جميع الحقول المطلوبة' : 'Veuillez remplir tous les champs requis');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = cart.map(item => ({
        name: language === 'ar' ? item.nameAr : item.name,
        description: language === 'ar' ? item.descriptionAr : item.description,
        price: item.price,
        quantity: 1
      }));

      if (paymentMethod === 'stripe') {
        // Stripe payment
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: orderItems,
            customerInfo: orderForm
          }),
        });

        const data = await response.json();

        if (response.ok && data.sessionId) {
          // For now, just show success message
          toast.success(language === 'ar' ? 'تم إنشاء جلسة الدفع بنجاح' : 'Session de paiement créée avec succès');
          setCart([]);
          setShowOrderDialog(false);
          setShowCart(false);
          setOrderForm({ name: '', email: '', phone: '', company: '', address: '', message: '' });
        } else {
          toast.error(data.error || language === 'ar' ? 'خطأ في إرسال الطلب' : 'Erreur lors de l\'envoi de la commande');
        }
      } else {
        // In-person payment - send order via WhatsApp
        const orderMessage = `NOUVELLE COMMANDE - PAIEMENT FACE-À-FACE\n\nNom: ${orderForm.name}\nEmail: ${orderForm.email}\nTéléphone: ${orderForm.phone}\nEntreprise: ${orderForm.company}\nAdresse: ${orderForm.address}\n\nProduits commandés:\n${orderItems.map(item => `- ${item.name}: ${item.price} MAD`).join('\n')}\n\nTotal: ${cartTotal} MAD\n\nMessage: ${orderForm.message}`;
        
        const whatsappUrl = `https://wa.me/212600000000?text=${encodeURIComponent(orderMessage)}`;
        window.open(whatsappUrl, '_blank');
        
        toast.success(language === 'ar' ? 'تم إرسال الطلب بنجاح' : 'Commande envoyée avec succès');
        setCart([]);
        setShowOrderDialog(false);
        setShowCart(false);
        setOrderForm({ name: '', email: '', phone: '', company: '', address: '', message: '' });
      }
    } catch (error) {
      toast.error(language === 'ar' ? 'خطأ في إرسال الطلب' : 'Erreur lors de l\'envoi de la commande');
      console.error('Order submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === 'ar' ? 'معداتنا الصناعية' : 'Nos Équipements Industriels'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'Découvrez notre catalogue de matériel industriel de haute qualité pour l\'automatisme, la régulation et l\'électricité'
                : 'Découvrez notre catalogue de matériel industriel de haute qualité pour l\'automatisme, la régulation et l\'électricité'}
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={language === 'ar' ? 'بحث عن منتج...' : 'Rechercher un produit...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className={language === 'ar' ? 'font-arabic' : ''}
                >
                  {language === 'ar' ? category.nameAr : category.name}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowCart(!showCart)}
              className="relative"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'السلة' : 'Panier'}
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Cart Sidebar */}
          {showCart && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-lg z-50 p-4 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                  {language === 'ar' ? 'سلة التسوق' : 'Panier'}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
                  ✕
                </Button>
              </div>
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {language === 'ar' ? 'السلة فارغة' : 'Panier vide'}
                </p>
              ) : (
                <>
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mb-4 pb-4 border-b">
                      <img src={item.image} alt={language === 'ar' ? item.nameAr : item.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{language === 'ar' ? item.nameAr : item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.price} MAD</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFromCart(index)}>
                        ✕
                      </Button>
                    </div>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-bold mb-4">
                      <span>{language === 'ar' ? 'المجموع' : 'Total'}:</span>
                      <span>{cartTotal} MAD</span>
                    </div>
                    <Button className="w-full" onClick={() => setShowOrderDialog(true)}>
                      {language === 'ar' ? 'إتمام الطلب' : 'Commander'}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
              >
                {product.featured && (
                  <Badge className="absolute top-2 right-2 z-10 bg-accent">
                    {language === 'ar' ? 'مميز' : 'En vedette'}
                  </Badge>
                )}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={language === 'ar' ? product.nameAr : product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {language === 'ar' ? product.categoryAr : product.category}
                  </Badge>
                  <h3 className="font-semibold mb-1 line-clamp-2">
                    {language === 'ar' ? product.nameAr : product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {language === 'ar' ? product.descriptionAr : product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-accent">{product.price} MAD</p>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {product.stock === 0 
                        ? (language === 'ar' ? 'نفدت الكمية' : 'Rupture')
                        : (language === 'ar' ? 'أضف' : 'Ajouter')
                      }
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {language === 'ar' ? `الكمية: ${product.stock}` : `Stock: ${product.stock}`}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {language === 'ar' ? 'لا توجد منتجات مطابقة' : 'Aucun produit trouvé'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Order Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {language === 'ar' ? 'إتمام الطلب' : 'Commander'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-bold mb-2">
                {language === 'ar' ? 'ملخص الطلب' : 'Récapitulatif de la commande'}
              </h3>
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between text-sm py-1 border-b last:border-0">
                  <span>{language === 'ar' ? item.nameAr : item.name}</span>
                  <span>{item.price} MAD</span>
                </div>
              ))}
              <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                <span>{language === 'ar' ? 'المجموع' : 'Total'}:</span>
                <span>{cartTotal} MAD</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                {language === 'ar' ? 'طريقة الدفع' : 'Mode de paiement'}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-4 border rounded-lg text-center transition-all ${
                    paymentMethod === 'stripe'
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <div className="font-medium mb-1">
                    {language === 'ar' ? 'الدفع الإلكتروني' : 'Paiement en ligne'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'بطاقة bancaire immédiate' : 'Carte bancaire immédiate'}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('inperson')}
                  className={`p-4 border rounded-lg text-center transition-all ${
                    paymentMethod === 'inperson'
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <div className="font-medium mb-1">
                    {language === 'ar' ? 'دفع شخصي' : 'Paiement en face-à-face'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'عند الاستلام' : 'Sur place'}
                  </div>
                </button>
              </div>
              {paymentMethod === 'stripe' && (
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <p className="font-medium mb-1">
                    {language === 'ar' ? 'معلومات الدفع en ligne:' : 'Informations de paiement en ligne:'}
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• {language === 'ar' ? 'دفع آمن عبر Stripe' : 'Paiement sécurisé via Stripe'}</li>
                    <li>• {language === 'ar' ? 'فاتورة تلقائية envoyée par email' : 'Facture automatique envoyée par email'}</li>
                    <li>• {language === 'ar' ? 'دفع فوري' : 'Paiement immédiat'}</li>
                  </ul>
                </div>
              )}
              {paymentMethod === 'inperson' && (
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <p className="font-medium mb-1">
                    {language === 'ar' ? 'معلومات الدفع personnel:' : 'Informations de paiement en face-à-face:'}
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• {language === 'ar' ? 'الدفع عند الاستلام' : 'Paiement à la livraison'}</li>
                    <li>• {language === 'ar' ? 'فاتورة manuelle envoyée par email' : 'Facture manuelle envoyée par email'}</li>
                    <li>• {language === 'ar' ? 'Coordonner avec nous pour le rendez-vous' : 'Coordonner avec nous pour le rendez-vous'}</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === 'ar' ? 'الاسم الكامل *' : 'Nom complet *'}
                </label>
                <Input
                  value={orderForm.name}
                  onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                  placeholder={language === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
                </label>
                <Input
                  type="email"
                  value={orderForm.email}
                  onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                  placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === 'ar' ? 'رقم الهاتف *' : 'Téléphone *'}
                </label>
                <Input
                  type="tel"
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                  placeholder={language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === 'ar' ? 'الشركة' : 'Entreprise'}
                </label>
                <Input
                  value={orderForm.company}
                  onChange={(e) => setOrderForm({ ...orderForm, company: e.target.value })}
                  placeholder={language === 'ar' ? 'اسم الشركة' : 'Nom de l\'entreprise'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === 'ar' ? 'العنوان' : 'Adresse'}
                </label>
                <Input
                  value={orderForm.address}
                  onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                  placeholder={language === 'ar' ? 'العنوان' : 'Adresse'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === 'ar' ? 'رسالة إضافية' : 'Message additionnel'}
                </label>
                <Textarea
                  value={orderForm.message}
                  onChange={(e) => setOrderForm({ ...orderForm, message: e.target.value })}
                  placeholder={language === 'ar' ? 'أي معلومات إضافية...' : 'Toute information supplémentaire...'}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowOrderDialog(false)}
                className="flex-1"
              >
                {language === 'ar' ? 'إلغاء' : 'Annuler'}
              </Button>
              <Button
                onClick={handleOrderSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-accent hover:bg-accent/90"
              >
                {isSubmitting
                  ? (language === 'ar' ? 'جاري الإرسال...' : 'Envoi en cours...')
                  : (language === 'ar' ? 'إرسال الطلب' : 'Envoyer la commande')
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
