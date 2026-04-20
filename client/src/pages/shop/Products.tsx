import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingCart, Filter, Search, Star, Check, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import jsPDF from 'jspdf';

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
    image: 'https://source.unsplash.com/400x400/?safety%2Cswitch%3A',
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
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
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
    image: 'https://source.unsplash.com/400x400/?cutler%2Chammer',
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
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Module d\'entrées de sécurité Siemens F-DI. 8 canaux.',
    descriptionAr: 'وحدة مدخل أمان Siemens F-DI. 8 قنوات.',
    brand: 'Siemens',
    stock: 12
  },
  {
    id: '22',
    name: 'PC50CNR10RP',
    nameAr: 'PC50CNR10RP',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 495,
    image: 'https://source.unsplash.com/400x400/?legrand%2Cr%C3%A9partiteur',
    description: 'Capteurs photoélectriques Retro-reflective Range 10000mm, Power Supply 10.8-264VDC&21.6-264VAC',
    descriptionAr: 'Capteurs photoélectriques Retro-reflective Range 10000mm, Power Supply 10.8-264VDC&21.6-264VAC',
    brand: 'Somatisme',
    stock: 3
  },
  {
    id: '23',
    name: 'PC50CNR10BA',
    nameAr: 'PC50CNR10BA',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 396,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Capteurs photoélectriques Retro-reflective Power Supply 10-30VDC',
    descriptionAr: 'Capteurs photoélectriques Retro-reflective Power Supply 10-30VDC',
    brand: 'Somatisme',
    stock: 3
  },
  {
    id: '24',
    name: 'Y7020V000',
    nameAr: 'Y7020V000',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 220,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Barrière lumineuse monofaisceau 4 fils',
    descriptionAr: 'Barrière lumineuse monofaisceau 4 fils',
    brand: 'Somatisme',
    stock: 2
  },
  {
    id: '25',
    name: 'GC1360',
    nameAr: 'GC1360',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 440,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Boîte resine de jonction M 13/EG',
    descriptionAr: 'Boîte resine de jonction M 13/EG',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '26',
    name: 'OT-FESTO018646',
    nameAr: 'OT-FESTO018646',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 330,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'LR-1/2-D-MIDI (159581) pressure regulator',
    descriptionAr: 'LR-1/2-D-MIDI (159581) pressure regulator',
    brand: 'Somatisme',
    stock: 2
  },
  {
    id: '27',
    name: 'O 522 631',
    nameAr: 'O 522 631',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 220,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
    description: 'INCREMENTAL ENCODER EN ALUMINIUM 5 V 0522631 -O 5 V DC IP64 /4096AK.42TD',
    descriptionAr: 'INCREMENTAL ENCODER EN ALUMINIUM 5 V 0522631 -O 5 V DC IP64 /4096AK.42TD',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '28',
    name: '20133639',
    nameAr: '20133639',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 110,
    image: 'https://images.unsplash.com/photo-1563770095086-a5d7e044a00f?w=400&h=400&fit=crop',
    description: 'Lampe de signalisation 12V',
    descriptionAr: 'Lampe de signalisation 12V',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '29',
    name: 'OT45E3/30A',
    nameAr: 'OT45E3/30A',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1045,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Interrupteur de déconnexion OT45E3 ABB',
    descriptionAr: 'Interrupteur de déconnexion OT45E3 ABB',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '30',
    name: 'TIMER TMR 48U',
    nameAr: 'TIMER TMR 48U',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 660,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Crouzet 88886016 TIMER TMR 48U Relais temporisé multifonction',
    descriptionAr: 'Crouzet 88886016 TIMER TMR 48U Relais temporisé multifonction',
    brand: 'Somatisme',
    stock: 2
  },
  {
    id: '31',
    name: 'P3-63/I4/SVB/HI11',
    nameAr: 'P3-63/I4/SVB/HI11',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    description: 'Eaton Rotary disconnect main switch, Surface, 63 A, Red handle',
    descriptionAr: 'Eaton Rotary disconnect main switch, Surface, 63 A, Red handle',
    brand: 'Somatisme',
    stock: 4
  },
  {
    id: '32',
    name: 'MA150T83X11',
    nameAr: 'MA150T83X11',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 839.8499999999999,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
    description: 'Safety switch: key operated; MA150; NC + NO; IP65; plastic  NEW',
    descriptionAr: 'Safety switch: key operated; MA150; NC + NO; IP65; plastic  NEW',
    brand: 'Somatisme',
    stock: 3
  },
  {
    id: '33',
    name: '1775TPMPP1700',
    nameAr: '1775TPMPP1700',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
    description: 'CUTLER HAMMER 1775T-PMPP-1700 POWERMATE POWER PRO 92-01940-02 1775TPMPP1700  USED',
    descriptionAr: 'CUTLER HAMMER 1775T-PMPP-1700 POWERMATE POWER PRO 92-01940-02 1775TPMPP1700  USED',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '34',
    name: 'Repartiteur Bipolaire 125 A',
    nameAr: 'Repartiteur Bipolaire 125 A',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 165,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
    description: 'Legrand Répartiteur modulaire tétrapolaire 125A NEW',
    descriptionAr: 'Legrand Répartiteur modulaire tétrapolaire 125A NEW',
    brand: 'Somatisme',
    stock: 3
  },
  {
    id: '35',
    name: '3RV2011-1GA10',
    nameAr: '3RV2011-1GA10',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 3769.59,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
    description: 'Disjoncteur de puissance Siemens SIRIUS 3RV2011-1GA10   4,5----6,3A  NEW',
    descriptionAr: 'Disjoncteur de puissance Siemens SIRIUS 3RV2011-1GA10   4,5----6,3A  NEW',
    brand: 'Somatisme',
    stock: 3
  },
  {
    id: '36',
    name: '3RV2011-1HA10',
    nameAr: '3RV2011-1HA10',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 8796.48,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
    description: 'Disjoncteur de puissance Siemens SIRIUS 3RV2011-1HA10  5,5-----8A',
    descriptionAr: 'Disjoncteur de puissance Siemens SIRIUS 3RV2011-1HA10  5,5-----8A',
    brand: 'Somatisme',
    stock: 7
  },
  {
    id: '37',
    name: '3RV2011-0JA10',
    nameAr: '3RV2011-0JA10',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1896.4,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
    description: 'Disjoncteur de puissance Siemens SIRIUS 3RV2011-0JA10',
    descriptionAr: 'Disjoncteur de puissance Siemens SIRIUS 3RV2011-0JA10',
    brand: 'Somatisme',
    stock: 2
  },
  {
    id: '38',
    name: '3RV2011-1CA10',
    nameAr: '3RV2011-1CA10',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1078,
    image: 'https://images.unsplash.com/photo-1563770095086-a5d7e044a00f?w=400&h=400&fit=crop',
    description: 'Disjoncteur de puissance Siemens SIRIUS 3RV2011-1CA10  1,8----2,5A',
    descriptionAr: 'Disjoncteur de puissance Siemens SIRIUS 3RV2011-1CA10  1,8----2,5A',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '39',
    name: '3RV2011-1PA10',
    nameAr: '3RV2011-1PA10',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 979,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
    description: 'Disjoncteur de puissance Siemens SIRIUS 3RV2011-1PA10   1,4----2A',
    descriptionAr: 'Disjoncteur de puissance Siemens SIRIUS 3RV2011-1PA10   1,4----2A',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '40',
    name: '3RV2901',
    nameAr: '3RV2901',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1980,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
    description: 'Auxiliaire transversales Bornes à vis 1 NO +1 NF pour disjoncteur 3RV2',
    descriptionAr: 'Auxiliaire transversales Bornes à vis 1 NO +1 NF pour disjoncteur 3RV2',
    brand: 'Somatisme',
    stock: 20
  },
  {
    id: '41',
    name: '53P80, DN80',
    nameAr: '53P80, DN80',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 16500,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Endress+Hauser Promag 53P80, DN80 3″ 53P80-ER1B1RC2BBAA',
    descriptionAr: 'Endress+Hauser Promag 53P80, DN80 3″ 53P80-ER1B1RC2BBAA',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '42',
    name: 'Cable souple 1x4mm',
    nameAr: 'Cable souple 1x4mm',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1980,
    image: 'https://images.unsplash.com/photo-1563770095086-a5d7e044a00f?w=400&h=400&fit=crop',
    description: 'Cable souple 1x4mm',
    descriptionAr: 'Cable souple 1x4mm',
    brand: 'Somatisme',
    stock: 600
  },
  {
    id: '43',
    name: 'Garniture ',
    nameAr: 'Garniture ',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1650,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Jeux de Garniture mécanique',
    descriptionAr: 'Jeux de Garniture mécanique',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '44',
    name: '1761-L32BWA',
    nameAr: '1761-L32BWA',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1563770095086-a5d7e044a00f?w=400&h=400&fit=crop',
    description: 'ALLEN-BRADLEY MICROLOGIX 1000 1761-L32BWA SERIES E PLC Used',
    descriptionAr: 'ALLEN-BRADLEY MICROLOGIX 1000 1761-L32BWA SERIES E PLC Used',
    brand: 'Somatisme',
    stock: 2
  },
  {
    id: '45',
    name: '1762-L24BXB',
    nameAr: '1762-L24BXB',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 110,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: '1762-L24BXB Factory Sealed AB MicroLogix 1200 24 Point Controller',
    descriptionAr: '1762-L24BXB Factory Sealed AB MicroLogix 1200 24 Point Controller',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '46',
    name: '1762-IF2OF2',
    nameAr: '1762-IF2OF2',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 550,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: '1762-IF2OF2 1762-IF20F2 Allen Bradley Analog I/O Module  Used',
    descriptionAr: '1762-IF2OF2 1762-IF20F2 Allen Bradley Analog I/O Module  Used',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '47',
    name: ' 1785-PLC-5/40C',
    nameAr: ' 1785-PLC-5/40C',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 13200,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'ALLEN-BRADLEY PLC 5 1785-L40C15 ControlNet PLC-5 Processor PROCESSOR MODULE Used',
    descriptionAr: 'ALLEN-BRADLEY PLC 5 1785-L40C15 ControlNet PLC-5 Processor PROCESSOR MODULE Used',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '48',
    name: '1771-A1B',
    nameAr: '1771-A1B',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1650,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'ALLEN-BRADLEY 4 SLOT I/O CHASIS  Used',
    descriptionAr: 'ALLEN-BRADLEY 4 SLOT I/O CHASIS  Used',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '49',
    name: '1771-P7',
    nameAr: '1771-P7',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Power Supplay PLC 5 220VAC  Used',
    descriptionAr: 'Power Supplay PLC 5 220VAC  Used',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '50',
    name: '1771 IB16',
    nameAr: '1771 IB16',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 550,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Allen-Bradley carte INPUT 1771-IB',
    descriptionAr: 'Allen-Bradley carte INPUT 1771-IB',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '51',
    name: '1771-OB16',
    nameAr: '1771-OB16',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 550,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Allen-Bradley carte Output 1771-OB',
    descriptionAr: 'Allen-Bradley carte Output 1771-OB',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '52',
    name: '1771-IFE',
    nameAr: '1771-IFE',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 550,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Allen-Bradley carte Analogue INPUT 1771-',
    descriptionAr: 'Allen-Bradley carte Analogue INPUT 1771-',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '53',
    name: '1746-A4',
    nameAr: '1746-A4',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1430,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Allen-Bradley 1746-A4 SLC 500 4 Slot Modular I/O Chassis for 1746 I/O Modules',
    descriptionAr: 'Allen-Bradley 1746-A4 SLC 500 4 Slot Modular I/O Chassis for 1746 I/O Modules',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '54',
    name: '1746-BAS',
    nameAr: '1746-BAS',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 616,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Allen-Bradley 1746-BAS Basic Module',
    descriptionAr: 'Allen-Bradley 1746-BAS Basic Module',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '55',
    name: '1746-NI4',
    nameAr: '1746-NI4',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1397,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: '1746-ni4 Ser a SLC 500 Analog Input Module Allen-bradley ',
    descriptionAr: '1746-ni4 Ser a SLC 500 Analog Input Module Allen-bradley ',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '56',
    name: '1747-L532',
    nameAr: '1747-L532',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1650,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'New Allen-Bradley AB 1747-L532 /D SLC 500 SLC 5/03 CPU Processor Unit 1747L532',
    descriptionAr: 'New Allen-Bradley AB 1747-L532 /D SLC 500 SLC 5/03 CPU Processor Unit 1747L532',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '57',
    name: '1746-IB16',
    nameAr: '1746-IB16',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1563770095086-a5d7e044a00f?w=400&h=400&fit=crop',
    description: 'SLC 16 Point DC Input Module',
    descriptionAr: 'SLC 16 Point DC Input Module',
    brand: 'Somatisme',
    stock: 4
  },
  {
    id: '58',
    name: '1746-OA16 /A',
    nameAr: '1746-OA16 /A',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 550,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: '1746-Output Triac 220VAC',
    descriptionAr: '1746-Output Triac 220VAC',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '59',
    name: '1746-P2',
    nameAr: '1746-P2',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 165,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Allen Bradley SLC 500 ,1746-P2 Ser C ,Power Supply Module  Used',
    descriptionAr: 'Allen Bradley SLC 500 ,1746-P2 Ser C ,Power Supply Module  Used',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '60',
    name: '1756-A4',
    nameAr: '1756-A4',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Schassis Contrologix 4 Slots',
    descriptionAr: 'Schassis Contrologix 4 Slots',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '61',
    name: '1756-PA',
    nameAr: '1756-PA',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1563770095086-a5d7e044a00f?w=400&h=400&fit=crop',
    description: 'ALLEN BRADLEY 1756-PA75R 24VDC 110W CONTROLOGIX DC REDUNDANT POWER SUPPLY',
    descriptionAr: 'ALLEN BRADLEY 1756-PA75R 24VDC 110W CONTROLOGIX DC REDUNDANT POWER SUPPLY',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '62',
    name: 'MONI PT100 EXE',
    nameAr: 'MONI PT100 EXE',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'yco Contrôle Thermique Digitrace MONI PT100 EXE Température Sonde /',
    descriptionAr: 'yco Contrôle Thermique Digitrace MONI PT100 EXE Température Sonde /',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '63',
    name: 'E32-DC200 2M',
    nameAr: 'E32-DC200 2M',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 880,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'E32-CC200 2M Omron Fiber Sensor, For Industrial Omron',
    descriptionAr: 'E32-CC200 2M Omron Fiber Sensor, For Industrial Omron',
    brand: 'Somatisme',
    stock: 4
  },
  {
    id: '64',
    name: '6x50x125',
    nameAr: '6x50x125',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 13200,
    image: 'https://images.unsplash.com/photo-1563770095086-a5d7e044a00f?w=400&h=400&fit=crop',
    description: 'CABLE FIBRE OPTIQUE 6FO ARMEE OM3',
    descriptionAr: 'CABLE FIBRE OPTIQUE 6FO ARMEE OM3',
    brand: 'Somatisme',
    stock: 200
  },
  {
    id: '65',
    name: '6AV2124-OMC01',
    nameAr: '6AV2124-OMC01',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 27500,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Simatic Tp1200 Comfort Panel Touch Operation 12 Inches Widescreen TFT Display New 6AV2124-0mc01-0ax0',
    descriptionAr: 'Simatic Tp1200 Comfort Panel Touch Operation 12 Inches Widescreen TFT Display New 6AV2124-0mc01-0ax0',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '66',
    name: '579826 PALAZOLI',
    nameAr: '579826 PALAZOLI',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1276,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Palazzoli 579826 - topTER con portella trasparente alta capienza per installazione di 6 prese fisse IP66',
    descriptionAr: 'Palazzoli 579826 - topTER con portella trasparente alta capienza per installazione di 6 prese fisse IP66',
    brand: 'Somatisme',
    stock: 2
  },
  {
    id: '67',
    name: 'Ingelec 63*33',
    nameAr: 'Ingelec 63*33',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 3630,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Chemin de câble en tôle INGELEC 63x33',
    descriptionAr: 'Chemin de câble en tôle INGELEC 63x33',
    brand: 'Somatisme',
    stock: 33
  },
  {
    id: '68',
    name: 'Ingelec 100*63',
    nameAr: 'Ingelec 100*63',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 990,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    description: 'Chemin de câble en tôle INGELEC 100x63',
    descriptionAr: 'Chemin de câble en tôle INGELEC 100x63',
    brand: 'Somatisme',
    stock: 6
  },
  {
    id: '69',
    name: 'GS400X60',
    nameAr: 'GS400X60',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 26400,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    description: 'Chemin de cable PVC 300*100 AVEC Cache',
    descriptionAr: 'Chemin de cable PVC 300*100 AVEC Cache',
    brand: 'Somatisme',
    stock: 24
  },
  {
    id: '70',
    name: 'STAHL 81461083',
    nameAr: 'STAHL 81461083',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 3850,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
    description: 'Boite ATEX Stahel 600*600',
    descriptionAr: 'Boite ATEX Stahel 600*600',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '71',
    name: '2711P-RDT15C',
    nameAr: '2711P-RDT15C',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1650,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'PanelView Plus 6 1500 Touch  ONLY SCREEN old',
    descriptionAr: 'PanelView Plus 6 1500 Touch  ONLY SCREEN old',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '72',
    name: '2711P-RDK10C',
    nameAr: '2711P-RDK10C',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 2750,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
    description: 'Panel View plus key board new screen',
    descriptionAr: 'Panel View plus key board new screen',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '73',
    name: 'OP170B',
    nameAr: 'OP170B',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 110,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Operator Panel OP170B MONO 6AV6542-0BB15-2AX0 NOT FONCTION',
    descriptionAr: 'Operator Panel OP170B MONO 6AV6542-0BB15-2AX0 NOT FONCTION',
    brand: 'Somatisme',
    stock: 2
  },
  {
    id: '74',
    name: '1746-IM16',
    nameAr: '1746-IM16',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Input Module 16 New',
    descriptionAr: 'Input Module 16 New',
    brand: 'Somatisme',
    stock: 2
  },
  {
    id: '75',
    name: '1756IB16D',
    nameAr: '1756IB16D',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Intpout module Contrologix new',
    descriptionAr: 'Intpout module Contrologix new',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '76',
    name: '1756PB16E',
    nameAr: '1756PB16E',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Output Carte Contrologix new',
    descriptionAr: 'Output Carte Contrologix new',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '77',
    name: '1756MOSE',
    nameAr: '1756MOSE',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Carte servo drive new',
    descriptionAr: 'Carte servo drive new',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '78',
    name: '1SFA899003R1000',
    nameAr: '1SFA899003R1000',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'ABB 1SFA899003R1000 PSTEK EXTERNAL KEYPAD',
    descriptionAr: 'ABB 1SFA899003R1000 PSTEK EXTERNAL KEYPAD',
    brand: 'Somatisme',
    stock: 2
  },
  {
    id: '79',
    name: '100-SB100',
    nameAr: '100-SB100',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Contact auxiliaire Allen Bradley 100-SB10, 1NO (NEUF DANS SA BOÎTE)',
    descriptionAr: 'Contact auxiliaire Allen Bradley 100-SB10, 1NO (NEUF DANS SA BOÎTE)',
    brand: 'Somatisme',
    stock: 40
  },
  {
    id: '80',
    name: '100-FA10',
    nameAr: '100-FA10',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Contact auxiliaire Allen Bradley 100-FA10, 1NO (NEUF DANS SA BOÎTE)',
    descriptionAr: 'Contact auxiliaire Allen Bradley 100-FA10, 1NO (NEUF DANS SA BOÎTE)',
    brand: 'Somatisme',
    stock: 40
  },
  {
    id: '81',
    name: 'SRV1011-0KA10',
    nameAr: 'SRV1011-0KA10',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 6160,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
    description: 'Circuit breaker size S00 for motor protection, CLASS 10 A-release 0.9...1.25 A',
    descriptionAr: 'Circuit breaker size S00 for motor protection, CLASS 10 A-release 0.9...1.25 A',
    brand: 'Somatisme',
    stock: 7
  },
  {
    id: '82',
    name: 'AB Carte DH+/DH485/RIO ',
    nameAr: 'AB Carte DH+/DH485/RIO ',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Allen-Bradley 2711P-RN6 PanelView Plus DH/RIO/DH-485 Communication module',
    descriptionAr: 'Allen-Bradley 2711P-RN6 PanelView Plus DH/RIO/DH-485 Communication module',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '83',
    name: '1756-A4',
    nameAr: '1756-A4',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: '1756-A4 Allen Bradley - ControlLogix Chassis 4-Slot Rack',
    descriptionAr: '1756-A4 Allen Bradley - ControlLogix Chassis 4-Slot Rack',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '84',
    name: '1746A4',
    nameAr: '1746A4',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: '1746 A4 SLC 4 Slots Chassis  USED',
    descriptionAr: '1746 A4 SLC 4 Slots Chassis  USED',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '85',
    name: '1746 P2',
    nameAr: '1746 P2',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 550,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Alimentation automate Allen Bradley 1746 pour Série SLC 500  USED',
    descriptionAr: 'Alimentation automate Allen Bradley 1746 pour Série SLC 500  USED',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '86',
    name: '1746 L531',
    nameAr: '1746 L531',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Allen-Bradley SLC 500 Processor Unit 1746-L532 USED',
    descriptionAr: 'Allen-Bradley SLC 500 Processor Unit 1746-L532 USED',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '87',
    name: '1747-L543',
    nameAr: '1747-L543',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Processor Unit 1747-L543 Allen-Bradley SLC500 Series C *Used*',
    descriptionAr: 'Processor Unit 1747-L543 Allen-Bradley SLC500 Series C *Used*',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '88',
    name: '1746-IB16',
    nameAr: '1746-IB16',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'PLC Input Module 1746-IB16 Allen-Bradley SLC500 SER C 10-30VDC 1746-IB16 *Used*',
    descriptionAr: 'PLC Input Module 1746-IB16 Allen-Bradley SLC500 SER C 10-30VDC 1746-IB16 *Used*',
    brand: 'Somatisme',
    stock: 0
  },
  {
    id: '89',
    name: '1747-IN4',
    nameAr: '1747-IN4',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 550,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: '1746-NI4 Analog Input Module SLC 500 USED',
    descriptionAr: '1746-NI4 Analog Input Module SLC 500 USED',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '90',
    name: '1746OB16',
    nameAr: '1746OB16',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Output Module 1746-OB16 Allen Bradley SLC500 SER D 10-30Vdc 1746OB16 *Used*',
    descriptionAr: 'Output Module 1746-OB16 Allen Bradley SLC500 SER D 10-30Vdc 1746OB16 *Used*',
    brand: 'Somatisme',
    stock: 2
  },
  {
    id: '91',
    name: '1746-L532',
    nameAr: '1746-L532',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 550,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Allen Bradley 1746-L532 SLC500 Processor CPU Unit ',
    descriptionAr: 'Allen Bradley 1746-L532 SLC500 Processor CPU Unit ',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '92',
    name: '1746-OB8',
    nameAr: '1746-OB8',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 550,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
    description: '1746-OB8 SLC 500 PLC Module 1746-OB8 Output',
    descriptionAr: '1746-OB8 SLC 500 PLC Module 1746-OB8 Output',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '93',
    name: '1771-IFE',
    nameAr: '1771-IFE',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 550,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
    description: 'Allen-Bradley 1771-IFE PLC-5 Analog Input Module',
    descriptionAr: 'Allen-Bradley 1771-IFE PLC-5 Analog Input Module',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '94',
    name: 'RACK S7/300',
    nameAr: 'RACK S7/300',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 220,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Rail de montage Siemens S7-300 pour Série SIMATIC S7-300',
    descriptionAr: 'Rail de montage Siemens S7-300 pour Série SIMATIC S7-300',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '95',
    name: '6ES7312-1AE14-0AB0 ',
    nameAr: '6ES7312-1AE14-0AB0 ',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 550,
    image: 'https://images.unsplash.com/photo-1563770095086-a5d7e044a00f?w=400&h=400&fit=crop',
    description: '6ES7312-1AE14-0AB0 Siemens S7-300, CPU 312 CPU WITH MPI INTERFACE, USED',
    descriptionAr: '6ES7312-1AE14-0AB0 Siemens S7-300, CPU 312 CPU WITH MPI INTERFACE, USED',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '96',
    name: '6ES7 321-1BL00-0AA0',
    nameAr: '6ES7 321-1BL00-0AA0',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 550,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'INPUT MODULE SM 321 DI 32x24V DC',
    descriptionAr: 'INPUT MODULE SM 321 DI 32x24V DC',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '97',
    name: '720 2001-01',
    nameAr: '720 2001-01',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 220,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'connecteurs BUS Siemens 720 2001-01 PIS',
    descriptionAr: 'connecteurs BUS Siemens 720 2001-01 PIS',
    brand: 'Somatisme',
    stock: 10
  },
  {
    id: '98',
    name: '700-322-1BH01',
    nameAr: '700-322-1BH01',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'SYSTEM HELMHOLZ 700-322-1BH01 S7-DEA DO 16X DC24V - 0.5A USED',
    descriptionAr: 'SYSTEM HELMHOLZ 700-322-1BH01 S7-DEA DO 16X DC24V - 0.5A USED',
    brand: 'Somatisme',
    stock: 2
  },
  {
    id: '99',
    name: '700-321-1BH02',
    nameAr: '700-321-1BH02',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'YSTEME HELMHOLZ 700-321-1BH02 S7-DEA Di 16x DC24V',
    descriptionAr: 'YSTEME HELMHOLZ 700-321-1BH02 S7-DEA Di 16x DC24V',
    brand: 'Somatisme',
    stock: 2
  },
  {
    id: '100',
    name: '6ES7 321-1BL00',
    nameAr: '6ES7 321-1BL00',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1650,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
    description: 'MODULE D\'ENTRÉE NUMÉRIQUE SIMATIC 6ES7 321-1BL00-0AA0 SIMATIC 6ES73211BL000AA0  USED',
    descriptionAr: 'MODULE D\'ENTRÉE NUMÉRIQUE SIMATIC 6ES7 321-1BL00-0AA0 SIMATIC 6ES73211BL000AA0  USED',
    brand: 'Somatisme',
    stock: 3
  },
  {
    id: '101',
    name: ' 6ES7 322-1HH00',
    nameAr: ' 6ES7 322-1HH00',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Module de sortie Siemens 6ES7 322-1HH00-0AA0',
    descriptionAr: 'Module de sortie Siemens 6ES7 322-1HH00-0AA0',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '102',
    name: '6ES7322-5HB01',
    nameAr: '6ES7322-5HB01',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Siemens 6ES7322-5HB01-0AB0 6ES7 322-5HB01-0AB0 USED',
    descriptionAr: 'Siemens 6ES7322-5HB01-0AB0 6ES7 322-5HB01-0AB0 USED',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '103',
    name: '700-331-1KF01',
    nameAr: '700-331-1KF01',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 550,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Module d\'entrée analogique Helmholz 700-331-1KF01 AEA  USED',
    descriptionAr: 'Module d\'entrée analogique Helmholz 700-331-1KF01 AEA  USED',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '104',
    name: 'PM 1207',
    nameAr: 'PM 1207',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 330,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Alimentation Siemens SIMATIC PM 1207 6EP1332-1SH71 État du produit:01 -inutilisée/emballage d\'origine-',
    descriptionAr: 'Alimentation Siemens SIMATIC PM 1207 6EP1332-1SH71 État du produit:01 -inutilisée/emballage d\'origine-',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '105',
    name: 'CPU 1215C',
    nameAr: 'CPU 1215C',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 6600,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Siemens CPU 1215C - 6ES7215-1AG40-0XB0  -inutilisée/emballage d\'origine-',
    descriptionAr: 'Siemens CPU 1215C - 6ES7215-1AG40-0XB0  -inutilisée/emballage d\'origine-',
    brand: 'Somatisme',
    stock: 2
  },
  {
    id: '106',
    name: '6ES7223-1PL32-0XB0',
    nameAr: '6ES7223-1PL32-0XB0',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 3300,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Module PLC Siemens S7-1200 Sm1222  6es7223-1pl32-0xb0  inutilisée/emballage d\'origine-',
    descriptionAr: 'Module PLC Siemens S7-1200 Sm1222  6es7223-1pl32-0xb0  inutilisée/emballage d\'origine-',
    brand: 'Somatisme',
    stock: 3
  },
  {
    id: '107',
    name: '6ED1052-1MD00-0BA8 ',
    nameAr: '6ED1052-1MD00-0BA8 ',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 715,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
    description: 'LOGO! 12/24RCE,logic module,display PS/I/O: 12/24VDC/relay, 8 DI (4AI)/4DO, memory 400 blocks, modular expandable, Ethernet integr.',
    descriptionAr: 'LOGO! 12/24RCE,logic module,display PS/I/O: 12/24VDC/relay, 8 DI (4AI)/4DO, memory 400 blocks, modular expandable, Ethernet integr.',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '108',
    name: '1794-TB3',
    nameAr: '1794-TB3',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 660,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: '1794-TB3 Flex Terminal Base  USED',
    descriptionAr: '1794-TB3 Flex Terminal Base  USED',
    brand: 'Somatisme',
    stock: 3
  },
  {
    id: '109',
    name: '1794-IB16',
    nameAr: '1794-IB16',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 660,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
    description: 'Allen-Bradley 1794-IB16 24 VDC Sink Input - 1794-IB16-A-B01  USED',
    descriptionAr: 'Allen-Bradley 1794-IB16 24 VDC Sink Input - 1794-IB16-A-B01  USED',
    brand: 'Somatisme',
    stock: 3
  },
  {
    id: '110',
    name: '1794-OB16',
    nameAr: '1794-OB16',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1650,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: '1794-OB16 Flex 16 Point Digital Output Module   USED',
    descriptionAr: '1794-OB16 Flex 16 Point Digital Output Module   USED',
    brand: 'Somatisme',
    stock: 5
  },
  {
    id: '111',
    name: '6ES5095-8MB02',
    nameAr: '6ES5095-8MB02',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 550,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
    description: 'Siemens 6ES5095-8MB02 CPU S5-95U MODULE SIMATIC S5   USED',
    descriptionAr: 'Siemens 6ES5095-8MB02 CPU S5-95U MODULE SIMATIC S5   USED',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '112',
    name: '6ES5 440-8MA21',
    nameAr: '6ES5 440-8MA21',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 550,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'IEMENS SIMATIC S5 6ES5 440-8MA21 DIGITAL OUTPUT MODULE   USED',
    descriptionAr: 'IEMENS SIMATIC S5 6ES5 440-8MA21 DIGITAL OUTPUT MODULE   USED',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '113',
    name: '6ES5 700-8MA11',
    nameAr: '6ES5 700-8MA11',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 110,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Siemens Simatic S5 6ES5 700-8MA11 Bus Module   USED',
    descriptionAr: 'Siemens Simatic S5 6ES5 700-8MA11 Bus Module   USED',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '114',
    name: 'IK73L024XM01',
    nameAr: 'IK73L024XM01',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 770,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Colonne de signalisation; /vert/jaune; LED; 24VDC; 24VAC SANS TIGE  new',
    descriptionAr: 'Colonne de signalisation; /vert/jaune; LED; 24VDC; 24VAC SANS TIGE  new',
    brand: 'Somatisme',
    stock: 7
  },
  {
    id: '115',
    name: '565958(M7)',
    nameAr: '565958(M7)',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 440,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
    description: 'Elematic ELEFIX 16-32  new',
    descriptionAr: 'Elematic ELEFIX 16-32  new',
    brand: 'Somatisme',
    stock: 200
  },
  {
    id: '116',
    name: '3RT1016-1BB41',
    nameAr: '3RT1016-1BB41',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1980,
    image: 'https://images.unsplash.com/photo-1563770095086-a5d7e044a00f?w=400&h=400&fit=crop',
    description: 'Contacteur de puissance, AC-3 9 A, 4 kW / 400 V 1 NO, 24 V CC 3 pôles,  new',
    descriptionAr: 'Contacteur de puissance, AC-3 9 A, 4 kW / 400 V 1 NO, 24 V CC 3 pôles,  new',
    brand: 'Somatisme',
    stock: 9
  },
  {
    id: '117',
    name: '3RV1902-1AB0',
    nameAr: '3RV1902-1AB0',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 4950,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
    description: 'Relaisn Declencheur Siemens  new',
    descriptionAr: 'Relaisn Declencheur Siemens  new',
    brand: 'Somatisme',
    stock: 9
  },
  {
    id: '118',
    name: 'SJR2',
    nameAr: 'SJR2',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 220,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'ON DELAY time relay, 2-channels SJR-2  new',
    descriptionAr: 'ON DELAY time relay, 2-channels SJR-2  new',
    brand: 'Somatisme',
    stock: 2
  },
  {
    id: '119',
    name: 'GV2ME22',
    nameAr: 'GV2ME22',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 594,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: ' Disjoncteur de protection moteur série Gv2 20-25 A  new',
    descriptionAr: ' Disjoncteur de protection moteur série Gv2 20-25 A  new',
    brand: 'Somatisme',
    stock: 3
  },
  {
    id: '120',
    name: 'GVAS025',
    nameAr: 'GVAS025',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 880,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'DÉCLENCHEUR VOLTMÉTRIQUE - TESYS GV - 24V AC - SCHNEIDER ELECTRIC GVAS025  new',
    descriptionAr: 'DÉCLENCHEUR VOLTMÉTRIQUE - TESYS GV - 24V AC - SCHNEIDER ELECTRIC GVAS025  new',
    brand: 'Somatisme',
    stock: 4
  },
  {
    id: '121',
    name: '375010',
    nameAr: '375010',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 330,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
    description: '375010Ingelec Telerrupteur new',
    descriptionAr: '375010Ingelec Telerrupteur new',
    brand: 'Somatisme',
    stock: 3
  },
  {
    id: '122',
    name: 'LC1D40AQ7',
    nameAr: 'LC1D40AQ7',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 935,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=400&fit=crop',
    description: 'Contacteur Schneider LC1D40AQ7 new',
    descriptionAr: 'Contacteur Schneider LC1D40AQ7 new',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '123',
    name: 'ins63 Schneider',
    nameAr: 'ins63 Schneider',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 330,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Interrupteur Schneider 63A INS63 new',
    descriptionAr: 'Interrupteur Schneider 63A INS63 new',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '124',
    name: 'GMDM DN50',
    nameAr: 'GMDM DN50',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'BMeters 2" BSP (50mm) GMDM-i Multi Jet Cold Water Meter, PN: GMDM-50AF  NEW',
    descriptionAr: 'BMeters 2" BSP (50mm) GMDM-i Multi Jet Cold Water Meter, PN: GMDM-50AF  NEW',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '125',
    name: 'E2A-M12KS04',
    nameAr: 'E2A-M12KS04',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 330,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Capteur de proximité Omron, M12, Détection 4 mm, PNP NO, 12→24 V c.c',
    descriptionAr: 'Capteur de proximité Omron, M12, Détection 4 mm, PNP NO, 12→24 V c.c',
    brand: 'Somatisme',
    stock: 3
  },
  {
    id: '126',
    name: 'E2A-M08KS02',
    nameAr: 'E2A-M08KS02',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 110,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Capteur de proximité Omron, M08, Détection 4 mm, PNP NO, 12→24 V c.c',
    descriptionAr: 'Capteur de proximité Omron, M08, Détection 4 mm, PNP NO, 12→24 V c.c',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '127',
    name: 'ZCP21M12',
    nameAr: 'ZCP21M12',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 110,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'SCHNEIDER ZCP21M12 LIMIT SWITCH',
    descriptionAr: 'SCHNEIDER ZCP21M12 LIMIT SWITCH',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '128',
    name: 'E3X-NA11',
    nameAr: 'E3X-NA11',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 110,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Capteur photoélectrique Omron E3X-NA11',
    descriptionAr: 'Capteur photoélectrique Omron E3X-NA11',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '129',
    name: 'LADN22',
    nameAr: 'LADN22',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 220,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'LADN22 Schneider Electric auxiliary contact block',
    descriptionAr: 'LADN22 Schneider Electric auxiliary contact block',
    brand: 'Somatisme',
    stock: 4
  },
  {
    id: '130',
    name: 'ZB2BZ105',
    nameAr: 'ZB2BZ105',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 220,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'TELEMECANIQUE ZB2BZ105, 061434, Push button body with switches',
    descriptionAr: 'TELEMECANIQUE ZB2BZ105, 061434, Push button body with switches',
    brand: 'Somatisme',
    stock: 4
  },
  {
    id: '131',
    name: 'XB5 AV61',
    nameAr: 'XB5 AV61',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 275,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Harmony XB5 - voyant lumineux BA9s - Ø22 - blanc - direct 250V max - vis étrier',
    descriptionAr: 'Harmony XB5 - voyant lumineux BA9s - Ø22 - blanc - direct 250V max - vis étrier',
    brand: 'Somatisme',
    stock: 5
  },
  {
    id: '132',
    name: '1/2 UW-15',
    nameAr: '1/2 UW-15',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 220,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: '1/2 UW-15 Uni-D Type Brass Solenoid Valve 220VAC',
    descriptionAr: '1/2 UW-15 Uni-D Type Brass Solenoid Valve 220VAC',
    brand: 'Somatisme',
    stock: 2
  },
  {
    id: '133',
    name: 'PG29 H32A',
    nameAr: 'PG29 H32A',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 110,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Connecteur résistant à 32 broches PG29 Mâle Femelle Butt-Joint H32A Shell Hasp High Surface Mounting High Top Cable Entry',
    descriptionAr: 'Connecteur résistant à 32 broches PG29 Mâle Femelle Butt-Joint H32A Shell Hasp High Surface Mounting High Top Cable Entry',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '134',
    name: ' AKS18/4609S',
    nameAr: ' AKS18/4609S',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 55,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Capacitive proximity sensor AKS18/4609S',
    descriptionAr: 'Capacitive proximity sensor AKS18/4609S',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '135',
    name: 'TISCH ENVIREMENT',
    nameAr: 'TISCH ENVIREMENT',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 660,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'ISCH TE-2000PS INDUSTRIAL HYGIENE ENZYME SAMPLER 110V-AC D532586',
    descriptionAr: 'ISCH TE-2000PS INDUSTRIAL HYGIENE ENZYME SAMPLER 110V-AC D532586',
    brand: 'Somatisme',
    stock: 3
  },
  {
    id: '136',
    name: ' CS310',
    nameAr: ' CS310',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'MARANTEC CS310 - Armoire de commande pour moteurs mono ou triphasés',
    descriptionAr: 'MARANTEC CS310 - Armoire de commande pour moteurs mono ou triphasés',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '137',
    name: 'NFS 2-8',
    nameAr: 'NFS 2-8',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Notifier NFS 8 Zone Conventional Fire Alarm Panel',
    descriptionAr: 'Notifier NFS 8 Zone Conventional Fire Alarm Panel',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '138',
    name: 'KL731',
    nameAr: 'KL731',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 330,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'KL731KELSEN  Sans Support',
    descriptionAr: 'KL731KELSEN  Sans Support',
    brand: 'Somatisme',
    stock: 3
  },
  {
    id: '139',
    name: 'SICK WS36-D430',
    nameAr: 'SICK WS36-D430',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 110,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'SICK WS36-D430 THROUGH-BEAM PHOTOELECTRIC SENSOR avec Recipteur',
    descriptionAr: 'SICK WS36-D430 THROUGH-BEAM PHOTOELECTRIC SENSOR avec Recipteur',
    brand: 'Somatisme',
    stock: 1
  },
  {
    id: '140',
    name: 'sc_upc',
    nameAr: 'sc_upc',
    category: 'equipment',
    categoryAr: 'معدات',
    price: 110,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Optical Patchcord SC UPC/SC UPC Duplex',
    descriptionAr: 'Optical Patchcord SC UPC/SC UPC Duplex',
    brand: 'Somatisme',
    stock: 2
  }
];

