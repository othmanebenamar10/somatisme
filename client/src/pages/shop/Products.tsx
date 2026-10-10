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
import jsPDF from 'jspdf';

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
  const invoiceNumberRef = useRef<string | null>(null);
  const [orderHoneypot, setOrderHoneypot] = useState(''); // Bot trap
  const [orderFormOpenTime, setOrderFormOpenTime] = useState(0); // Timing check
  const { getToken: getRecaptchaToken } = useRecaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const updateOrderForm = (field: keyof typeof orderForm, value: string) => {
    invoiceNumberRef.current = null;
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
    invoiceNumberRef.current = null;
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
    invoiceNumberRef.current = null;
    setCart((previous) => previous.flatMap((item) => {
      if (item.id !== productId) return [item];
      const nextQuantity = Math.min(item.stock, Math.floor(quantity));
      return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
    }));
  };

  const removeFromCart = (productId: string) => {
    invoiceNumberRef.current = null;
    setCart((previous) => previous.filter((item) => item.id !== productId));
  };

  const cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingFee = Math.round(cartSubtotal * 0.02); // 2% shipping fee
  const tva = Math.round(cartSubtotal * 0.20); // 20% TVA
  const cartTotal = cartSubtotal + shippingFee + tva;

  const handleOrderSubmit = async () => {
    if (!orderForm.name || !orderForm.email || !orderForm.phone) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    // Honeypot check: bots fill hidden fields, humans don't
    if (orderHoneypot) {
      setCart([]);
      setShowOrderDialog(false);
      return;
    }

    // Timing check: < 2s = bot
    if (orderFormOpenTime && Date.now() - orderFormOpenTime < 2000) {
      toast.error('Veuillez patienter avant de soumettre.');
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

    const whatsappWindow = window.open('about:blank', '_blank');
    if (whatsappWindow) whatsappWindow.opener = null;
    setIsSubmitting(true);

    try {
      const orderItems = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));
      const internationalOrderForm = {
        ...orderForm,
        phone: toInternationalPhone(phoneCountryIso, orderForm.phone),
      };

      // Generate a clear order summary PDF for the customer and admin.
      const doc = new jsPDF();
      const timestamp = Date.now();
      const invoiceNumber = invoiceNumberRef.current || `CMD-${timestamp}-${crypto.randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase()}`;
      invoiceNumberRef.current = invoiceNumber;
      const date = new Date().toLocaleDateString('fr-FR');

      // Colors
      const C = {
        navy:   [18,  42,  72]  as [number,number,number],
        navyDk: [12,  28,  50]  as [number,number,number],
        cyan:   [0,   188, 212] as [number,number,number],
        white:  [255, 255, 255] as [number,number,number],
        light:  [245, 248, 252] as [number,number,number],
        text:   [30,  42,  65]  as [number,number,number],
        sub:    [80,  95,  115] as [number,number,number],
        muted:  [130, 145, 165] as [number,number,number],
        faint:  [180, 192, 210] as [number,number,number],
      };

      // ══════════════════════════════════════════
      // HEADER — navy background + circle deco
      // ══════════════════════════════════════════
      doc.setFillColor(...C.navy);
      doc.rect(0, 0, 210, 58, 'F');

      // Decorative cyan circle outline (top-right)
      doc.setDrawColor(...C.cyan);
      doc.setLineWidth(7);
      doc.circle(196, 20, 22, 'S');
      // Dark filled circle (overlapping bottom of cyan circle)
      doc.setFillColor(...C.navyDk);
      doc.circle(196, 40, 14, 'F');

      // SOMATISME
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.setTextColor(...C.white);
      doc.text('SOMATISME', 12, 22);

      // AUTOMATISATION INDUSTRIELLE (cyan)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...C.cyan);
      doc.text('AUTOMATISATION INDUSTRIELLE', 12, 31);

      // Tagline
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...C.faint);
      doc.text('Equipements • Régulation • Installation Electrique', 12, 38);

      // Contact line
      doc.setFontSize(7.5);
      doc.setTextColor(160, 180, 205);
      doc.text('+212 6 79 82 56 46  |  somatisme@gmail.com  |  www.somatisme.ma', 12, 44);

      // Checksum / secure
      doc.setFontSize(6.5);
      doc.setTextColor(...C.muted);
      doc.setFont('helvetica', 'italic');
      // ══════════════════════════════════════════
      // INVOICE BLOCK — light rounded rectangle
      // ══════════════════════════════════════════
      doc.setFillColor(...C.light);
      doc.roundedRect(12, 65, 186, 38, 3, 3, 'F');

      // Order summary title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(19);
      doc.setTextColor(...C.text);
      doc.text('RECAPITULATIF DE COMMANDE', 20, 82);

      // "À PAYER" cyan badge
      doc.setFillColor(...C.cyan);
      doc.roundedRect(20, 86, 48, 8, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setTextColor(...C.white);
      doc.setFont('helvetica', 'bold');
      doc.text('A CONFIRMER', 22, 91.5);

      // Invoice number (right side of block)
      doc.setFontSize(7);
      doc.setTextColor(...C.muted);
      doc.setFont('helvetica', 'normal');
      doc.text('REFERENCE', 105, 72);
      doc.setFontSize(8.5);
      doc.setTextColor(...C.text);
      doc.setFont('helvetica', 'bold');
      doc.text(invoiceNumber, 105, 79);

      // Date
      doc.setFontSize(7.5);
      doc.setTextColor(...C.muted);
      doc.setFont('helvetica', 'normal');
      doc.text('DATE', 105, 89);
      doc.setTextColor(...C.text);
      doc.setFont('helvetica', 'bold');
      doc.text(date, 122, 89);

      doc.setFontSize(7.5);
      doc.setTextColor(...C.muted);
      doc.setFont('helvetica', 'normal');

      // ══════════════════════════════════════════
      // TWO COLUMNS: FACTURE À  |  DE
      // ══════════════════════════════════════════
      const col1 = 12;
      const col2 = 110;
      const infoY = 115;

      // — FACTURE À —
      doc.setFontSize(8);
      doc.setTextColor(...C.cyan);
      doc.setFont('helvetica', 'bold');
      doc.text('CLIENT', col1, infoY);
      doc.setDrawColor(...C.cyan);
      doc.setLineWidth(0.6);
      doc.line(col1, infoY + 1.5, col1 + 30, infoY + 1.5);

      doc.setFontSize(11);
      doc.setTextColor(...C.text);
      doc.setFont('helvetica', 'bold');
      doc.text(orderForm.name, col1, infoY + 10);

      doc.setFontSize(8);
      doc.setTextColor(...C.sub);
      doc.setFont('helvetica', 'normal');
      let cy2 = infoY + 17;
      if (orderForm.address) { doc.text(orderForm.address, col1, cy2); cy2 += 6; }
      doc.text(orderForm.email, col1, cy2); cy2 += 6;
      doc.text(internationalOrderForm.phone, col1, cy2);
      if (orderForm.company) { cy2 += 6; doc.text(orderForm.company, col1, cy2); }

      // — DE —
      doc.setFontSize(8);
      doc.setTextColor(...C.cyan);
      doc.setFont('helvetica', 'bold');
      doc.text('DE', col2, infoY);
      doc.setDrawColor(...C.cyan);
      doc.setLineWidth(0.6);
      doc.line(col2, infoY + 1.5, col2 + 10, infoY + 1.5);

      doc.setFontSize(11);
      doc.setTextColor(...C.text);
      doc.setFont('helvetica', 'bold');
      doc.text('SOMATISME', col2, infoY + 10);

      doc.setFontSize(8);
      doc.setTextColor(...C.sub);
      doc.setFont('helvetica', 'normal');
      doc.text('Equipements Industriels', col2, infoY + 17);
      doc.text('Rue Résistance Nassime GH12 Appt 1', col2, infoY + 23);
      doc.text('Mohammedia, Maroc', col2, infoY + 29);
      doc.text('+212 6 79 82 56 46', col2, infoY + 35);
      doc.text('somatisme@gmail.com', col2, infoY + 41);

      // ══════════════════════════════════════════
      // PRODUCTS TABLE
      // ══════════════════════════════════════════
      const tY = 162;

      // Header row
      doc.setFillColor(...C.navy);
      doc.rect(12, tY, 186, 10, 'F');
      doc.setFontSize(8);
      doc.setTextColor(...C.white);
      doc.setFont('helvetica', 'bold');
      doc.text('#', 16, tY + 7);
      doc.text('DESCRIPTION', 28, tY + 7);
      doc.text('QTE', 118, tY + 7);
      doc.text('PRIX U.', 140, tY + 7);
      doc.text('TOTAL', 174, tY + 7);

      // Product rows
      let rY = tY + 10;
      cart.forEach((item, idx) => {
        if (rY > 235) {
          doc.addPage();
          rY = 20;
          doc.setFillColor(...C.navy);
          doc.rect(12, rY, 186, 10, 'F');
          doc.setFontSize(8);
          doc.setTextColor(...C.white);
          doc.setFont('helvetica', 'bold');
          doc.text('DESCRIPTION', 28, rY + 7);
          doc.text('QTE', 118, rY + 7);
          doc.text('PRIX U.', 140, rY + 7);
          doc.text('TOTAL', 174, rY + 7);
          rY += 10;
        }
        const bg: [number, number, number] = idx % 2 === 0 ? C.white : C.light;
        doc.setFillColor(...bg);
        doc.rect(12, rY, 186, 10, 'F');

        doc.setFontSize(8);
        doc.setTextColor(...C.muted);
        doc.setFont('helvetica', 'normal');
        doc.text(String(idx + 1).padStart(2, '0'), 16, rY + 7);

        doc.setTextColor(...C.text);
        const nm = item.name.length > 44 ? item.name.substring(0, 44) + '...' : item.name;
        doc.text(nm, 28, rY + 7);

        doc.text(String(item.quantity), 120, rY + 7);
        doc.text(`${item.price} MAD`, 138, rY + 7);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...C.text);
        doc.text(`${item.price * item.quantity} MAD`, 196, rY + 7, { align: 'right' });

        rY += 10;
      });

      // ══════════════════════════════════════════
      // NOTES & CONDITIONS  +  TOTALS
      // ══════════════════════════════════════════
      if (rY > 215) {
        doc.addPage();
        rY = 25;
      }
      const botY = rY + 10;

      // Notes (left)
      doc.setFontSize(8);
      doc.setTextColor(...C.cyan);
      doc.setFont('helvetica', 'bold');
      doc.text('NOTES & CONDITIONS', col1, botY);

      doc.setFontSize(7.5);
      doc.setTextColor(...C.sub);
      doc.setFont('helvetica', 'normal');
      doc.text('Merci pour votre demande.', col1, botY + 8);
      doc.text('Notre equipe confirmera la disponibilite', col1, botY + 14);
      doc.text('et les modalites avant validation.', col1, botY + 20);
      doc.text('Ce document est un recapitulatif,', col1, botY + 26);
      doc.text('pas une facture.', col1, botY + 32);

      // Totals (right)
      const totX = 105;
      doc.setFontSize(8.5);
      doc.setTextColor(...C.sub);
      doc.setFont('helvetica', 'normal');
      doc.text('Sous-total', totX, botY + 8);
      doc.setTextColor(...C.text);
      doc.text(`${cartSubtotal} MAD`, 196, botY + 8, { align: 'right' });

      doc.setTextColor(...C.sub);
      doc.text('Livraison estimative', totX, botY + 16);
      doc.setTextColor(...C.text);
      doc.text(`${shippingFee} MAD`, 196, botY + 16, { align: 'right' });

      doc.setTextColor(...C.sub);
      doc.text('TVA (20%)', totX, botY + 24);
      doc.setTextColor(...C.text);
      doc.text(`${tva} MAD`, 196, botY + 24, { align: 'right' });

      // Separator
      doc.setDrawColor(210, 220, 230);
      doc.setLineWidth(0.3);
      doc.line(totX, botY + 28, 198, botY + 28);

      // TOTAL box
      doc.setFillColor(...C.navy);
      doc.roundedRect(totX, botY + 31, 93, 14, 2, 2, 'F');
      doc.setFontSize(10);
      doc.setTextColor(...C.white);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL ESTIMATIF', totX + 5, botY + 40);
      doc.setFontSize(12);
      doc.text(`${cartTotal} MAD`, 196, botY + 40, { align: 'right' });

      // ══════════════════════════════════════════
      // FOOTER
      // ══════════════════════════════════════════
      const fY = 272;
      doc.setFillColor(...C.navy);
      doc.rect(0, fY, 210, 25, 'F');

      doc.setFontSize(9);
      doc.setTextColor(...C.white);
      doc.setFont('helvetica', 'bold');
      doc.text('SOMATISME', 105, fY + 8, { align: 'center' });

      doc.setFontSize(7);
      doc.setTextColor(160, 178, 200);
      doc.setFont('helvetica', 'normal');
      doc.text('Equipements Industriels  |  +212 6 79 82 56 46  |  somatisme@gmail.com', 105, fY + 14, { align: 'center' });

      doc.setTextColor(...C.cyan);
      doc.setFont('helvetica', 'bold');
      doc.text('www.somatisme.ma', 105, fY + 20, { align: 'center' });

      doc.setFontSize(5.5);
      doc.setTextColor(...C.muted);
      doc.setFont('helvetica', 'normal');
      doc.text(invoiceNumber, 105, fY + 24.5, { align: 'center' });

      // Get PDF as base64
      const pdfBase64 = doc.output('dataurlstring').split(',')[1];

      // Get reCAPTCHA token before sending
      const recaptchaToken = await getRecaptchaToken('order_submit');
      const submitDuration = orderFormOpenTime ? Date.now() - orderFormOpenTime : 99999;

      const emailResponse = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderForm: internationalOrderForm,
          orderItems,
          cartTotal,
          pdfBase64,
          invoiceNumber,
          recaptchaToken,
          _duration: submitDuration,
          website: orderHoneypot || undefined,
        })
      });
      const emailResult = await emailResponse.json().catch(() => ({}));
      if (!emailResponse.ok) {
        whatsappWindow?.close();
        toast.error(emailResult.error || 'La commande n’a pas pu être envoyée. Votre panier est conservé.');
        return;
      }

      // Download the order summary only after the server accepts the request.
      try {
        doc.save(`Commande_${invoiceNumber}_SOMATISME.pdf`);
      } catch (pdfError) {
        console.error('Order summary download failed:', pdfError);
        toast.error('Demande enregistrée, mais le téléchargement du récapitulatif a échoué.');
      }

      // Send order via WhatsApp with clean format
      const orderMessage = `Bonjour SOMATISME, je viens d'envoyer une demande de commande depuis votre site.

Reference : ${invoiceNumber}
Nom : ${orderForm.name}
Telephone : ${internationalOrderForm.phone}
Email : ${orderForm.email}
${orderForm.company ? `Entreprise : ${orderForm.company}\n` : ''}${orderForm.address ? `Adresse : ${orderForm.address}\n` : ''}
Articles :
${cart.map((item) => `• ${item.name} — ${item.quantity} × ${item.price} MAD = ${item.price * item.quantity} MAD`).join('\n')}

Sous-total : ${cartSubtotal} MAD
Livraison : ${shippingFee} MAD
TVA : ${tva} MAD
Total estimatif : ${cartTotal} MAD
${orderForm.message ? `\nMessage : ${orderForm.message}\n` : ''}
Merci de confirmer la disponibilité et les modalités de livraison.`;
      
      const whatsappUrl = `https://wa.me/212679825646?text=${encodeURIComponent(orderMessage)}`;
      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappUrl;
      } else {
        toast.info('Commande enregistrée.', {
          action: { label: 'Ouvrir WhatsApp', onClick: () => window.location.assign(whatsappUrl) },
        });
      }
      
      toast.success(emailResult.message || 'Commande envoyée avec succès.');
      setCart([]);
      invoiceNumberRef.current = null;
      setShowOrderDialog(false);
      setShowCart(false);
      setOrderForm({ name: '', email: '', phone: '', company: '', address: '', message: '' });
      setPhoneCountryIso('MA');
    } catch (error) {
      whatsappWindow?.close();
      toast.error('Erreur lors de l\'envoi de la commande');
      console.error('Order submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Header - INDUSTRIAL PROFESSIONAL DESIGN */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-slate-800 to-primary">
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

            <h1 className="text-7xl md:text-8xl font-black text-white mb-8 leading-tight">
              {language === 'ar' ? 'المنتجات' : 'Équipements'} <br />
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 bg-clip-text text-transparent">{language === 'ar' ? 'الصناعية' : 'Industriels'}</span>
            </h1>
            <p className="text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
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
          <div className="bg-gradient-to-br from-card/80 to-card/40 border border-accent/20 rounded-3xl p-6 backdrop-blur-sm hover:border-accent/40 transition-all space-y-5">

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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-card via-card to-card/90 border border-cyan-400/20 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black">
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
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-6 p-6">
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
                    {language === 'ar' ? 'الدفع عند الاستلام' : 'Paiement à la livraison'}
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
            <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Pages de produits">
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
        if (open) setOrderFormOpenTime(Date.now()); // Record time for bot detection
        if (!open) setCartStep('summary');
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="bg-gradient-to-r from-cyan-500 to-cyan-600 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
            <DialogTitle className="text-2xl text-white font-bold">
              {cartStep === 'summary' 
                ? (language === 'ar' ? 'سلة التسوق' : 'Panier')
                : (language === 'ar' ? 'إتمام الطلب' : 'Commander')
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
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>{language === 'ar' ? 'الدفع عبر WhatsApp' : 'Paiement via WhatsApp'}</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>{language === 'ar' ? 'سيتم إرسال ملخص الطلب عبر البريد الإلكتروني' : 'Récapitulatif de commande envoyé par email'}</li>
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
                  {/* Honeypot — hidden from humans, bots fill it */}
                  <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true" tabIndex={-1}>
                    <input
                      type="text"
                      name="website"
                      value={orderHoneypot}
                      onChange={(e) => setOrderHoneypot(e.target.value)}
                      autoComplete="off"
                      tabIndex={-1}
                    />
                  </div>
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
                        invoiceNumberRef.current = null;
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

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-6 border-t border-cyan-200">
                  <Button
                    onClick={() => setCartStep('summary')}
                    className="flex-1 border-2 border-primary text-primary hover:bg-primary/5 font-bold"
                    variant="outline"
                  >
                    ← {language === 'ar' ? 'السابق' : 'Précédent'}
                  </Button>
                  <Button
                    onClick={handleOrderSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold shadow-lg shadow-cyan-500/30"
                  >
                    {isSubmitting
                      ? (language === 'ar' ? 'جاري الإرسال...' : 'Envoi en cours...')
                      : (language === 'ar' ? 'إرسال الطلب' : 'Envoyer la commande')
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
