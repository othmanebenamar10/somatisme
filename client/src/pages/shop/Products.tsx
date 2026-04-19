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
    name: 'Disjoncteur Legrand DX3',
    nameAr: 'قاطع تيار Legrand DX3',
    category: 'electrical',
    categoryAr: 'كهرباء',
    price: 450,
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&h=400&fit=crop',
    description: 'Disjoncteur magnéto-thermique 25A, courbe C, 2 pôles. Protection contre les surcharges.',
    descriptionAr: 'قاطع مغناطيسي حراري 25A، منحنى C، قطبين. الحماية من الزيادات.',
    brand: 'Legrand',
    stock: 100
  },
  {
    id: '7',
    name: 'Motéducteur SEW-Eurodrive',
    nameAr: 'محرك تروس SEW-Eurodrive',
    category: 'automation',
    categoryAr: 'أتمتة',
    price: 8900,
    image: 'https://images.unsplash.com/photo-1563770095086-a5d7e044a00f?w=400&h=400&fit=crop',
    description: 'Motéducteur à vis sans fin. Puissance 1.5kW, rapport 50:1, IE3.',
    descriptionAr: 'محرك تروس دودة. قدرة 1.5kW، نسبة 50:1، IE3.',
    brand: 'SEW-Eurodrive',
    stock: 12
  },
  {
    id: '8',
    name: 'Débitmètre Electromagnétique Krohne',
    nameAr: 'مقياس تدفق كهرومغناطيسي Krohne',
    category: 'regulation',
    categoryAr: 'تنظيم',
    price: 5600,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop',
    description: 'Débitmètre pour liquides conducteurs. DN50, précision ±0.5%.',
    descriptionAr: 'مقياس تدفق للسوائل الموصلة. DN50، دقة ±0.5%.',
    brand: 'Krohne',
    stock: 18
  },
  {
    id: '9',
    name: 'Prise Industrielle Schneider P17',
    nameAr: 'مقبس صناعي Schneider P17',
    category: 'electrical',
    categoryAr: 'كهرباء',
    price: 280,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=400&fit=crop',
    description: 'Prise 16A 250V, IP44, type 17. Protection contre les projections d\'eau.',
    descriptionAr: 'مقبس 16A 250V، IP44، نوع 17. الحماية من رذاذ الماء.',
    brand: 'Schneider',
    stock: 150
  },
  {
    id: '10',
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
    id: '11',
    name: 'Câble Industriel Nexans',
    nameAr: 'كابل صناعي Nexans',
    category: 'electrical',
    categoryAr: 'كهرباء',
    price: 85,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Câble multiconducteurs 1.5mm², 3 conducteurs, cuivre, RO2.',
    descriptionAr: 'كابل متعدد الموصلات 1.5mm²، 3 موصلات، نحاس، RO2.',
    brand: 'Nexans',
    stock: 500
  },
  {
    id: '12',
    name: 'API Modbus RTU Wago',
    nameAr: 'واجهة Modbus RTU Wago',
    category: 'automation',
    categoryAr: 'أتمتة',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    description: 'Module de communication Modbus RTU. 8 entrées/8 sorties, isolé galvaniquement.',
    descriptionAr: 'وحدة اتصال Modbus RTU. 8 مدخل/8 مخرج، معزول جلفانيًا.',
    brand: 'Wago',
    stock: 40
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
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'b2b' | 'inperson'>('stripe');
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
          const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
          if (stripe) {
            const { error } = await (stripe as any).redirectToCheckout({ sessionId: data.sessionId });
            if (error) {
              toast.error(error.message || language === 'ar' ? 'خطأ في الدفع' : 'Erreur de paiement');
            }
          }
        } else {
          toast.error(data.error || language === 'ar' ? 'خطأ في إرسال الطلب' : 'Erreur lors de l\'envoi de la commande');
        }
      } else {
        // B2B or in-person payment - send order via email
        const isB2B = paymentMethod === 'b2b';
        const subject = isB2B ? 'Commande B2B - Facture demandée' : 'Commande en face-à-face - Facture demandée';
        const paymentMode = isB2B ? 'B2B (Facture/Virement bancaire)' : 'Face-à-face (Paiement sur place)';

        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: orderForm.name,
            email: orderForm.email,
            phone: orderForm.phone,
            company: orderForm.company,
            subject: subject,
            message: `Mode de paiement: ${paymentMode}\n\nAdresse: ${orderForm.address}\n\nProduits commandés:\n${orderItems.map(item => `- ${item.name}: ${item.price} MAD`).join('\n')}\n\nTotal: ${cartTotal} MAD\n\nMessage: ${orderForm.message}`
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(language === 'ar' ? 'تم إرسال الطلب بنجاح' : 'Commande envoyée avec succès');
          setCart([]);
          setShowOrderDialog(false);
          setShowCart(false);
          setOrderForm({ name: '', email: '', phone: '', company: '', address: '', message: '' });
        } else {
          toast.error(data.error || language === 'ar' ? 'خطأ في إرسال الطلب' : 'Erreur lors de l\'envoi de la commande');
        }
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                  onClick={() => setPaymentMethod('b2b')}
                  className={`p-4 border rounded-lg text-center transition-all ${
                    paymentMethod === 'b2b'
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <div className="font-medium mb-1">
                    {language === 'ar' ? 'دفع B2B' : 'Paiement B2B'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'فاتورة / تحويل بنكي' : 'Facture / Virement'}
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
              {paymentMethod === 'b2b' && (
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <p className="font-medium mb-1">
                    {language === 'ar' ? 'معلومات الدفع B2B:' : 'Informations de paiement B2B:'}
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• {language === 'ar' ? 'سيتم إرسال فاتورة إليك عبر البريد الإلكتروني' : 'Une facture vous sera envoyée par email'}</li>
                    <li>• {language === 'ar' ? 'الدفع عن طريق التحويل البنكي' : 'Paiement par virement bancaire'}</li>
                    <li>• {language === 'ar' ? 'شروط الدفع: 30 يوماً' : 'Conditions de paiement: 30 jours'}</li>
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