const categories = [
  { id: 'all', name: 'Tous', nameAr: 'الكل' },
  { id: 'automation', name: 'Automatisme', nameAr: 'أتمتة' },
  { id: 'regulation', name: 'Régulation', nameAr: 'تنظيم' },
  { id: 'electrical', name: 'Électricité', nameAr: 'كهرباء' },
  { id: 'equipment', name: 'Équipement', nameAr: 'معدات' }
];

export default function Products() {
  const { t } = useLanguage();
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
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

  const generateInvoice = (orderItems: any[], orderInfo: any, total: number) => {
    const doc = new jsPDF();
    const invoiceNumber = `INV-${Date.now()}`;
    const date = new Date().toLocaleDateString('fr-FR');
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR');
    
    // Header - Modern gradient-like effect
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 210, 50, 'F');
    
    // Company name
    doc.setFontSize(32);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('SOMATISME', 20, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(200, 200, 200);
    doc.setFont('helvetica', 'normal');
    doc.text('Équipements Industriels', 20, 35);
    doc.text('Solutions d\'automatisation & régulation', 20, 42);
    
    // Invoice info on the right
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('FACTURE', 170, 20, { align: 'right' });
    doc.setFontSize(8);
    doc.text(`#${invoiceNumber}`, 170, 27, { align: 'right' });
    doc.text(`Date: ${date}`, 170, 34, { align: 'right' });
    doc.text(`Échéance: ${dueDate}`, 170, 41, { align: 'right' });
    
    // Status badge - Modern design
    doc.setFillColor(239, 68, 68);
    doc.roundedRect(130, 55, 65, 14, 4, 4, 'F');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('STATUT: À PAYER', 162.5, 63, { align: 'center' });
    
    // Bill to section
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 138);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURÉ À', 15, 80);
    
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(orderInfo.name, 15, 88);
    if (orderInfo.company) {
      doc.text(orderInfo.company, 15, 95);
      doc.text(orderInfo.address || '', 15, 102);
    } else {
      doc.text(orderInfo.address || '', 15, 95);
    }
    doc.text(orderInfo.email, 15, orderInfo.company ? 109 : 102);
    doc.text(orderInfo.phone, 15, orderInfo.company ? 116 : 109);
    
    // Ship to section
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 138);
    doc.setFont('helvetica', 'bold');
    doc.text('LIVRÉ À', 120, 80);
    
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.text('SOMATISME', 120, 88);
    doc.text('Équipements Industriels', 120, 95);
    doc.text('Maroc', 120, 102);
    doc.text('+212 679 825 646', 120, 109);
    doc.text('contact@somatisme.ma', 120, 116);
    
    // Products table header
    doc.setFillColor(30, 58, 138);
    doc.rect(15, 130, 180, 12, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('#', 20, 137);
    doc.text('DESCRIPTION', 35, 137);
    doc.text('QUANTITÉ', 130, 137);
    doc.text('PRIX UNITAIRE', 155, 137);
    doc.text('TOTAL', 185, 137);
    
    // Products table rows
    let y = 145;
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    
    orderItems.forEach((item, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(15, y - 5, 180, 12, 'F');
      }
      
      doc.text(`${index + 1}`, 20, y);
      doc.text(item.name.substring(0, 50) + (item.name.length > 50 ? '...' : ''), 35, y);
      doc.text('1', 130, y);
      doc.text(`${item.price} MAD`, 155, y);
      doc.text(`${item.price} MAD`, 185, y);
      y += 12;
    });
    
    // Summary section
    y += 5;
    doc.setFillColor(248, 250, 252);
    doc.rect(120, y, 75, 50, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.text('Sous-total:', 125, y + 10);
    doc.text(`${total} MAD`, 185, y + 10, { align: 'right' });
    
    doc.text('TVA (0%):', 125, y + 20);
    doc.text('0.00 MAD', 185, y + 20, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text('TOTAL:', 125, y + 35);
    doc.setFontSize(14);
    doc.text(`${total} MAD`, 185, y + 35, { align: 'right' });
    
    // Notes and terms
    y += 60;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text('NOTES & CONDITIONS', 15, y);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Merci pour votre commande. Le paiement est dû à la livraison.', 15, y + 8);
    doc.text('Délai de livraison selon disponibilité du stock.', 15, y + 15);
    doc.text('Garantie selon le type de produit.', 15, y + 22);
    doc.text('Pour toute question, contactez-nous au +212 679 825 646', 15, y + 29);
    
    // Footer - Modern design
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 275, 210, 22, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('SOMATISME', 105, 283, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Équipements Industriels | +212 679 825 646 | contact@somatisme.ma', 105, 290, { align: 'center' });
    doc.text('www.somatisme.ma', 105, 295, { align: 'center' });
    
    // Save the PDF
    doc.save(`Facture_${invoiceNumber}.pdf`);
  };

  const handleOrderSubmit = async () => {
    if (!orderForm.name || !orderForm.email || !orderForm.phone) {
      toast.error('Veuillez remplir tous les champs requis');
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

      // Generate invoice
      generateInvoice(orderItems, orderForm, cartTotal);

      // Send order via WhatsApp
      const orderMessage = `NOUVELLE COMMANDE - PAIEMENT WHATSAPP\n\nNom: ${orderForm.name}\nEmail: ${orderForm.email}\nTéléphone: ${orderForm.phone}\nEntreprise: ${orderForm.company}\nAdresse: ${orderForm.address}\n\nProduits commandés:\n${orderItems.map(item => `- ${item.name}: ${item.price} MAD`).join('\n')}\n\nTotal: ${cartTotal} MAD\n\nMessage: ${orderForm.message}`;
      
      const whatsappUrl = `https://wa.me/212679825646?text=${encodeURIComponent(orderMessage)}`;
      window.open(whatsappUrl, '_blank');
      
      toast.success('Commande envoyée avec succès. Facture téléchargée.');
      setCart([]);
      setShowOrderDialog(false);
      setShowCart(false);
      setOrderForm({ name: '', email: '', phone: '', company: '', address: '', message: '' });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la commande');
      console.error('Order submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Search and Filters */}
      <section className="py-12 bg-muted/30 border-y border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder={language === 'ar' ? 'بحث عن منتج...' : 'Rechercher un produit...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
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
              <ShoppingCart className="h-5 w-5 mr-2" />
              {language === 'ar' ? 'السلة' : 'Panier'}
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-accent text-accent-foreground">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {showCart && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed right-0 top-0 h-full w-80 bg-card border-l shadow-lg z-50 p-4 overflow-y-auto"
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
                <div className="flex justify-between mb-4">
                  <span className="font-bold">{language === 'ar' ? 'المجموع' : 'Total'}:</span>
                  <span className="font-bold">{cartTotal} MAD</span>
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
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-card border border-border rounded-lg p-6 hover:border-accent transition-all duration-300 hover:shadow-lg"
              >
                <div className="aspect-square overflow-hidden bg-muted rounded-lg mb-4">
                  <img
                    src={product.image}
                    alt={language === 'ar' ? product.nameAr : product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <Badge variant="secondary" className="mb-3 text-xs">
                  {language === 'ar' ? product.categoryAr : product.category}
                </Badge>
                <h3 className="text-subheading text-foreground mb-2 line-clamp-2">
                  {language === 'ar' ? product.nameAr : product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{product.brand}</p>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {language === 'ar' ? product.descriptionAr : product.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-lg font-bold text-primary">{product.price} MAD</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock === 0 
                    ? (language === 'ar' ? 'نفدت الكمية' : 'Rupture')
                    : (language === 'ar' ? 'أضف' : 'Ajouter')
                  }
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {language === 'ar' ? `الكمية: ${product.stock}` : `Stock: ${product.stock}`}
                </p>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
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
              <div className="bg-muted p-3 rounded-lg text-sm">
                <p className="font-medium mb-1">
                  {language === 'ar' ? 'معلومات الدفع:' : 'Informations de paiement:'}
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• {language === 'ar' ? 'الدفع عبر WhatsApp' : 'Paiement via WhatsApp'}</li>
                  <li>• {language === 'ar' ? 'فاتورة manuelle envoyée par email' : 'Facture manuelle envoyée par email'}</li>
                  <li>• {language === 'ar' ? 'Coordonner avec nous pour le rendez-vous' : 'Coordonner avec nous pour le rendez-vous'}</li>
                </ul>
              </div>
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
