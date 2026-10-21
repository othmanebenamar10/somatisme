import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import { ShoppingCart, Filter, Search, Star, Check, X, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

import { products, type Product } from '@shared/products';
import CountryPhoneInput from '@/components/CountryPhoneInput';
import { toInternationalPhone } from '@/data/phoneCountries';

const categories = [
  { id: 'all', name: 'Tous', nameAr: 'الكل' },
  { id: 'plc', name: 'Automates & CPU', nameAr: 'أتمتة وتحكم' },
  { id: 'sensors', name: 'Capteurs & Détecteurs', nameAr: 'حساسات وكاشفات' },
  { id: 'electrical', name: 'Électricité Industrielle', nameAr: 'كهرباء صناعية' },
  { id: 'modules', name: 'Modules & Communication', nameAr: 'وحدات وتوصيلات' },
  { id: 'equipment', name: 'Équipements Divers', nameAr: 'معدات متنوعة' },
];

interface CartItem extends Product {
  quantity: number;
}

export default function Products() {
  const { t } = useLanguage();
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('somatisme_cart');
      const value: unknown = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(value)) return [];
      const validItems = new Map<string, CartItem>();
      for (const entry of value) {
        if (!entry || typeof entry !== 'object') continue;
        const product = products.find((candidate) => candidate.id === String((entry as CartItem).id));
        const quantity = Number((entry as CartItem).quantity);
        if (!product || !Number.isInteger(quantity) || quantity < 1) continue;
        const previousQuantity = validItems.get(product.id)?.quantity || 0;
        const combinedQuantity = Math.min(previousQuantity + quantity, product.stock);
        if (combinedQuantity > 0) validItems.set(product.id, { ...product, quantity: combinedQuantity });
      }
      return [...validItems.values()];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('somatisme_cart', JSON.stringify(cart));
    } catch {
      toast.error('Le panier ne peut pas être enregistré sur cet appareil.');
    }
  }, [cart]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const paymentStatus = url.searchParams.get('payment');
    if (!paymentStatus) return;

    if (paymentStatus === 'success') {
      setCart([]);
      setShowCart(false);
      toast.success('Paiement terminé. La confirmation sera envoyée par email après validation Stripe.');
    } else if (paymentStatus === 'cancelled') {
      toast.info('Paiement annulé. Votre panier a été conservé.');
    }

    url.searchParams.delete('payment');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }, []);
  
  const [showCart, setShowCart] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [cartStep, setCartStep] = useState<'summary' | 'form'>('summary'); // Step-by-step checkout
  const [orderForm, setOrderForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    message: ''
  });
  const [phoneCountryIso, setPhoneCountryIso] = useState('MA');
  const checkoutRequestIdRef = useRef<string | null>(null);
  const { getToken: getRecaptchaToken } = useRecaptcha();
  const [submissionAction, setSubmissionAction] = useState<'checkout' | 'quote' | null>(null);
  const isSubmitting = submissionAction !== null;
  const [sortBy, setSortBy] = useState<'default' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  useEffect(() => {
    checkoutRequestIdRef.current = null;
  }, [cart]);

  const updateOrderForm = (field: keyof typeof orderForm, value: string) => {
    checkoutRequestIdRef.current = null;
    setOrderForm((previous) => ({ ...previous, [field]: value }));
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        product.name.toLowerCase().includes(searchLower) ||
        product.nameAr.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.descriptionAr.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower);
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const visibleProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error('La quantité disponible est déjà dans votre panier.');
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast.success(language === 'ar' ? 'تم إضافة المنتج إلى السلة' : 'Produit ajouté au panier');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((previous) => previous.flatMap((item) => {
      if (item.id !== productId) return [item];
      const nextQuantity = Math.min(item.stock, Math.floor(quantity));
      return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart((previous) => previous.filter((item) => item.id !== productId));
  };

  const cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingFee = Math.round(cartSubtotal * 0.02); // 2% shipping fee
  const tva = Math.round(cartSubtotal * 0.20); // 20% TVA
  const cartTotal = cartSubtotal + shippingFee + tva;

  const handleOrderSubmit = async () => {
    if (!orderForm.name.trim() || !orderForm.email.trim() || !orderForm.phone.trim()) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderForm.email.trim())) {
      toast.error('Veuillez saisir une adresse email valide.');
      return;
    }
    if (orderForm.phone.replace(/\D/g, '').length < 7) {
      toast.error('Veuillez saisir un numéro de téléphone valide.');
      return;
    }

    setSubmissionAction('checkout');
    try {
      const recaptchaToken = await getRecaptchaToken('order_submit');
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(({ id, quantity }) => ({ productId: id, quantity })),
          customerInfo: {
            ...orderForm,
            phone: toInternationalPhone(phoneCountryIso, orderForm.phone),
          },
          recaptchaToken,
          requestId: checkoutRequestIdRef.current || (checkoutRequestIdRef.current = crypto.randomUUID()),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || typeof result.url !== 'string') {
        toast.error(result.error || 'Impossible de démarrer le paiement.');
        return;
      }
      window.location.assign(result.url);
    } catch (error) {
      console.error('Checkout initialization failed:', error);
      toast.error('Erreur lors de la création du paiement. Votre panier est conservé.');
    } finally {
      setSubmissionAction(null);
    }
  };
  const handleQuoteRequest = async () => {
    if (!orderForm.name.trim() || !orderForm.email.trim() || !orderForm.phone.trim()) {
      toast.error('Veuillez remplir votre nom, votre email et votre téléphone.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderForm.email.trim())) {
      toast.error('Veuillez saisir une adresse email valide.');
      return;
    }
    if (orderForm.phone.replace(/\D/g, '').length < 7) {
      toast.error('Veuillez saisir un numéro de téléphone valide.');
      return;
    }
    if (cart.length === 0) {
      toast.error('Votre panier est vide.');
      return;
    }

    setSubmissionAction('quote');
    try {
      const recaptchaToken = await getRecaptchaToken('quote_request');
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(({ id, quantity }) => ({ productId: id, quantity })),
          customerInfo: {
            ...orderForm,
            phone: toInternationalPhone(phoneCountryIso, orderForm.phone),
          },
          recaptchaToken,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || typeof result.quoteNumber !== 'string') {
        toast.error(result.error || 'Impossible de préparer le devis.');
        return;
      }

      const requestedItems = cart.slice(0, 12)
        .map((item) => `• ${item.name} — Qté ${item.quantity}`)
        .join('\n');
      const moreItems = cart.length > 12 ? `\n… et ${cart.length - 12} autre(s) article(s)` : '';
      const whatsappMessage = [
        'Bonjour l’équipe SOMATISME,',
        '',
        `Je viens de demander le devis ${result.quoteNumber}. Le récapitulatif PDF a été envoyé à ${orderForm.email}.`,
        '',
        'Articles demandés :',
        requestedItems + moreItems,
        '',
        'Merci.',
      ].join('\n');
      window.location.assign(`https://wa.me/212679825646?text=${encodeURIComponent(whatsappMessage)}`);
    } catch (error) {
      console.error('Quote request failed:', error);
      toast.error('Erreur lors de la préparation du devis. Veuillez réessayer.');
    } finally {
      setSubmissionAction(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Header - INDUSTRIAL PROFESSIONAL DESIGN */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-slate-800 to-primary">
        {/* Animated Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animation: 'float 8s ease-in-out infinite' }}></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-400/10 rounded-full blur-[120px] animate-pulse" style={{ animation: 'float 10s ease-in-out infinite 2s' }}></div>

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
              <span className="text-accent font-bold text-sm uppercase tracking-widest">{language === 'ar' ? 'منتجاتنا' : 'Nos Produits'}</span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 sm:mb-8 leading-tight">
              {language === 'ar' ? 'المنتجات' : 'Équipements'} <br />
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 bg-clip-text text-transparent">{language === 'ar' ? 'الصناعية' : 'Industriels'}</span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {language === 'ar' ? 'أفضل المعدات الصناعية' : 'Équipements industriels de qualité professionnelle'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters - RADICAL PREMIUM DESIGN */}
      <motion.section
        {...fadeInUp}
        className="py-12 relative overflow-hidden bg-gradient-to-b from-background to-primary/5"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-secondary/10 rounded-full blur-[100px] opacity-50"></div>

        <div className="container relative z-10">
          <div className="bg-gradient-to-br from-card/80 to-card/40 border border-accent/20 rounded-3xl p-4 sm:p-6 backdrop-blur-sm hover:border-accent/40 transition-all space-y-5">

            {/* ROW 1 : Search + Sort + Cart */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 h-5 w-5 z-10 pointer-events-none" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'ابحث عن منتج...' : 'Rechercher un produit...'}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  className="w-full pl-12 pr-10 py-3 border-2 border-cyan-400/40 rounded-xl placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all text-base font-medium shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors text-lg leading-none"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value as typeof sortBy); setCurrentPage(1); }}
                  style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  className="appearance-none w-full sm:w-auto pl-4 pr-9 py-3 border-2 border-cyan-400/40 rounded-xl text-sm font-semibold focus:border-cyan-500 focus:outline-none transition-all cursor-pointer shadow-sm"
                >
                  <option value="default">{language === 'ar' ? 'الترتيب' : 'Trier par'}</option>
                  <option value="name-asc">{language === 'ar' ? 'الاسم أ→ي' : 'Nom A→Z'}</option>
                  <option value="name-desc">{language === 'ar' ? 'الاسم ي→أ' : 'Nom Z→A'}</option>
                  <option value="price-asc">{language === 'ar' ? 'السعر ↑' : 'Prix croissant'}</option>
                  <option value="price-desc">{language === 'ar' ? 'السعر ↓' : 'Prix décroissant'}</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500 text-xs">▼</span>
              </div>

              {/* Cart Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="shrink-0"
              >
                <button
                  onClick={() => setShowCart(!showCart)}
                  className="relative px-8 py-3 rounded-xl font-bold uppercase tracking-wide text-sm bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/70 transition-all flex items-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {language === 'ar' ? 'السلة' : 'Panier'}
                  {cart.length > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.3 }}
                      className="absolute -top-3 -right-3 h-7 w-7 flex items-center justify-center bg-secondary text-white rounded-full font-bold text-xs shadow-lg"
                    >
                      {cart.length}
                    </motion.div>
                  )}
                </button>
              </motion.div>
            </div>

            {/* ROW 2 : Category filters */}
            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => { setSelectedCategory(category.id); setCurrentPage(1); }}
                  className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md shadow-cyan-500/40'
                      : 'bg-white border-2 border-cyan-400/30 text-slate-700 hover:border-cyan-400 hover:bg-cyan-50'
                  }`}
                >
                  {language === 'ar' ? category.nameAr : category.name}
                </button>
              ))}
            </div>

          </div>
        </div>
      </motion.section>

      {/* Cart Modal Popup - PREMIUM DESIGN */}
      {showCart && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCart(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
          />

          {/* Cart Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 w-[calc(100%-1rem)] max-w-2xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-card via-card to-card/90 border border-cyan-400/20 rounded-2xl sm:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
            style={{ maxHeight: 'calc(100dvh - 1rem)' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4 sm:p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl sm:text-2xl font-black">
                  {language === 'ar' ? 'سلة التسوق' : 'Panier'}
                </h3>
                <p className="text-xs text-white/70 mt-1">
                  {cart.length} {cart.length === 1 ? 'article' : 'articles'}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Content - 2 Column Layout */}
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
              {/* Left: Products List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <ShoppingCart size={56} className="text-muted-foreground/20 mb-4" />
                    <p className="text-muted-foreground font-bold text-lg">
                      {language === 'ar' ? 'السلة فارغة' : 'Panier vide'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {language === 'ar' ? 'أضف منتجات لبدء التسوق' : 'Ajoutez des produits pour commencer'}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                      {language === 'ar' ? 'المنتجات' : 'Produits'}
                    </p>
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="bg-background/50 rounded-xl p-3 border border-border/50 hover:border-accent/30 transition-all group"
                      >
                        <div className="flex gap-3">
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={language === 'ar' ? item.nameAr : item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs truncate">
                              {language === 'ar' ? item.nameAr : item.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {item.brand}
                            </p>
                            <p className="text-accent font-bold text-xs mt-1">
                              {item.price} MAD
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <button type="button" aria-label="Diminuer la quantité" onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="h-7 w-7 rounded border border-border text-foreground hover:bg-muted">−</button>
                              <span className="min-w-5 text-center text-xs font-semibold">{item.quantity}</span>
                              <button type="button" aria-label="Augmenter la quantité" disabled={item.quantity >= item.stock} onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="h-7 w-7 rounded border border-border text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40">+</button>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 hover:bg-destructive/10 text-destructive rounded-lg transition-colors flex-shrink-0"
                          >
                            <X size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>

              {/* Right: Summary & Checkout */}
              {cart.length > 0 && (
                <div className="lg:w-64 flex flex-col gap-4">
                  {/* Summary Card */}
                  <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 rounded-2xl p-4 border border-cyan-400/20 space-y-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {language === 'ar' ? 'الملخص' : 'Résumé'}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {language === 'ar' ? 'المجموع الجزئي' : 'Sous-total'}:
                        </span>
                        <span className="font-bold">{cartSubtotal} MAD</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {language === 'ar' ? 'الشحن (2%)' : 'Livraison (2%)'}:
                        </span>
                        <span className="font-bold text-cyan-600">{shippingFee} MAD</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {language === 'ar' ? 'ضريبة القيمة المضافة (20%)' : 'TVA (20%)'}:
                        </span>
                        <span className="font-bold text-amber-600">{tva} MAD</span>
                      </div>
                      <div className="border-t border-cyan-300 pt-2 flex justify-between">
                        <span className="font-bold text-sm">
                          {language === 'ar' ? 'المجموع' : 'Total TTC'}:
                        </span>
                        <span className="text-lg font-black bg-gradient-to-r from-cyan-500 to-cyan-600 bg-clip-text text-transparent">
                          {cartTotal} MAD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowOrderDialog(true)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                  >
                    {language === 'ar' ? 'إتمام الطلب' : 'Commander'}
                    <ArrowRight size={16} />
                  </motion.button>

                  {/* Info */}
                  <p className="text-xs text-muted-foreground text-center bg-muted/30 p-2 rounded-lg">
                    {language === 'ar' ? 'Paiement sécurisé par carte' : 'Paiement sécurisé par carte'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}

      {/* Products Grid - Ultra Pro */}
      <section className="section-padding section-gradient relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20"></div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {visibleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="card-premium p-6 group"
              >
                <div className="aspect-square overflow-hidden rounded-xl mb-5 relative">
                  <img
                    src={product.image}
                    alt={language === 'ar' ? product.nameAr : product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="badge-premium text-xs">
                      {language === 'ar' ? product.categoryAr : product.category}
                    </span>
                  </div>
                </div>
                <h3 className="text-subheading text-foreground mb-2 line-clamp-2">
                  {language === 'ar' ? product.nameAr : product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {language === 'ar' ? product.descriptionAr : product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-2xl font-bold gradient-text">{product.price} MAD</p>
                  {product.stock > 0 && (
                    <span className="text-xs text-green-600 font-medium">En stock</span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    product.stock === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'btn-accent'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4 mr-2 inline" />
                  {product.stock === 0
                    ? (language === 'ar' ? 'Rupture de stock' : 'Rupture')
                    : (language === 'ar' ? 'Ajouter' : 'Ajouter au panier')
                  }
                </motion.button>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  {language === 'ar' ? `Quantite: ${product.stock}` : `Stock disponible: ${product.stock}`}
                </p>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-glass p-12 max-w-md mx-auto"
              >
                <p className="text-muted-foreground text-lg">
                  {language === 'ar' ? 'Aucun produit trouve' : 'Aucun produit trouve'}
                </p>
              </motion.div>
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4" aria-label="Pages de produits">
              <Button type="button" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}>
                Précédent
              </Button>
              <span className="text-sm text-muted-foreground">Page {currentPage} / {totalPages}</span>
              <Button type="button" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => page + 1)}>
                Suivant
              </Button>
            </nav>
          )}
        </div>
      </section>

      {/* Order Dialog - Step by Step */}
      <Dialog open={showOrderDialog} onOpenChange={(open) => {
        setShowOrderDialog(open);
        if (!open) setCartStep('summary');
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="bg-gradient-to-r from-cyan-500 to-cyan-600 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
            <DialogTitle className="text-2xl text-white font-bold">
              {cartStep === 'summary' 
                ? (language === 'ar' ? 'سلة التسوق' : 'Panier')
                : (language === 'ar' ? 'إتمام الطلب' : 'Coordonnées et choix de commande')
              }
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* STEP 1: CART SUMMARY */}
            {cartStep === 'summary' && (
              <>
                {/* Products List */}
                <div className="space-y-3">
                  <h3 className="font-bold text-primary flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-cyan-500"></div>
                    {language === 'ar' ? 'المنتجات' : 'Produits'} ({cart.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {cart.map((item, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{language === 'ar' ? item.nameAr : item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.brand}</p>
                        </div>
                        <span className="font-bold text-cyan-600">{item.price} MAD</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 p-4 rounded-xl border border-cyan-200 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{language === 'ar' ? 'الإجمالي الجزئي' : 'Sous-total'}:</span>
                    <span className="font-bold">{cartSubtotal} MAD</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{language === 'ar' ? 'الشحن (2%)' : 'Livraison (2%)'}:</span>
                    <span className="font-bold text-cyan-600">{shippingFee} MAD</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{language === 'ar' ? 'ضريبة القيمة المضافة (20%)' : 'TVA (20%)'}:</span>
                    <span className="font-bold text-amber-600">{tva} MAD</span>
                  </div>
                  <div className="border-t-2 border-cyan-300 pt-2 flex justify-between">
                    <span className="font-bold text-primary">{language === 'ar' ? 'المجموع' : 'Total TTC'}:</span>
                    <span className="text-lg bg-gradient-to-r from-cyan-500 to-cyan-600 bg-clip-text text-transparent font-bold">{cartTotal} MAD</span>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-gradient-to-br from-primary/5 to-cyan-500/5 p-4 rounded-xl border border-primary/20">
                  <p className="font-bold mb-2 text-primary text-sm">
                    {language === 'ar' ? 'معلومات الدفع:' : 'Informations de paiement:'}
                  </p>
                  <ul className="text-xs text-foreground space-y-1.5">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>{language === 'ar' ? 'Paiement sécurisé par carte avec Stripe' : 'Paiement sécurisé par carte avec Stripe'}</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>{language === 'ar' ? 'سيتم إرسال ملخص الطلب عبر البريد الإلكتروني' : 'Confirmation de paiement envoyée par email'}</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>{language === 'ar' ? 'Coordonner avec nous pour le rendez-vous' : 'Coordonner avec nous pour le rendez-vous'}</li>
                  </ul>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-6 border-t border-cyan-200">
                  <Button
                    onClick={() => setShowOrderDialog(false)}
                    className="flex-1 border-2 border-primary text-primary hover:bg-primary/5 font-bold"
                    variant="outline"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Annuler'}
                  </Button>
                  <Button
                    onClick={() => setCartStep('form')}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold shadow-lg shadow-cyan-500/30"
                  >
                    {language === 'ar' ? 'التالي' : 'Suivant'} →
                  </Button>
                </div>
              </>
            )}

            {/* STEP 2: CUSTOMER FORM */}
            {cartStep === 'form' && (
              <>
                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">
                      {language === 'ar' ? 'الاسم الكامل *' : 'Nom complet *'}
                    </label>
                    <Input
                      value={orderForm.name}
                      onChange={(e) => updateOrderForm('name', e.target.value)}
                      placeholder={language === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">
                      {language === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
                    </label>
                    <Input
                      type="email"
                      value={orderForm.email}
                      onChange={(e) => updateOrderForm('email', e.target.value)}
                      placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">
                      {language === 'ar' ? 'رقم الهاتف *' : 'Téléphone *'}
                    </label>
                    <CountryPhoneInput
                      id="order-phone"
                      value={orderForm.phone}
                      countryIso={phoneCountryIso}
                      onValueChange={(phone) => updateOrderForm('phone', phone)}
                      onCountryIsoChange={(countryIso) => {
                        checkoutRequestIdRef.current = null;
                        setPhoneCountryIso(countryIso);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">
                      {language === 'ar' ? 'الشركة' : 'Entreprise'}
                    </label>
                    <Input
                      value={orderForm.company}
                      onChange={(e) => updateOrderForm('company', e.target.value)}
                      placeholder={language === 'ar' ? 'اسم الشركة' : 'Nom de l\'entreprise'}
                      className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">
                      {language === 'ar' ? 'العنوان' : 'Adresse'}
                    </label>
                    <Input
                      value={orderForm.address}
                      onChange={(e) => updateOrderForm('address', e.target.value)}
                      placeholder={language === 'ar' ? 'العنوان' : 'Adresse'}
                      className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">
                      {language === 'ar' ? 'رسالة إضافية' : 'Message additionnel'}
                    </label>
                    <Textarea
                      value={orderForm.message}
                      onChange={(e) => updateOrderForm('message', e.target.value)}
                      placeholder={language === 'ar' ? 'أي معلومات إضافية...' : 'Toute information supplémentaire...'}
                      rows={3}
                    />
                  </div>
                </div>

                <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm leading-5 text-emerald-900">
                  Demandez un devis : le PDF détaillé sera envoyé à votre adresse email, puis WhatsApp s’ouvrira avec le récapitulatif de votre demande.
                </p>

                {/* Navigation Buttons */}
                <div className="grid grid-cols-1 gap-3 border-t border-cyan-200 pt-5 sm:grid-cols-3">
                  <Button
                    onClick={() => setCartStep('summary')}
                    disabled={isSubmitting}
                    className="border-2 border-primary text-primary hover:bg-primary/5 font-bold"
                    variant="outline"
                  >
                    ← {language === 'ar' ? 'السابق' : 'Précédent'}
                  </Button>
                  <Button
                    onClick={handleQuoteRequest}
                    disabled={isSubmitting}
                    variant="outline"
                    className="border-2 border-emerald-600 font-bold text-emerald-800 hover:bg-emerald-50"
                  >
                    {submissionAction === 'quote' ? 'Préparation du devis…' : 'Recevoir le devis PDF + WhatsApp'}
                  </Button>
                  <Button
                    onClick={handleOrderSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 font-bold text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-600 hover:to-cyan-700"
                  >
                    {submissionAction === 'checkout'
                      ? 'Redirection vers le paiement…'
                      : 'Payer par carte'
                    }
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
