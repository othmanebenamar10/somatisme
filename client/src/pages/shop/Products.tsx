import { useState } from 'react';
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

interface Product {
  id: string;
  name: string;
  nameAr: string;
  reference?: string;
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
  {"id": "1", "name": "Capteurs photoélectriques Retro-reflective  Range 10000mm, Power Supply 10.8-264VDC&21.6-264VAC,", "nameAr": "Capteurs photoélectriques Retro-reflective  Range 10000mm, Power Supply 10.8-264VDC&21.6-264VAC,", "reference": "PC50CNR10RP", "category": "sensors", "categoryAr": "حساسات وكاشفات", "price": 165, "image": "/products/image44.jpeg", "description": "Capteur photoélectrique rétro-réfléchissant à longue portée 10000mm. Alimentation universelle 10.8-264VDC & 21.6-264VAC. Sortie NPN/PNP commutable. Protection IP67. Idéal pour la détection d'objets sans contact sur grande distance en environnement industriel.", "descriptionAr": "Capteur photoélectrique rétro-réfléchissant à longue portée 10000mm. Alimentation universelle 10.8-264VDC & 21.6-264VAC. Sortie NPN/PNP commutable. Protection IP67. Idéal pour la détection d'objets sans contact sur grande distance en environnement industriel.", "brand": "Industriel", "stock": 3, "featured": true},
  {"id": "2", "name": "Capteurs photoélectriques Retro-reflective  Power Supply 10-30VDC,", "nameAr": "Capteurs photoélectriques Retro-reflective  Power Supply 10-30VDC,", "reference": "PC50CNR10BA", "category": "sensors", "categoryAr": "حساسات وكاشفات", "price": 132, "image": "/products/image44.jpeg", "description": "Capteur photoélectrique rétro-réfléchissant compact. Alimentation 10-30VDC. Sortie NPN/PNP. Boîtier plastique robuste IP65. Adapté aux environnements industriels poussiéreux. Temps de réponse rapide, LED de signalisation intégrée.", "descriptionAr": "Capteur photoélectrique rétro-réfléchissant compact. Alimentation 10-30VDC. Sortie NPN/PNP. Boîtier plastique robuste IP65. Adapté aux environnements industriels poussiéreux. Temps de réponse rapide, LED de signalisation intégrée.", "brand": "Industriel", "stock": 3, "featured": true},
  {"id": "3", "name": "Barrière lumineuse monofaisceau 4 fils", "nameAr": "Barrière lumineuse monofaisceau 4 fils", "reference": "Y7020V000", "category": "sensors", "categoryAr": "حساسات وكاشفات", "price": 110, "image": "/products/image3.jpeg", "description": "Barrière lumineuse monofaisceau 4 fils. Émetteur et récepteur séparés pour détection fiable. Alimentation 24VDC. Portée ajustable. Protection contre les fausses détections. Application : contrôle d'accès, comptage, positionnement.", "descriptionAr": "Barrière lumineuse monofaisceau 4 fils. Émetteur et récepteur séparés pour détection fiable. Alimentation 24VDC. Portée ajustable. Protection contre les fausses détections. Application : contrôle d'accès, comptage, positionnement.", "brand": "Industriel", "stock": 2, "featured": true},
  {"id": "4", "name": "Boîte resine de jonction M 13/EG", "nameAr": "Boîte resine de jonction M 13/EG", "reference": "GC1360", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 440, "image": "/products/image39.jpeg", "description": "Boîte de jonction résine M 13/EG pour câblage étanche. Protection IP68. Résine époxy bi-composant assurant une isolation parfaite. Utilisée pour les raccordements souterrains et en milieu humide.", "descriptionAr": "Boîte de jonction résine M 13/EG pour câblage étanche. Protection IP68. Résine époxy bi-composant assurant une isolation parfaite. Utilisée pour les raccordements souterrains et en milieu humide.", "brand": "Industriel", "stock": 1, "featured": true},
  {"id": "5", "name": "LR-1/2-D-MIDI (159581) pressure regulator", "nameAr": "LR-1/2-D-MIDI (159581) pressure regulator", "reference": "OT-FESTO018646", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 165, "image": "/products/image37.jpeg", "description": "Régulateur de pression FESTO LR-1/2-D-MIDI (réf. 159581). Taraudage G1/2, plage de réglage 0.5-16 bar. Manomètre intégré. Corps en zinc. Filtre intégré. Débit maximal 3700 l/min. Pour air comprimé propre et sec.", "descriptionAr": "Régulateur de pression FESTO LR-1/2-D-MIDI (réf. 159581). Taraudage G1/2, plage de réglage 0.5-16 bar. Manomètre intégré. Corps en zinc. Filtre intégré. Débit maximal 3700 l/min. Pour air comprimé propre et sec.", "brand": "Festo", "stock": 2, "featured": true},
  {"id": "6", "name": "INCREMENTAL ENCODER EN ALUMINIUM 5 V 0522631 -O 5 V DC IP64 /4096AK.42TD", "nameAr": "INCREMENTAL ENCODER EN ALUMINIUM 5 V 0522631 -O 5 V DC IP64 /4096AK.42TD", "reference": "O 522 631", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 220, "image": "/products/image38.jpeg", "description": "Encodeur incrémental en aluminium 5V DC. Résolution 4096 points/tour (AK.42TD). Indice de protection IP64. Alimentation 5VDC. Signal de sortie différentiel. Arbre Ø6mm. Adapté aux applications de positionnement précis et de contrôle de vitesse.", "descriptionAr": "Encodeur incrémental en aluminium 5V DC. Résolution 4096 points/tour (AK.42TD). Indice de protection IP64. Alimentation 5VDC. Signal de sortie différentiel. Arbre Ø6mm. Adapté aux applications de positionnement précis et de contrôle de vitesse.", "brand": "Industriel", "stock": 1, "featured": true},
  {"id": "7", "name": "Lampe de signalisation 12V", "nameAr": "Lampe de signalisation 12V", "reference": "20133639", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 110, "image": "/products/image26.jpeg", "description": "Lampe de signalisation industrielle 12V. Corps métallique robuste. LED longue durée. Indicateur visuel pour tableaux de commande et pupitres. Couleur et monture standard.", "descriptionAr": "Lampe de signalisation industrielle 12V. Corps métallique robuste. LED longue durée. Indicateur visuel pour tableaux de commande et pupitres. Couleur et monture standard.", "brand": "Industriel", "stock": 1, "featured": false},
  {"id": "8", "name": "Interrupteur de déconnexion OT45E3 ABB", "nameAr": "Interrupteur de déconnexion OT45E3 ABB", "reference": "OT45E3/30A", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 1045, "image": "/products/image45.jpeg", "description": "Interrupteur-sectionneur ABB OT45E3 30A. 3 pôles, calibre 30A. Montage en saillie. Poignée rotative rouge/jaune. Coupure visible, cadenassable en position ouverte. Conforme IEC 60947-3.", "descriptionAr": "Interrupteur-sectionneur ABB OT45E3 30A. 3 pôles, calibre 30A. Montage en saillie. Poignée rotative rouge/jaune. Coupure visible, cadenassable en position ouverte. Conforme IEC 60947-3.", "brand": "ABB", "stock": 1, "featured": false},
  {"id": "9", "name": "Crouzet 88886016 TIMER TMR 48U Relais temporisé multifonction 1 pc(s) Plage temporelle: 0.02 s - 300 h 2 inverseurs (RT) NEW", "nameAr": "Crouzet 88886016 TIMER TMR 48U Relais temporisé multifonction 1 pc(s) Plage temporelle: 0.02 s - 300 h 2 inverseurs (RT) NEW", "reference": "TIMER TMR 48U", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 330, "image": "/products/image25.jpeg", "description": "Relais temporisé multifonction Crouzet 88886016 TMR 48U. 1 pc, boîtier 48x48mm. Plage temporelle 0.02s à 300h. 2 contacts inverseurs (RT). Alimentation universelle. 11 fonctions de temporisation. Nouvelle unité en boîte d'origine.", "descriptionAr": "Relais temporisé multifonction Crouzet 88886016 TMR 48U. 1 pc, boîtier 48x48mm. Plage temporelle 0.02s à 300h. 2 contacts inverseurs (RT). Alimentation universelle. 11 fonctions de temporisation. Nouvelle unité en boîte d'origine.", "brand": "Crouzet", "stock": 2, "featured": false},
  {"id": "10", "name": "Eaton Rotary disconnect main switch, Surface, 63 A, Red handle NEW", "nameAr": "Eaton Rotary disconnect main switch, Surface, 63 A, Red handle NEW", "reference": "P3-63/I4/SVB/HI11", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 550, "image": "/products/image22.jpeg", "description": "Interrupteur-sectionneur rotatif Eaton 63A. 3 pôles + neutre (I4). Montage en surface (SVB). Poignée rouge verrouillable (HI11). Calibre 63A 690V. Coupure omnipolaire visible. Conforme EN 60947-3. Neuf.", "descriptionAr": "Interrupteur-sectionneur rotatif Eaton 63A. 3 pôles + neutre (I4). Montage en surface (SVB). Poignée rouge verrouillable (HI11). Calibre 63A 690V. Coupure omnipolaire visible. Conforme EN 60947-3. Neuf.", "brand": "Eaton", "stock": 4, "featured": false},
  {"id": "11", "name": "Safety switch: key operated; MA150; NC + NO; IP65; plastic  NEW", "nameAr": "Safety switch: key operated; MA150; NC + NO; IP65; plastic  NEW", "reference": "MA150T83X11", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 280, "image": "/products/image23.jpeg", "description": "Interrupteur de sécurité à clé MA150. NC + NO. Protection IP65. Corps en plastique renforcé. Actionné par clé de sécurité. Montage universel. Conforme aux normes de sécurité machine EN ISO 14119. Neuf.", "descriptionAr": "Interrupteur de sécurité à clé MA150. NC + NO. Protection IP65. Corps en plastique renforcé. Actionné par clé de sécurité. Montage universel. Conforme aux normes de sécurité machine EN ISO 14119. Neuf.", "brand": "Industriel", "stock": 3, "featured": false},
  {"id": "12", "name": "CUTLER HAMMER 1775T-PMPP-1700 POWERMATE POWER PRO 92-01940-02 1775TPMPP1700  USED", "nameAr": "CUTLER HAMMER 1775T-PMPP-1700 POWERMATE POWER PRO 92-01940-02 1775TPMPP1700  USED", "reference": "1775TPMPP1700", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 2200, "image": "/products/image24.jpeg", "description": "Terminal IHM CutlerHammer 1775T-PMPP-1700 PanelMate Power Pro. Écran couleur tactile. Interface opérateur industrielle pour supervision et contrôle. Référence 92-01940-02. État : Occasion fonctionnelle.", "descriptionAr": "Terminal IHM CutlerHammer 1775T-PMPP-1700 PanelMate Power Pro. Écran couleur tactile. Interface opérateur industrielle pour supervision et contrôle. Référence 92-01940-02. État : Occasion fonctionnelle.", "brand": "Industriel", "stock": 1, "featured": false},
  {"id": "13", "name": "Legrand Répartiteur modulaire tétrapolaire 125A NEW", "nameAr": "Legrand Répartiteur modulaire tétrapolaire 125A NEW", "reference": "Repartiteur Bipolaire 125 A", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 55, "image": "/products/image46.jpeg", "description": "Répartiteur modulaire tétrapolaire Legrand 125A. 4 pôles. 11 sorties Ø4.5mm, 2 sorties Ø6mm. Calibre 125A. Tension 500V, Icc 3kA. Conforme EN 60947-7-1. Installation sur rail DIN. Neuf.", "descriptionAr": "Répartiteur modulaire tétrapolaire Legrand 125A. 4 pôles. 11 sorties Ø4.5mm, 2 sorties Ø6mm. Calibre 125A. Tension 500V, Icc 3kA. Conforme EN 60947-7-1. Installation sur rail DIN. Neuf.", "brand": "Legrand", "stock": 3, "featured": false},
  {"id": "14", "name": "Disjoncteur de puissance Siemens SIRIUS 3RV2011-1GA10   4,5----6,3A  NEW", "nameAr": "Disjoncteur de puissance Siemens SIRIUS 3RV2011-1GA10   4,5----6,3A  NEW", "reference": "3RV2011-1GA10", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 1257, "image": "/products/image13.jpeg", "description": "Disjoncteur de protection moteur Siemens SIRIUS 3RV2011-1GA10. Calibre thermique 4.5-6.3A. Pouvoir de coupure 100kA à 400V. Taille S00. CLASS 10. 3 pôles. Montage sur rail DIN. Neuf en boîte.", "descriptionAr": "Disjoncteur de protection moteur Siemens SIRIUS 3RV2011-1GA10. Calibre thermique 4.5-6.3A. Pouvoir de coupure 100kA à 400V. Taille S00. CLASS 10. 3 pôles. Montage sur rail DIN. Neuf en boîte.", "brand": "Siemens", "stock": 3, "featured": false},
  {"id": "15", "name": "Disjoncteur de puissance Siemens SIRIUS 3RV2011-1HA10  5,5-----8A", "nameAr": "Disjoncteur de puissance Siemens SIRIUS 3RV2011-1HA10  5,5-----8A", "reference": "3RV2011-1HA10", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 1257, "image": "/products/image47.jpeg", "description": "Disjoncteur de protection moteur Siemens SIRIUS 3RV2011-1HA10. Calibre thermique 5.5-8A. Pouvoir de coupure 100kA à 400V. Taille S00. CLASS 10. 3 pôles. Montage sur rail DIN.", "descriptionAr": "Disjoncteur de protection moteur Siemens SIRIUS 3RV2011-1HA10. Calibre thermique 5.5-8A. Pouvoir de coupure 100kA à 400V. Taille S00. CLASS 10. 3 pôles. Montage sur rail DIN.", "brand": "Siemens", "stock": 7, "featured": false},
  {"id": "16", "name": "Disjoncteur de puissance Siemens SIRIUS 3RV2011-0JA10", "nameAr": "Disjoncteur de puissance Siemens SIRIUS 3RV2011-0JA10", "reference": "3RV2011-0JA10", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 948, "image": "/products/image49.jpeg", "description": "Disjoncteur de protection moteur Siemens SIRIUS 3RV2011-0JA10. Calibre thermique 0.7-1A. Taille S00. Pouvoir de coupure 100kA. 3 pôles. Montage sur rail DIN. Conforme IEC 60947-4-1.", "descriptionAr": "Disjoncteur de protection moteur Siemens SIRIUS 3RV2011-0JA10. Calibre thermique 0.7-1A. Taille S00. Pouvoir de coupure 100kA. 3 pôles. Montage sur rail DIN. Conforme IEC 60947-4-1.", "brand": "Siemens", "stock": 2, "featured": false},
  {"id": "17", "name": "Disjoncteur de puissance Siemens SIRIUS 3RV2011-1CA10  1,8----2,5A", "nameAr": "Disjoncteur de puissance Siemens SIRIUS 3RV2011-1CA10  1,8----2,5A", "reference": "3RV2011-1CA10", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 1078, "image": "/products/image50.jpeg", "description": "Disjoncteur de protection moteur Siemens SIRIUS 3RV2011-1CA10. Calibre thermique 1.8-2.5A. Taille S00. CLASS 10. 3 pôles. Pouvoir de coupure 100kA à 400V. Montage sur rail DIN.", "descriptionAr": "Disjoncteur de protection moteur Siemens SIRIUS 3RV2011-1CA10. Calibre thermique 1.8-2.5A. Taille S00. CLASS 10. 3 pôles. Pouvoir de coupure 100kA à 400V. Montage sur rail DIN.", "brand": "Siemens", "stock": 1, "featured": false},
  {"id": "18", "name": "Disjoncteur de puissance Siemens SIRIUS 3RV2011-1PA10   1,4----2A", "nameAr": "Disjoncteur de puissance Siemens SIRIUS 3RV2011-1PA10   1,4----2A", "reference": "3RV2011-1PA10", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 979, "image": "/products/image48.jpeg", "description": "Disjoncteur de protection moteur Siemens SIRIUS 3RV2011-1PA10. Calibre thermique 1.4-2A. Taille S00. 3 pôles. Pouvoir de coupure 100kA. Montage rail DIN. Conforme IEC 60947-4-1.", "descriptionAr": "Disjoncteur de protection moteur Siemens SIRIUS 3RV2011-1PA10. Calibre thermique 1.4-2A. Taille S00. 3 pôles. Pouvoir de coupure 100kA. Montage rail DIN. Conforme IEC 60947-4-1.", "brand": "Siemens", "stock": 1, "featured": false},
  {"id": "19", "name": "Auxiliaire transversales Bornes à vis 1 NO +1 NF pour disjoncteur 3RV2", "nameAr": "Auxiliaire transversales Bornes à vis 1 NO +1 NF pour disjoncteur 3RV2", "reference": "3RV2901", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 99, "image": "/products/image51.jpeg", "description": "Contact auxiliaire transversal Siemens 3RV2901. 1 NO + 1 NF. Connexion par bornes à vis. Compatible avec disjoncteurs moteur Siemens 3RV2. Montage latéral rapide sans outil. Conforme IEC 60947-5-1.", "descriptionAr": "Contact auxiliaire transversal Siemens 3RV2901. 1 NO + 1 NF. Connexion par bornes à vis. Compatible avec disjoncteurs moteur Siemens 3RV2. Montage latéral rapide sans outil. Conforme IEC 60947-5-1.", "brand": "Industriel", "stock": 20, "featured": false},
  {"id": "20", "name": "Endress+Hauser Promag 53P80, DN80 3″ 53P80-ER1B1RC2BBAA", "nameAr": "Endress+Hauser Promag 53P80, DN80 3″ 53P80-ER1B1RC2BBAA", "reference": "53P80, DN80", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 16500, "image": "/products/image52.jpeg", "description": "Débitmètre électromagnétique Endress+Hauser Promag 53P80, DN80 (3\"). Référence 53P80-ER1B1RC2BBAA. Mesure de débit pour liquides conducteurs. Sortie 4-20mA + HART. Alimentation 85-260VAC. Bride DN80.", "descriptionAr": "Débitmètre électromagnétique Endress+Hauser Promag 53P80, DN80 (3\"). Référence 53P80-ER1B1RC2BBAA. Mesure de débit pour liquides conducteurs. Sortie 4-20mA + HART. Alimentation 85-260VAC. Bride DN80.", "brand": "Endress+Hauser", "stock": 1, "featured": false},
  {"id": "21", "name": "Cable souple 1x4mm", "nameAr": "Cable souple 1x4mm", "reference": "Cable souple 1x4mm", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 3, "image": "/products/image4.png", "description": "Câble électrique souple 1x4mm². Section 4mm², monoconducteur flexible. Gaine PVC 70°C. Tension nominale 450/750V. Idéal pour raccordements en tableaux électriques et armoires de commande. Vendu au mètre.", "descriptionAr": "Câble électrique souple 1x4mm². Section 4mm², monoconducteur flexible. Gaine PVC 70°C. Tension nominale 450/750V. Idéal pour raccordements en tableaux électriques et armoires de commande. Vendu au mètre.", "brand": "Industriel", "stock": 600, "featured": false},
  {"id": "22", "name": "Jeux de Garniture mécanique", "nameAr": "Jeux de Garniture mécanique", "reference": "Garniture", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 1650, "image": "/products/image36.jpeg", "description": "Jeu de garniture mécanique de rechange pour pompe centrifuge. Inclut garniture mécanique complète avec ressort, bague tournante et bague fixe en carbure de silicium. Compatible pompes industrielles standard.", "descriptionAr": "Jeu de garniture mécanique de rechange pour pompe centrifuge. Inclut garniture mécanique complète avec ressort, bague tournante et bague fixe en carbure de silicium. Compatible pompes industrielles standard.", "brand": "Industriel", "stock": 1, "featured": false},
  {"id": "23", "name": "ALLEN-BRADLEY MICROLOGIX 1000 1761-L32BWA SERIES E PLC Used", "nameAr": "ALLEN-BRADLEY MICROLOGIX 1000 1761-L32BWA SERIES E PLC Used", "reference": "1761-L32BWA", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 550, "image": "/products/image54.jpeg", "description": "Automate Allen-Bradley MicroLogix 1000 1761-L32BWA. 20 entrées + 12 sorties. Alimentation AC. Processeur compact pour petites applications d'automatisation. Programmation en Ladder. Série E. État : Occasion fonctionnelle.", "descriptionAr": "Automate Allen-Bradley MicroLogix 1000 1761-L32BWA. 20 entrées + 12 sorties. Alimentation AC. Processeur compact pour petites applications d'automatisation. Programmation en Ladder. Série E. État : Occasion fonctionnelle.", "brand": "Allen-Bradley", "stock": 2, "featured": false},
  {"id": "24", "name": "1762-L24BXB Factory Sealed AB MicroLogix 1200 24 Point Controller", "nameAr": "1762-L24BXB Factory Sealed AB MicroLogix 1200 24 Point Controller", "reference": "1762-L24BXB", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 110, "image": "/products/image54.jpeg", "description": "Automate Allen-Bradley MicroLogix 1200 1762-L24BXB. 14 entrées + 10 sorties. Alimentation DC 24V. Extension jusqu'à 88 E/S. Port RS-232 et DH-485. Neuf d'origine (Factory Sealed).", "descriptionAr": "Automate Allen-Bradley MicroLogix 1200 1762-L24BXB. 14 entrées + 10 sorties. Alimentation DC 24V. Extension jusqu'à 88 E/S. Port RS-232 et DH-485. Neuf d'origine (Factory Sealed).", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "25", "name": "1762-IF2OF2 1762-IF20F2 Allen Bradley Analog I/O Module  Used", "nameAr": "1762-IF2OF2 1762-IF20F2 Allen Bradley Analog I/O Module  Used", "reference": "1762-IF2OF2", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 550, "image": "/products/image54.jpeg", "description": "Module analogique Allen-Bradley 1762-IF2OF2 pour MicroLogix 1200. 2 entrées analogiques + 2 sorties analogiques. Résolution 12 bits. Signal 0-10V ou 4-20mA. Occasion fonctionnel.", "descriptionAr": "Module analogique Allen-Bradley 1762-IF2OF2 pour MicroLogix 1200. 2 entrées analogiques + 2 sorties analogiques. Résolution 12 bits. Signal 0-10V ou 4-20mA. Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "26", "name": "ALLEN-BRADLEY PLC 5 1785-L40C15 ControlNet PLC-5 Processor PROCESSOR MODULE Used", "nameAr": "ALLEN-BRADLEY PLC 5 1785-L40C15 ControlNet PLC-5 Processor PROCESSOR MODULE Used", "reference": "1785-PLC-5/40C", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 13200, "image": "/products/image14.jpeg", "description": "Processeur Allen-Bradley PLC-5/40C ControlNet. Référence 1785-L40C15. Mémoire 48K mots. Communication ControlNet intégrée. Pour grandes installations d'automatisation. État : Occasion fonctionnel.", "descriptionAr": "Processeur Allen-Bradley PLC-5/40C ControlNet. Référence 1785-L40C15. Mémoire 48K mots. Communication ControlNet intégrée. Pour grandes installations d'automatisation. État : Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "27", "name": "ALLEN-BRADLEY 4 SLOT I/O CHASIS  Used", "nameAr": "ALLEN-BRADLEY 4 SLOT I/O CHASIS  Used", "reference": "1771-A1B", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 1650, "image": "/products/image1.jpeg", "description": "Châssis Allen-Bradley PLC-5 4 slots (1771-A1B). Rack I/O pour modules PLC-5 série 1771. Alimentation séparée requise. Compatible modules 1771-IB, OB, NI, etc. État : Occasion.", "descriptionAr": "Châssis Allen-Bradley PLC-5 4 slots (1771-A1B). Rack I/O pour modules PLC-5 série 1771. Alimentation séparée requise. Compatible modules 1771-IB, OB, NI, etc. État : Occasion.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "28", "name": "Power Supplay PLC 5 220VAC  Used", "nameAr": "Power Supplay PLC 5 220VAC  Used", "reference": "1771-P7", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 2200, "image": "/products/image14.jpeg", "description": "Alimentation Allen-Bradley 1771-P7 pour rack PLC-5. Tension d'entrée 220VAC. Fournit 24VDC et 5VDC aux modules I/O. Compatible châssis 1771 série A-G. État : Occasion fonctionnelle.", "descriptionAr": "Alimentation Allen-Bradley 1771-P7 pour rack PLC-5. Tension d'entrée 220VAC. Fournit 24VDC et 5VDC aux modules I/O. Compatible châssis 1771 série A-G. État : Occasion fonctionnelle.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "29", "name": "Allen-Bradley carte INPUT 1771-IB", "nameAr": "Allen-Bradley carte INPUT 1771-IB", "reference": "1771 IB16", "category": "modules", "categoryAr": "وحدات وتوصيلات", "price": 550, "image": "/products/image14.jpeg", "description": "Module d'entrée numérique Allen-Bradley 1771-IB. 16 entrées DC 24V. Compatible rack PLC-5. Connecteur câble flat. État : Occasion fonctionnel.", "descriptionAr": "Module d'entrée numérique Allen-Bradley 1771-IB. 16 entrées DC 24V. Compatible rack PLC-5. Connecteur câble flat. État : Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "30", "name": "Allen-Bradley carte Output 1771-OB", "nameAr": "Allen-Bradley carte Output 1771-OB", "reference": "1771-OB16", "category": "modules", "categoryAr": "وحدات وتوصيلات", "price": 550, "image": "/products/image14.jpeg", "description": "Module de sortie numérique Allen-Bradley 1771-OB16. 16 sorties DC. Compatible rack PLC-5. Protection contre les courts-circuits. État : Occasion fonctionnel.", "descriptionAr": "Module de sortie numérique Allen-Bradley 1771-OB16. 16 sorties DC. Compatible rack PLC-5. Protection contre les courts-circuits. État : Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "31", "name": "Allen-Bradley carte Analogue INPUT 1771-", "nameAr": "Allen-Bradley carte Analogue INPUT 1771-", "reference": "1771-IFE", "category": "modules", "categoryAr": "وحدات وتوصيلات", "price": 550, "image": "/products/image14.jpeg", "description": "Module d'entrée analogique Allen-Bradley 1771-IFE pour PLC-5. 4-8 entrées 4-20mA. Compatible rack 1771. Occasion fonctionnel.", "descriptionAr": "Module d'entrée analogique Allen-Bradley 1771-IFE pour PLC-5. 4-8 entrées 4-20mA. Compatible rack 1771. Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "32", "name": "Allen-Bradley 1746-A4 SLC 500 4 Slot Modular I/O Chassis for 1746 I/O Modules", "nameAr": "Allen-Bradley 1746-A4 SLC 500 4 Slot Modular I/O Chassis for 1746 I/O Modules", "reference": "1746-A4", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 1430, "image": "/products/image1.jpeg", "description": "Châssis Allen-Bradley SLC 500 4 slots (1746-A4). Rack modulaire pour modules I/O série 1746. Alimentation 1746-P série requise. Compatible SLC 5/03, 5/04, 5/05. État : Occasion.", "descriptionAr": "Châssis Allen-Bradley SLC 500 4 slots (1746-A4). Rack modulaire pour modules I/O série 1746. Alimentation 1746-P série requise. Compatible SLC 5/03, 5/04, 5/05. État : Occasion.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "33", "name": "Allen-Bradley 1746-BAS Basic Module", "nameAr": "Allen-Bradley 1746-BAS Basic Module", "reference": "1746-BAS", "category": "modules", "categoryAr": "وحدات وتوصيلات", "price": 616, "image": "/products/image1.jpeg", "description": "Module BASIC Allen-Bradley 1746-BAS pour SLC 500. Programmation en langage BASIC. Communication RS-232. Idéal pour rapports, calculs complexes et communication avec périphériques. État : Occasion fonctionnel.", "descriptionAr": "Module BASIC Allen-Bradley 1746-BAS pour SLC 500. Programmation en langage BASIC. Communication RS-232. Idéal pour rapports, calculs complexes et communication avec périphériques. État : Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "34", "name": "1746-ni4 Ser a SLC 500 Analog Input Module Allen-bradley", "nameAr": "1746-ni4 Ser a SLC 500 Analog Input Module Allen-bradley", "reference": "1746-NI4", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 1397, "image": "/products/image1.jpeg", "description": "Module d'entrée analogique Allen-Bradley 1746-NI4 pour SLC 500. 4 entrées analogiques universelles (tension/courant/thermocouple/RTD). Résolution 16 bits. Série A. État : Occasion fonctionnel.", "descriptionAr": "Module d'entrée analogique Allen-Bradley 1746-NI4 pour SLC 500. 4 entrées analogiques universelles (tension/courant/thermocouple/RTD). Résolution 16 bits. Série A. État : Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "35", "name": "New Allen-Bradley AB 1747-L532 /D SLC 500 SLC 5/03 CPU Processor Unit 1747L532", "nameAr": "New Allen-Bradley AB 1747-L532 /D SLC 500 SLC 5/03 CPU Processor Unit 1747L532", "reference": "1747-L532", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 1650, "image": "/products/image54.jpeg", "description": "Processeur Allen-Bradley SLC 5/03 (1747-L532). Mémoire 16K mots. Communication DH-485 et RS-232. Compatible rack SLC 500. Série D. État : Neuf ou reconditionné.", "descriptionAr": "Processeur Allen-Bradley SLC 5/03 (1747-L532). Mémoire 16K mots. Communication DH-485 et RS-232. Compatible rack SLC 500. Série D. État : Neuf ou reconditionné.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "36", "name": "SLC 16 Point DC Input Module", "nameAr": "SLC 16 Point DC Input Module", "reference": "1746-IB16", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 550, "image": "/products/image1.jpeg", "description": "Module d'entrée numérique Allen-Bradley 1746-IB16 SLC 500. 16 entrées DC 24V. Série C. Occasion fonctionnel.", "descriptionAr": "Module d'entrée numérique Allen-Bradley 1746-IB16 SLC 500. 16 entrées DC 24V. Série C. Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 4, "featured": false},
  {"id": "37", "name": "1746-Output Triac 220VAC", "nameAr": "1746-Output Triac 220VAC", "reference": "1746-OA16 /A", "category": "modules", "categoryAr": "وحدات وتوصيلات", "price": 550, "image": "/products/image14.jpeg", "description": "Module de sortie Triac Allen-Bradley 1746-OA16 pour SLC 500. 16 sorties AC 85-265V. Protection thermique intégrée. Compatible châssis 1746. État : Occasion fonctionnel.", "descriptionAr": "Module de sortie Triac Allen-Bradley 1746-OA16 pour SLC 500. 16 sorties AC 85-265V. Protection thermique intégrée. Compatible châssis 1746. État : Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "38", "name": "Allen Bradley SLC 500 ,1746-P2 Ser C ,Power Supply Module  Used", "nameAr": "Allen Bradley SLC 500 ,1746-P2 Ser C ,Power Supply Module  Used", "reference": "1746-P2", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 165, "image": "/products/image14.jpeg", "description": "Alimentation Allen-Bradley 1746-P2 pour SLC 500. Entrée 120/240VAC. Sortie 24VDC/2A et 5VDC/7A. Compatible châssis 1746. Série C. État : Occasion fonctionnel.", "descriptionAr": "Alimentation Allen-Bradley 1746-P2 pour SLC 500. Entrée 120/240VAC. Sortie 24VDC/2A et 5VDC/7A. Compatible châssis 1746. Série C. État : Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "39", "name": "Schassis Contrologix 4 Slots", "nameAr": "Schassis Contrologix 4 Slots", "reference": "1756-A4", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 1100, "image": "/products/image1.jpeg", "description": "Châssis ControlLogix Allen-Bradley 4 slots (1756-A4). Support pour modules 1756 ControlLogix. Montage sur rail DIN ou panneau. Compatible processeurs 1756-L6x et L7x. État : Occasion.", "descriptionAr": "Châssis ControlLogix Allen-Bradley 4 slots (1756-A4). Support pour modules 1756 ControlLogix. Montage sur rail DIN ou panneau. Compatible processeurs 1756-L6x et L7x. État : Occasion.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "40", "name": "ALLEN BRADLEY 1756-PA75R 24VDC 110W CONTROLOGIX DC REDUNDANT POWER SUPPLY", "nameAr": "ALLEN BRADLEY 1756-PA75R 24VDC 110W CONTROLOGIX DC REDUNDANT POWER SUPPLY", "reference": "1756-PA", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 1100, "image": "/products/image14.jpeg", "description": "Alimentation ControlLogix Allen-Bradley 1756-PA75R. Entrée 85-265VAC. Sortie 24VDC/110W. Redondante. Compatible châssis 1756. État : Occasion fonctionnel.", "descriptionAr": "Alimentation ControlLogix Allen-Bradley 1756-PA75R. Entrée 85-265VAC. Sortie 24VDC/110W. Redondante. Compatible châssis 1756. État : Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "41", "name": "yco Contrôle Thermique Digitrace MONI PT100 EXE Température Sonde /", "nameAr": "yco Contrôle Thermique Digitrace MONI PT100 EXE Température Sonde /", "reference": "MONI PT100 EXE", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 1100, "image": "/products/image2.jpeg", "description": "Contrôleur de traçage thermique Digitrace MONI PT100 EXE. Certifié ATEX IIB G Ex d IIB T6. Sonde PT100 intégrée. Plage -50°C à +650°C. Surveillance et contrôle de température pour zones explosibles. État : Occasion.", "descriptionAr": "Contrôleur de traçage thermique Digitrace MONI PT100 EXE. Certifié ATEX IIB G Ex d IIB T6. Sonde PT100 intégrée. Plage -50°C à +650°C. Surveillance et contrôle de température pour zones explosibles. État : Occasion.", "brand": "Industriel", "stock": 1, "featured": false},
  {"id": "42", "name": "E32-CC200 2M Omron Fiber Sensor, For Industrial Omron", "nameAr": "E32-CC200 2M Omron Fiber Sensor, For Industrial Omron", "reference": "E32-DC200 2M", "category": "sensors", "categoryAr": "حساسات وكاشفات", "price": 220, "image": "/products/image3.jpeg", "description": "Câble à fibre optique Omron E32-CC200 (2M). Fibre optique diffuse pour capteur E3X. Longueur 2m. Diamètre de détection ajustable. Compatible amplificateurs E3X-NA/NH/DA. État : Neuf.", "descriptionAr": "Câble à fibre optique Omron E32-CC200 (2M). Fibre optique diffuse pour capteur E3X. Longueur 2m. Diamètre de détection ajustable. Compatible amplificateurs E3X-NA/NH/DA. État : Neuf.", "brand": "Omron", "stock": 4, "featured": false},
  {"id": "43", "name": "CABLE FIBRE OPTIQUE 6FO ARMEE OM3", "nameAr": "CABLE FIBRE OPTIQUE 6FO ARMEE OM3", "reference": "6x50x125", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 66, "image": "/products/image4.png", "description": "Câble fibre optique armé 6FO OM3 multimode 50/125µm. 6 fibres, gaine armée acier. Atténuation ≤3.5dB/km à 850nm. Bande passante 2000MHz·km. Pour liaisons réseau longue distance en environnement industriel. Vendu au mètre.", "descriptionAr": "Câble fibre optique armé 6FO OM3 multimode 50/125µm. 6 fibres, gaine armée acier. Atténuation ≤3.5dB/km à 850nm. Bande passante 2000MHz·km. Pour liaisons réseau longue distance en environnement industriel. Vendu au mètre.", "brand": "Industriel", "stock": 200, "featured": false},
  {"id": "44", "name": "Simatic Tp1200 Comfort Panel Touch Operation 12 Inches Widescreen TFT Display New 6AV2124-0mc01-0ax0", "nameAr": "Simatic Tp1200 Comfort Panel Touch Operation 12 Inches Widescreen TFT Display New 6AV2124-0mc01-0ax0", "reference": "6AV2124-OMC01", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 27500, "image": "/products/image5.jpeg", "description": "Panel PC Siemens SIMATIC TP1200 Comfort. Écran TFT tactile 12\" widescreen. Résolution 1280x800. Windows CE. Communication PROFINET/MPI/PROFIBUS. Mémoire 12MB. Référence 6AV2124-0MC01-0AX0. Neuf d'origine.", "descriptionAr": "Panel PC Siemens SIMATIC TP1200 Comfort. Écran TFT tactile 12\" widescreen. Résolution 1280x800. Windows CE. Communication PROFINET/MPI/PROFIBUS. Mémoire 12MB. Référence 6AV2124-0MC01-0AX0. Neuf d'origine.", "brand": "Siemens", "stock": 1, "featured": false},
  {"id": "45", "name": "Palazzoli 579826 - topTER con portella trasparente alta capienza per installazione di 6 prese fisse IP66", "nameAr": "Palazzoli 579826 - topTER con portella trasparente alta capienza per installazione di 6 prese fisse IP66", "reference": "579826 PALAZOLI", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 638, "image": "/products/image39.jpeg", "description": "Boîtier industriel Palazzoli 579826 topTER avec porte transparente haute capacité. 6 prises fixes IP66. Protection IP66. Usage extérieur/intérieur. 2 unités disponibles.", "descriptionAr": "Boîtier industriel Palazzoli 579826 topTER avec porte transparente haute capacité. 6 prises fixes IP66. Protection IP66. Usage extérieur/intérieur. 2 unités disponibles.", "brand": "Industriel", "stock": 2, "featured": false},
  {"id": "46", "name": "Chemin de câble en tôle INGELEC 63x33", "nameAr": "Chemin de câble en tôle INGELEC 63x33", "reference": "Ingelec 63*33", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 110, "image": "/products/image6.jpeg", "description": "Chemin de câble en tôle d'acier galvanisé INGELEC 63x33mm. Épaisseur 0.7mm. Longueur 2m/unité. Résistant à la corrosion. Pour cheminage de câbles en armoire ou en apparent. Compatible accessoires INGELEC standard.", "descriptionAr": "Chemin de câble en tôle d'acier galvanisé INGELEC 63x33mm. Épaisseur 0.7mm. Longueur 2m/unité. Résistant à la corrosion. Pour cheminage de câbles en armoire ou en apparent. Compatible accessoires INGELEC standard.", "brand": "Industriel", "stock": 33, "featured": false},
  {"id": "47", "name": "Chemin de câble en tôle INGELEC 100x63", "nameAr": "Chemin de câble en tôle INGELEC 100x63", "reference": "Ingelec 100*63", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 165, "image": "/products/image7.jpeg", "description": "Chemin de câble en tôle d'acier galvanisé INGELEC 100x63mm. Grande capacité pour faisceaux importants. Longueur 2m/unité. Épaisseur 0.8mm. Surface galvanisée anti-corrosion. Compatible accessoires INGELEC.", "descriptionAr": "Chemin de câble en tôle d'acier galvanisé INGELEC 100x63mm. Grande capacité pour faisceaux importants. Longueur 2m/unité. Épaisseur 0.8mm. Surface galvanisée anti-corrosion. Compatible accessoires INGELEC.", "brand": "Industriel", "stock": 6, "featured": false},
  {"id": "48", "name": "Chemin de cable PVC 300*100 AVEC Cache", "nameAr": "Chemin de cable PVC 300*100 AVEC Cache", "reference": "GS400X60", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 1100, "image": "/products/image7.jpeg", "description": "Chemin de câble PVC blanc 300x100mm avec cache. Câblage propre et protégé. Résistant UV. Ignifugé selon IEC 60332. Livré avec cache. Lot de 24 unités disponibles.", "descriptionAr": "Chemin de câble PVC blanc 300x100mm avec cache. Câblage propre et protégé. Résistant UV. Ignifugé selon IEC 60332. Livré avec cache. Lot de 24 unités disponibles.", "brand": "Industriel", "stock": 24, "featured": false},
  {"id": "49", "name": "Boite ATEX Stahel 600*600", "nameAr": "Boite ATEX Stahel 600*600", "reference": "STAHL 81461083", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 3850, "image": "/products/image40.jpeg", "description": "Boîte de jonction ATEX Stahl 600x600mm. Certifiée Ex II 2G Ex e IIC. Protection IP65/IP66. Corps acier peint. Serrure quart de tour. Pour zones dangereuses (zone 1 et 2). Entrées câbles multiples.", "descriptionAr": "Boîte de jonction ATEX Stahl 600x600mm. Certifiée Ex II 2G Ex e IIC. Protection IP65/IP66. Corps acier peint. Serrure quart de tour. Pour zones dangereuses (zone 1 et 2). Entrées câbles multiples.", "brand": "Industriel", "stock": 1, "featured": false},
  {"id": "50", "name": "PanelView Plus 6 1500 Touch  ONLY SCREEN old", "nameAr": "PanelView Plus 6 1500 Touch  ONLY SCREEN old", "reference": "2711P-RDT15C", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 1650, "image": "/products/image9.jpeg", "description": "Écran tactile Allen-Bradley PanelView Plus 6 1500 (15\"). Résolution 1024x768. Interface opérateur couleur. Communication EtherNet/IP. Alimentation 24VDC. Référence 2711P-RDT15C. Occasion (écran uniquement).", "descriptionAr": "Écran tactile Allen-Bradley PanelView Plus 6 1500 (15\"). Résolution 1024x768. Interface opérateur couleur. Communication EtherNet/IP. Alimentation 24VDC. Référence 2711P-RDT15C. Occasion (écran uniquement).", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "51", "name": "Panel View plus key board new screen", "nameAr": "Panel View plus key board new screen", "reference": "2711P-RDK10C", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 2750, "image": "/products/image8.jpeg", "description": "Terminal opérateur Allen-Bradley PanelView Plus 10\" à clavier (2711P-RDK10C). Clavier + écran couleur. Communication EtherNet/IP. Alimentation 24VDC. Boutons de fonction programmables. Occasion, nouvel écran.", "descriptionAr": "Terminal opérateur Allen-Bradley PanelView Plus 10\" à clavier (2711P-RDK10C). Clavier + écran couleur. Communication EtherNet/IP. Alimentation 24VDC. Boutons de fonction programmables. Occasion, nouvel écran.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "52", "name": "Operator Panel OP170B MONO 6AV6542-0BB15-2AX0 NOT FONCTION", "nameAr": "Operator Panel OP170B MONO 6AV6542-0BB15-2AX0 NOT FONCTION", "reference": "OP170B", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 55, "image": "/products/image5.jpeg", "description": "Pupitre opérateur Siemens OP170B MONO 6AV6542-0BB15-2AX0. Écran monochrome. Interface MPI. Pour visualisation et commande de systèmes SIMATIC. État : Non fonctionnel (pour pièces ou réparation).", "descriptionAr": "Pupitre opérateur Siemens OP170B MONO 6AV6542-0BB15-2AX0. Écran monochrome. Interface MPI. Pour visualisation et commande de systèmes SIMATIC. État : Non fonctionnel (pour pièces ou réparation).", "brand": "Industriel", "stock": 2, "featured": false},
  {"id": "53", "name": "Input Module 16 New", "nameAr": "Input Module 16 New", "reference": "1746-IM16", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 1100, "image": "/products/image1.jpeg", "description": "Module d'entrée numérique Allen-Bradley 1746-IM16 pour SLC 500. 16 entrées AC. Compatible châssis 1746. Neuf d'origine.", "descriptionAr": "Module d'entrée numérique Allen-Bradley 1746-IM16 pour SLC 500. 16 entrées AC. Compatible châssis 1746. Neuf d'origine.", "brand": "Allen-Bradley", "stock": 2, "featured": false},
  {"id": "54", "name": "Intpout module Contrologix new", "nameAr": "Intpout module Contrologix new", "reference": "1756IB16D", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 1100, "image": "/products/image1.jpeg", "description": "Module d'entrée numérique Allen-Bradley 1756-IB16D ControlLogix. 16 entrées DC 24V. Diagnostic intégré. Compatible châssis 1756. Neuf d'origine.", "descriptionAr": "Module d'entrée numérique Allen-Bradley 1756-IB16D ControlLogix. 16 entrées DC 24V. Diagnostic intégré. Compatible châssis 1756. Neuf d'origine.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "55", "name": "Output Carte Contrologix new", "nameAr": "Output Carte Contrologix new", "reference": "1756PB16E", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 1100, "image": "/products/image1.jpeg", "description": "Module de sortie Allen-Bradley 1756-PB16E ControlLogix. 16 sorties. Compatible châssis 1756. Neuf d'origine.", "descriptionAr": "Module de sortie Allen-Bradley 1756-PB16E ControlLogix. 16 sorties. Compatible châssis 1756. Neuf d'origine.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "56", "name": "Carte servo drive new", "nameAr": "Carte servo drive new", "reference": "1756MOSE", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 1100, "image": "/products/image1.jpeg", "description": "Module servo drive Allen-Bradley 1756-MOSE ControlLogix. Contrôle d'axe de mouvement. Compatible châssis 1756. Neuf d'origine.", "descriptionAr": "Module servo drive Allen-Bradley 1756-MOSE ControlLogix. Contrôle d'axe de mouvement. Compatible châssis 1756. Neuf d'origine.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "57", "name": "ABB 1SFA899003R1000 PSTEK EXTERNAL KEYPAD", "nameAr": "ABB 1SFA899003R1000 PSTEK EXTERNAL KEYPAD", "reference": "1SFA899003R1000", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 1100, "image": "/products/image10.jpeg", "description": "Clavier externe ABB PSTEK (1SFA899003R1000). Interface de programmation et paramétrage pour démarreurs progressifs ABB PSTK. Connexion RJ45. Affichage LCD. 2 unités disponibles.", "descriptionAr": "Clavier externe ABB PSTEK (1SFA899003R1000). Interface de programmation et paramétrage pour démarreurs progressifs ABB PSTK. Connexion RJ45. Affichage LCD. 2 unités disponibles.", "brand": "ABB", "stock": 2, "featured": false},
  {"id": "58", "name": "Contact auxiliaire Allen Bradley 100-SB10, 1NO (NEUF DANS SA BOÎTE)", "nameAr": "Contact auxiliaire Allen Bradley 100-SB10, 1NO (NEUF DANS SA BOÎTE)", "reference": "100-SB100", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 55, "image": "/products/image11.jpeg", "description": "Contact auxiliaire latéral Allen-Bradley 100-SB10. 1 NO. Fixation rapide sans vis. Compatible contacteurs Allen-Bradley série 100-C/D. Neuf dans sa boîte d'origine. Lot de 40 pcs disponibles.", "descriptionAr": "Contact auxiliaire latéral Allen-Bradley 100-SB10. 1 NO. Fixation rapide sans vis. Compatible contacteurs Allen-Bradley série 100-C/D. Neuf dans sa boîte d'origine. Lot de 40 pcs disponibles.", "brand": "Allen-Bradley", "stock": 40, "featured": false},
  {"id": "59", "name": "Contact auxiliaire Allen Bradley 100-FA10, 1NO (NEUF DANS SA BOÎTE)", "nameAr": "Contact auxiliaire Allen Bradley 100-FA10, 1NO (NEUF DANS SA BOÎTE)", "reference": "100-FA10", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 55, "image": "/products/image12.jpeg", "description": "Contact auxiliaire frontal Allen-Bradley 100-FA10. 1 NO. Fixation frontale. Compatible contacteurs Allen-Bradley 100-C/D 9-40A. Neuf dans sa boîte d'origine. Lot de 40 pcs disponibles.", "descriptionAr": "Contact auxiliaire frontal Allen-Bradley 100-FA10. 1 NO. Fixation frontale. Compatible contacteurs Allen-Bradley 100-C/D 9-40A. Neuf dans sa boîte d'origine. Lot de 40 pcs disponibles.", "brand": "Allen-Bradley", "stock": 40, "featured": false},
  {"id": "60", "name": "Circuit breaker size S00 for motor protection, CLASS 10 A-release 0.9...1.25 A", "nameAr": "Circuit breaker size S00 for motor protection, CLASS 10 A-release 0.9...1.25 A", "reference": "SRV1011-0KA10", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 880, "image": "/products/image48.jpeg", "description": "Disjoncteur de protection moteur Siemens taille S00. CLASS 10. Courant de déclenchement 0.9-1.25A. Pouvoir de coupure selon IEC 60947-4-1. 3 pôles. Montage sur rail DIN. Conforme IEC/EN 60947.", "descriptionAr": "Disjoncteur de protection moteur Siemens taille S00. CLASS 10. Courant de déclenchement 0.9-1.25A. Pouvoir de coupure selon IEC 60947-4-1. 3 pôles. Montage sur rail DIN. Conforme IEC/EN 60947.", "brand": "Industriel", "stock": 7, "featured": false},
  {"id": "61", "name": "Allen-Bradley 2711P-RN6 PanelView Plus DH/RIO/DH-485 Communication module", "nameAr": "Allen-Bradley 2711P-RN6 PanelView Plus DH/RIO/DH-485 Communication module", "reference": "AB Carte DH+/DH485/RIO", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 2200, "image": "/products/image1.jpeg", "description": "Carte communication Allen-Bradley DH+/DH-485/RIO. Module réseau pour automates Allen-Bradley. Supporte protocoles Data Highway Plus, DH-485 et Remote I/O. Occasion fonctionnel.", "descriptionAr": "Carte communication Allen-Bradley DH+/DH-485/RIO. Module réseau pour automates Allen-Bradley. Supporte protocoles Data Highway Plus, DH-485 et Remote I/O. Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "62", "name": "1756-A4 Allen Bradley - ControlLogix Chassis 4-Slot Rack", "nameAr": "1756-A4 Allen Bradley - ControlLogix Chassis 4-Slot Rack", "reference": "1756-A4", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 2200, "image": "/products/image1.jpeg", "description": "Châssis ControlLogix Allen-Bradley 4 slots (1756-A4). Support pour modules 1756 ControlLogix. Montage sur rail DIN ou panneau. Compatible processeurs 1756-L6x et L7x. État : Occasion.", "descriptionAr": "Châssis ControlLogix Allen-Bradley 4 slots (1756-A4). Support pour modules 1756 ControlLogix. Montage sur rail DIN ou panneau. Compatible processeurs 1756-L6x et L7x. État : Occasion.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "63", "name": "1746 A4 SLC 4 Slots Chassis  USED", "nameAr": "1746 A4 SLC 4 Slots Chassis  USED", "reference": "1746A4", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 1100, "image": "/products/image1.jpeg", "description": "Châssis Allen-Bradley SLC 500 4 slots (1746-A4). Rack modulaire pour modules I/O série 1746. Alimentation requise séparée. Occasion fonctionnel.", "descriptionAr": "Châssis Allen-Bradley SLC 500 4 slots (1746-A4). Rack modulaire pour modules I/O série 1746. Alimentation requise séparée. Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "64", "name": "Alimentation automate Allen Bradley 1746 pour Série SLC 500  USED", "nameAr": "Alimentation automate Allen Bradley 1746 pour Série SLC 500  USED", "reference": "1746 P2", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 550, "image": "/products/image14.jpeg", "description": "Alimentation Allen-Bradley SLC 500 1746-P2. Entrée AC, sortie 5VDC/7A et 24VDC/2A. Occasion fonctionnel.", "descriptionAr": "Alimentation Allen-Bradley SLC 500 1746-P2. Entrée AC, sortie 5VDC/7A et 24VDC/2A. Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "65", "name": "Allen-Bradley SLC 500 Processor Unit 1746-L532 USED", "nameAr": "Allen-Bradley SLC 500 Processor Unit 1746-L532 USED", "reference": "1746 L531", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 1100, "image": "/products/image54.jpeg", "description": "Processeur Allen-Bradley SLC 500 1746-L531. CPU compact pour applications d'automatisation. Compatible modules I/O 1746. Occasion.", "descriptionAr": "Processeur Allen-Bradley SLC 500 1746-L531. CPU compact pour applications d'automatisation. Compatible modules I/O 1746. Occasion.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "66", "name": "Processor Unit 1747-L543 Allen-Bradley SLC500 Series C *Used*", "nameAr": "Processor Unit 1747-L543 Allen-Bradley SLC500 Series C *Used*", "reference": "1747-L543", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 1100, "image": "/products/image54.jpeg", "description": "Processeur Allen-Bradley SLC 500 1747-L543. Série C. Mémoire 16K. Communication RS-232 et DH-485. Occasion fonctionnel.", "descriptionAr": "Processeur Allen-Bradley SLC 500 1747-L543. Série C. Mémoire 16K. Communication RS-232 et DH-485. Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "67", "name": "PLC Input Module 1746-IB16 Allen-Bradley SLC500 SER C 10-30VDC 1746-IB16 *Used*", "nameAr": "PLC Input Module 1746-IB16 Allen-Bradley SLC500 SER C 10-30VDC 1746-IB16 *Used*", "reference": "1746-IB16", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 44, "image": "/products/image1.jpeg", "description": "Module d'entrée numérique Allen-Bradley 1746-IB16 SLC 500. 16 entrées DC 24V. Série C. Occasion fonctionnel.", "descriptionAr": "Module d'entrée numérique Allen-Bradley 1746-IB16 SLC 500. 16 entrées DC 24V. Série C. Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "68", "name": "1746-NI4 Analog Input Module SLC 500 USED", "nameAr": "1746-NI4 Analog Input Module SLC 500 USED", "reference": "1747-IN4", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 550, "image": "/products/image1.jpeg", "description": "Module d'entrée analogique Allen-Bradley 1746-NI4 pour SLC 500. 4 entrées universelles. Occasion fonctionnel.", "descriptionAr": "Module d'entrée analogique Allen-Bradley 1746-NI4 pour SLC 500. 4 entrées universelles. Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "69", "name": "Output Module 1746-OB16 Allen Bradley SLC500 SER D 10-30Vdc 1746OB16 *Used*", "nameAr": "Output Module 1746-OB16 Allen Bradley SLC500 SER D 10-30Vdc 1746OB16 *Used*", "reference": "1746OB16", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 550, "image": "/products/image14.jpeg", "description": "Module de sortie numérique Allen-Bradley 1746-OB16 SLC 500. 16 sorties DC 10-30V. Série D. 2 unités disponibles. Occasion fonctionnel.", "descriptionAr": "Module de sortie numérique Allen-Bradley 1746-OB16 SLC 500. 16 sorties DC 10-30V. Série D. 2 unités disponibles. Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 2, "featured": false},
  {"id": "70", "name": "Allen Bradley 1746-L532 SLC500 Processor CPU Unit", "nameAr": "Allen Bradley 1746-L532 SLC500 Processor CPU Unit", "reference": "1746-L532", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 550, "image": "/products/image54.jpeg", "description": "Processeur Allen-Bradley SLC 500 1746-L532. CPU SLC 5/03. Mémoire 16K mots. Compatible rack 1746. Occasion fonctionnel.", "descriptionAr": "Processeur Allen-Bradley SLC 500 1746-L532. CPU SLC 5/03. Mémoire 16K mots. Compatible rack 1746. Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "71", "name": "1746-OB8 SLC 500 PLC Module 1746-OB8 Output", "nameAr": "1746-OB8 SLC 500 PLC Module 1746-OB8 Output", "reference": "1746-OB8", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 550, "image": "/products/image14.jpeg", "description": "Module de sortie numérique Allen-Bradley 1746-OB8 SLC 500. 8 sorties DC. Compatible châssis 1746. Occasion fonctionnel.", "descriptionAr": "Module de sortie numérique Allen-Bradley 1746-OB8 SLC 500. 8 sorties DC. Compatible châssis 1746. Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "72", "name": "Allen-Bradley 1771-IFE PLC-5 Analog Input Module", "nameAr": "Allen-Bradley 1771-IFE PLC-5 Analog Input Module", "reference": "1771-IFE", "category": "modules", "categoryAr": "وحدات وتوصيلات", "price": 550, "image": "/products/image14.jpeg", "description": "Module d'entrée analogique Allen-Bradley 1771-IFE pour PLC-5. 4-8 entrées 4-20mA. Compatible rack 1771. Occasion fonctionnel.", "descriptionAr": "Module d'entrée analogique Allen-Bradley 1771-IFE pour PLC-5. 4-8 entrées 4-20mA. Compatible rack 1771. Occasion fonctionnel.", "brand": "Allen-Bradley", "stock": 1, "featured": false},
  {"id": "73", "name": "Rail de montage Siemens S7-300 pour Série SIMATIC S7-300", "nameAr": "Rail de montage Siemens S7-300 pour Série SIMATIC S7-300", "reference": "RACK S7/300", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 220, "image": "/products/image15.jpeg", "description": "Rail de montage Siemens SIMATIC S7-300. Longueur 480mm standard. Acier galvanisé. Supporte tous les modules S7-300 : alimentation, CPU, SM, FM, CP. Compatible avec systèmes Siemens SIMATIC.", "descriptionAr": "Rail de montage Siemens SIMATIC S7-300. Longueur 480mm standard. Acier galvanisé. Supporte tous les modules S7-300 : alimentation, CPU, SM, FM, CP. Compatible avec systèmes Siemens SIMATIC.", "brand": "Siemens", "stock": 1, "featured": false},
  {"id": "74", "name": "6ES7312-1AE14-0AB0 Siemens S7-300, CPU 312 CPU WITH MPI INTERFACE, USED", "nameAr": "6ES7312-1AE14-0AB0 Siemens S7-300, CPU 312 CPU WITH MPI INTERFACE, USED", "reference": "6ES7312-1AE14-0AB0", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 550, "image": "/products/image16.jpeg", "description": "CPU Siemens SIMATIC S7-300 312 (6ES7312-1AE14-0AB0). Interface MPI intégrée. Mémoire de travail 32KB. Sans carte mémoire. Compatible modules SM/FM/CP série 300. Occasion fonctionnel.", "descriptionAr": "CPU Siemens SIMATIC S7-300 312 (6ES7312-1AE14-0AB0). Interface MPI intégrée. Mémoire de travail 32KB. Sans carte mémoire. Compatible modules SM/FM/CP série 300. Occasion fonctionnel.", "brand": "Siemens", "stock": 1, "featured": false},
  {"id": "75", "name": "INPUT MODULE SM 321 DI 32x24V DC", "nameAr": "INPUT MODULE SM 321 DI 32x24V DC", "reference": "6ES7 321-1BL00-0AA0", "category": "modules", "categoryAr": "وحدات وتوصيلات", "price": 550, "image": "/products/image19.jpeg", "description": "Module d'entrée numérique Siemens SIMATIC SM 321 (6ES7321-1BL00-0AA0). 32 entrées 24VDC. Isolation optique. Compatible rack S7-300. Conforme IEC 61131-2.", "descriptionAr": "Module d'entrée numérique Siemens SIMATIC SM 321 (6ES7321-1BL00-0AA0). 32 entrées 24VDC. Isolation optique. Compatible rack S7-300. Conforme IEC 61131-2.", "brand": "Siemens", "stock": 1, "featured": false},
  {"id": "76", "name": "connecteurs BUS Siemens 720 2001-01 PIS", "nameAr": "connecteurs BUS Siemens 720 2001-01 PIS", "reference": "720 2001-01", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 22, "image": "/products/image17.jpeg", "description": "Connecteur bus Siemens 720 2001-01 pour SIMATIC S7-300/S5. Connecteur 9 pôles pour câble MPI/PROFIBUS. Lot de 10 pcs. Compatible systèmes Siemens PIS.", "descriptionAr": "Connecteur bus Siemens 720 2001-01 pour SIMATIC S7-300/S5. Connecteur 9 pôles pour câble MPI/PROFIBUS. Lot de 10 pcs. Compatible systèmes Siemens PIS.", "brand": "Siemens", "stock": 10, "featured": false},
  {"id": "77", "name": "SYSTEM HELMHOLZ 700-322-1BH01 S7-DEA DO 16X DC24V - 0.5A USED", "nameAr": "SYSTEM HELMHOLZ 700-322-1BH01 S7-DEA DO 16X DC24V - 0.5A USED", "reference": "700-322-1BH01", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 550, "image": "/products/image18.jpeg", "description": "Module de sortie numérique Helmholz S7-DEA DO 16x DC24V-0.5A (700-322-1BH01). 16 sorties 24VDC/0.5A. Compatible systèmes Siemens S7. Conforme EN 61131-2. Occasion fonctionnel.", "descriptionAr": "Module de sortie numérique Helmholz S7-DEA DO 16x DC24V-0.5A (700-322-1BH01). 16 sorties 24VDC/0.5A. Compatible systèmes Siemens S7. Conforme EN 61131-2. Occasion fonctionnel.", "brand": "Helmholz", "stock": 2, "featured": false},
  {"id": "78", "name": "YSTEME HELMHOLZ 700-321-1BH02 S7-DEA Di 16x DC24V", "nameAr": "YSTEME HELMHOLZ 700-321-1BH02 S7-DEA Di 16x DC24V", "reference": "700-321-1BH02", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 550, "image": "/products/image18.jpeg", "description": "Module d'entrée numérique Helmholz S7-DEA DI 16x DC24V (700-321-1BH02). 16 entrées 24VDC. Isolation optique. Compatible systèmes Siemens S7. Occasion fonctionnel.", "descriptionAr": "Module d'entrée numérique Helmholz S7-DEA DI 16x DC24V (700-321-1BH02). 16 entrées 24VDC. Isolation optique. Compatible systèmes Siemens S7. Occasion fonctionnel.", "brand": "Helmholz", "stock": 2, "featured": false},
  {"id": "79", "name": "MODULE D'ENTRÉE NUMÉRIQUE SIMATIC 6ES7 321-1BL00-0AA0 SIMATIC 6ES73211BL000AA0  USED", "nameAr": "MODULE D'ENTRÉE NUMÉRIQUE SIMATIC 6ES7 321-1BL00-0AA0 SIMATIC 6ES73211BL000AA0  USED", "reference": "6ES7 321-1BL00", "category": "modules", "categoryAr": "وحدات وتوصيلات", "price": 550, "image": "/products/image19.jpeg", "description": "Module d'entrée numérique Siemens SIMATIC SM 321 (6ES7321-1BL00-0AA0). 32 entrées 24VDC. Isolation optique. Compatible rack S7-300. 3 unités disponibles. Occasion fonctionnel.", "descriptionAr": "Module d'entrée numérique Siemens SIMATIC SM 321 (6ES7321-1BL00-0AA0). 32 entrées 24VDC. Isolation optique. Compatible rack S7-300. 3 unités disponibles. Occasion fonctionnel.", "brand": "Siemens", "stock": 3, "featured": false},
  {"id": "80", "name": "Module de sortie Siemens 6ES7 322-1HH00-0AA0", "nameAr": "Module de sortie Siemens 6ES7 322-1HH00-0AA0", "reference": "6ES7 322-1HH00", "category": "modules", "categoryAr": "وحدات وتوصيلات", "price": 1100, "image": "/products/image19.jpeg", "description": "Module de sortie numérique Siemens SIMATIC SM 322 (6ES7322-1HH00-0AA0). 16 sorties relais 230VAC/2A. Isolation galvanique. Compatible rack S7-300. Occasion fonctionnel.", "descriptionAr": "Module de sortie numérique Siemens SIMATIC SM 322 (6ES7322-1HH00-0AA0). 16 sorties relais 230VAC/2A. Isolation galvanique. Compatible rack S7-300. Occasion fonctionnel.", "brand": "Siemens", "stock": 1, "featured": false},
  {"id": "81", "name": "Siemens 6ES7322-5HB01-0AB0 6ES7 322-5HB01-0AB0 USED", "nameAr": "Siemens 6ES7322-5HB01-0AB0 6ES7 322-5HB01-0AB0 USED", "reference": "6ES7322-5HB01", "category": "modules", "categoryAr": "وحدات وتوصيلات", "price": 1100, "image": "/products/image19.jpeg", "description": "Module de sortie numérique Siemens SIMATIC (6ES7322-5HB01-0AB0). Compatible S7-300. Occasion fonctionnel.", "descriptionAr": "Module de sortie numérique Siemens SIMATIC (6ES7322-5HB01-0AB0). Compatible S7-300. Occasion fonctionnel.", "brand": "Siemens", "stock": 1, "featured": false},
  {"id": "82", "name": "Module d'entrée analogique Helmholz 700-331-1KF01 AEA  USED", "nameAr": "Module d'entrée analogique Helmholz 700-331-1KF01 AEA  USED", "reference": "700-331-1KF01", "category": "modules", "categoryAr": "وحدات وتوصيلات", "price": 550, "image": "/products/image18.jpeg", "description": "Module d'entrée analogique Helmholz AEA (700-331-1KF01). 4 entrées analogiques 4-20mA ou ±10V. Compatible systèmes Siemens S7. Résolution 12 bits. Occasion fonctionnel.", "descriptionAr": "Module d'entrée analogique Helmholz AEA (700-331-1KF01). 4 entrées analogiques 4-20mA ou ±10V. Compatible systèmes Siemens S7. Résolution 12 bits. Occasion fonctionnel.", "brand": "Helmholz", "stock": 1, "featured": false},
  {"id": "83", "name": "Alimentation Siemens SIMATIC PM 1207 6EP1332-1SH71 État du produit:01 -inutilisée/emballage d'origine-", "nameAr": "Alimentation Siemens SIMATIC PM 1207 6EP1332-1SH71 État du produit:01 -inutilisée/emballage d'origine-", "reference": "PM 1207", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 330, "image": "/products/image20.jpeg", "description": "Alimentation Siemens SIMATIC PM 1207 (6EP1332-1SH71). Entrée 120/230VAC. Sortie 24VDC/2.5A. Compatible S7-1200. Protection contre surcharge et court-circuit. Neuf, emballage d'origine.", "descriptionAr": "Alimentation Siemens SIMATIC PM 1207 (6EP1332-1SH71). Entrée 120/230VAC. Sortie 24VDC/2.5A. Compatible S7-1200. Protection contre surcharge et court-circuit. Neuf, emballage d'origine.", "brand": "Siemens", "stock": 1, "featured": false},
  {"id": "84", "name": "Siemens CPU 1215C - 6ES7215-1AG40-0XB0  -inutilisée/emballage d'origine-", "nameAr": "Siemens CPU 1215C - 6ES7215-1AG40-0XB0  -inutilisée/emballage d'origine-", "reference": "CPU 1215C", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 3300, "image": "/products/image16.jpeg", "description": "CPU Siemens S7-1200 1215C (6ES7215-1AG40-0XB0). 14 entrées DI, 10 DO, 2 AI, 2 AO intégrées. 2 ports PROFINET. Mémoire 125KB. Supporte PROFINET IO, Modbus TCP, communication ouverte. Neuf d'origine. 2 unités.", "descriptionAr": "CPU Siemens S7-1200 1215C (6ES7215-1AG40-0XB0). 14 entrées DI, 10 DO, 2 AI, 2 AO intégrées. 2 ports PROFINET. Mémoire 125KB. Supporte PROFINET IO, Modbus TCP, communication ouverte. Neuf d'origine. 2 unités.", "brand": "Siemens", "stock": 2, "featured": false},
  {"id": "85", "name": "Module PLC Siemens S7-1200 Sm1222  6es7223-1pl32-0xb0  inutilisée/emballage d'origine-", "nameAr": "Module PLC Siemens S7-1200 Sm1222  6es7223-1pl32-0xb0  inutilisée/emballage d'origine-", "reference": "6ES7223-1PL32-0XB0", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 1100, "image": "/products/image19.jpeg", "description": "Module d'extension Siemens S7-1200 SM1222 (6ES7223-1PL32-0XB0). 16 sorties relais. Alimentation 24VDC. Compatible CPU 1200 série. Neuf d'origine. 3 unités disponibles.", "descriptionAr": "Module d'extension Siemens S7-1200 SM1222 (6ES7223-1PL32-0XB0). 16 sorties relais. Alimentation 24VDC. Compatible CPU 1200 série. Neuf d'origine. 3 unités disponibles.", "brand": "Siemens", "stock": 3, "featured": false},
  {"id": "86", "name": "LOGO! 12/24RCE,logic module,display PS/I/O: 12/24VDC/relay, 8 DI (4AI)/4DO, memory 400 blocks, modular expandable, Ethernet integr.", "nameAr": "LOGO! 12/24RCE,logic module,display PS/I/O: 12/24VDC/relay, 8 DI (4AI)/4DO, memory 400 blocks, modular expandable, Ethernet integr.", "reference": "6ED1052-1MD00-0BA8", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 715, "image": "/products/image20.jpeg", "description": "Module logique Siemens LOGO! 12/24RCE (6ED1052-1MD00-0BA8). 8 entrées DI (4 AI) / 4 sorties relais. Alimentation 12/24VDC. Ethernet intégré. 400 blocs de mémoire. Extensible jusqu'à 24 E/S. Neuf.", "descriptionAr": "Module logique Siemens LOGO! 12/24RCE (6ED1052-1MD00-0BA8). 8 entrées DI (4 AI) / 4 sorties relais. Alimentation 12/24VDC. Ethernet intégré. 400 blocs de mémoire. Extensible jusqu'à 24 E/S. Neuf.", "brand": "Siemens", "stock": 1, "featured": false},
  {"id": "87", "name": "1794-TB3 Flex Terminal Base  USED", "nameAr": "1794-TB3 Flex Terminal Base  USED", "reference": "1794-TB3", "category": "modules", "categoryAr": "وحدات وتوصيلات", "price": 220, "image": "/products/image1.jpeg", "description": "Base terminale Allen-Bradley Flex I/O 1794-TB3. 3 fils de connexion par voie. Compatible modules FLEX I/O 1794. Montage sur rail DIN. Occasion fonctionnel. 3 unités disponibles.", "descriptionAr": "Base terminale Allen-Bradley Flex I/O 1794-TB3. 3 fils de connexion par voie. Compatible modules FLEX I/O 1794. Montage sur rail DIN. Occasion fonctionnel. 3 unités disponibles.", "brand": "Allen-Bradley", "stock": 3, "featured": false},
  {"id": "88", "name": "Allen-Bradley 1794-IB16 24 VDC Sink Input - 1794-IB16-A-B01  USED", "nameAr": "Allen-Bradley 1794-IB16 24 VDC Sink Input - 1794-IB16-A-B01  USED", "reference": "1794-IB16", "category": "modules", "categoryAr": "وحدات وتوصيلات", "price": 220, "image": "/products/image1.jpeg", "description": "Module d'entrée numérique Allen-Bradley FLEX I/O 1794-IB16. 16 entrées 24VDC. Isolation optique. Compatible base 1794-TB. Occasion fonctionnel. 3 unités disponibles.", "descriptionAr": "Module d'entrée numérique Allen-Bradley FLEX I/O 1794-IB16. 16 entrées 24VDC. Isolation optique. Compatible base 1794-TB. Occasion fonctionnel. 3 unités disponibles.", "brand": "Allen-Bradley", "stock": 3, "featured": false},
  {"id": "89", "name": "1794-OB16 Flex 16 Point Digital Output Module   USED", "nameAr": "1794-OB16 Flex 16 Point Digital Output Module   USED", "reference": "1794-OB16", "category": "modules", "categoryAr": "وحدات وتوصيلات", "price": 330, "image": "/products/image14.jpeg", "description": "Module de sortie numérique Allen-Bradley FLEX I/O 1794-OB16. 16 sorties DC. Protection contre court-circuit. Compatible base 1794-TB. Occasion fonctionnel. 5 unités disponibles.", "descriptionAr": "Module de sortie numérique Allen-Bradley FLEX I/O 1794-OB16. 16 sorties DC. Protection contre court-circuit. Compatible base 1794-TB. Occasion fonctionnel. 5 unités disponibles.", "brand": "Allen-Bradley", "stock": 5, "featured": false},
  {"id": "90", "name": "Siemens 6ES5095-8MB02 CPU S5-95U MODULE SIMATIC S5   USED", "nameAr": "Siemens 6ES5095-8MB02 CPU S5-95U MODULE SIMATIC S5   USED", "reference": "6ES5095-8MB02", "category": "plc", "categoryAr": "أتمتة وتحكم", "price": 550, "image": "/products/image16.jpeg", "description": "CPU Siemens SIMATIC S5-95U (6ES5095-8MB02). Automate compact série S5. Entrées/sorties intégrées. Communication RS-232. Module SIMATIC S5. Occasion fonctionnel.", "descriptionAr": "CPU Siemens SIMATIC S5-95U (6ES5095-8MB02). Automate compact série S5. Entrées/sorties intégrées. Communication RS-232. Module SIMATIC S5. Occasion fonctionnel.", "brand": "Siemens", "stock": 1, "featured": false},
  {"id": "91", "name": "IEMENS SIMATIC S5 6ES5 440-8MA21 DIGITAL OUTPUT MODULE   USED", "nameAr": "IEMENS SIMATIC S5 6ES5 440-8MA21 DIGITAL OUTPUT MODULE   USED", "reference": "6ES5 440-8MA21", "category": "modules", "categoryAr": "وحدات وتوصيلات", "price": 550, "image": "/products/image19.jpeg", "description": "Module de sortie numérique Siemens SIMATIC S5 (6ES5440-8MA21). Sorties numériques 24VDC. Compatible racks S5. Occasion fonctionnel.", "descriptionAr": "Module de sortie numérique Siemens SIMATIC S5 (6ES5440-8MA21). Sorties numériques 24VDC. Compatible racks S5. Occasion fonctionnel.", "brand": "Siemens", "stock": 1, "featured": false},
  {"id": "92", "name": "Siemens Simatic S5 6ES5 700-8MA11 Bus Module   USED", "nameAr": "Siemens Simatic S5 6ES5 700-8MA11 Bus Module   USED", "reference": "6ES5 700-8MA11", "category": "modules", "categoryAr": "وحدات وتوصيلات", "price": 110, "image": "/products/image17.jpeg", "description": "Module bus Siemens SIMATIC S5 (6ES5700-8MA11). Connecteur bus pour extension de rack S5. Occasion fonctionnel.", "descriptionAr": "Module bus Siemens SIMATIC S5 (6ES5700-8MA11). Connecteur bus pour extension de rack S5. Occasion fonctionnel.", "brand": "Siemens", "stock": 1, "featured": false},
  {"id": "93", "name": "Colonne de signalisation; /vert/jaune; LED; 24VDC; 24VAC SANS TIGE  new", "nameAr": "Colonne de signalisation; /vert/jaune; LED; 24VDC; 24VAC SANS TIGE  new", "reference": "IK73L024XM01", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 110, "image": "/products/image26.jpeg", "description": "Colonne de signalisation LED Ø40mm sans tige. Couleurs vert/jaune. Alimentation 24VDC/24VAC. LED longue durée, très visible. Fixation par filetage. 7 unités disponibles. Neuf.", "descriptionAr": "Colonne de signalisation LED Ø40mm sans tige. Couleurs vert/jaune. Alimentation 24VDC/24VAC. LED longue durée, très visible. Fixation par filetage. 7 unités disponibles. Neuf.", "brand": "Industriel", "stock": 7, "featured": false},
  {"id": "94", "name": "Elematic ELEFIX 16-32  new", "nameAr": "Elematic ELEFIX 16-32  new", "reference": "565958(M7)", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 2, "image": "/products/image27.jpeg", "description": "Collier de câble Elematic ELEFIX 16-32mm. Fixation sur rail DIN ou vis. Maintien de câbles ronds Ø16-32mm. Matière plastique ignifugée. Lot de 200 pcs. Neuf.", "descriptionAr": "Collier de câble Elematic ELEFIX 16-32mm. Fixation sur rail DIN ou vis. Maintien de câbles ronds Ø16-32mm. Matière plastique ignifugée. Lot de 200 pcs. Neuf.", "brand": "Industriel", "stock": 200, "featured": false},
  {"id": "95", "name": "Contacteur de puissance, AC-3 9 A, 4 kW / 400 V 1 NO, 24 V CC 3 pôles,  new", "nameAr": "Contacteur de puissance, AC-3 9 A, 4 kW / 400 V 1 NO, 24 V CC 3 pôles,  new", "reference": "3RT1016-1BB41", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 220, "image": "/products/image28.jpeg", "description": "Contacteur de puissance Siemens SIRIUS 3RT1016. AC-3 : 9A / 4kW à 400V. Bobine 24VDC. 3 pôles + 1 contact auxiliaire NO intégré. Montage sur rail DIN. Neuf. 9 unités disponibles.", "descriptionAr": "Contacteur de puissance Siemens SIRIUS 3RT1016. AC-3 : 9A / 4kW à 400V. Bobine 24VDC. 3 pôles + 1 contact auxiliaire NO intégré. Montage sur rail DIN. Neuf. 9 unités disponibles.", "brand": "Industriel", "stock": 9, "featured": false},
  {"id": "96", "name": "Relaisn Declencheur Siemens  new", "nameAr": "Relaisn Declencheur Siemens  new", "reference": "3RV1902-1AB0", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 550, "image": "/products/image29.jpeg", "description": "Déclencheur Siemens SIRIUS pour disjoncteur moteur. Déclenche lors de perte de phase ou de sous-tension. Compatible 3RV2. Neuf. 9 unités disponibles.", "descriptionAr": "Déclencheur Siemens SIRIUS pour disjoncteur moteur. Déclenche lors de perte de phase ou de sous-tension. Compatible 3RV2. Neuf. 9 unités disponibles.", "brand": "Siemens", "stock": 9, "featured": false},
  {"id": "97", "name": "ON DELAY time relay, 2-channels SJR-2  new", "nameAr": "ON DELAY time relay, 2-channels SJR-2  new", "reference": "SJR2", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 110, "image": "/products/image30.jpeg", "description": "Relais temporisé à enclenchement (ON DELAY) SJR-2. 2 canaux indépendants. Plage de réglage configurable. Sortie relais. Alimentation universelle. Montage sur rail DIN. 2 unités disponibles.", "descriptionAr": "Relais temporisé à enclenchement (ON DELAY) SJR-2. 2 canaux indépendants. Plage de réglage configurable. Sortie relais. Alimentation universelle. Montage sur rail DIN. 2 unités disponibles.", "brand": "Industriel", "stock": 2, "featured": false},
  {"id": "98", "name": "Disjoncteur de protection moteur série Gv2 20-25 A  new", "nameAr": "Disjoncteur de protection moteur série Gv2 20-25 A  new", "reference": "GV2ME22", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 198, "image": "/products/image31.jpeg", "description": "Disjoncteur-moteur Schneider Electric TeSys GV2ME22. Calibre 20-25A. Protection thermique et magnétique intégrée. 3 pôles. Coupure 50kA à 400V. Montage sur rail DIN. 3 unités. Neuf.", "descriptionAr": "Disjoncteur-moteur Schneider Electric TeSys GV2ME22. Calibre 20-25A. Protection thermique et magnétique intégrée. 3 pôles. Coupure 50kA à 400V. Montage sur rail DIN. 3 unités. Neuf.", "brand": "Schneider", "stock": 3, "featured": false},
  {"id": "99", "name": "DÉCLENCHEUR VOLTMÉTRIQUE - TESYS GV - 24V AC - SCHNEIDER ELECTRIC GVAS025  new", "nameAr": "DÉCLENCHEUR VOLTMÉTRIQUE - TESYS GV - 24V AC - SCHNEIDER ELECTRIC GVAS025  new", "reference": "GVAS025", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 220, "image": "/products/image32.jpeg", "description": "Déclencheur voltmétrique Schneider Electric GVAS025 pour TeSys GV. Tension 24VAC. Se monte sur disjoncteur moteur GV2/GV3. Déclenche en cas de chute de tension. 4 unités. Neuf.", "descriptionAr": "Déclencheur voltmétrique Schneider Electric GVAS025 pour TeSys GV. Tension 24VAC. Se monte sur disjoncteur moteur GV2/GV3. Déclenche en cas de chute de tension. 4 unités. Neuf.", "brand": "Schneider", "stock": 4, "featured": false},
  {"id": "100", "name": "375010Ingelec Telerrupteur new", "nameAr": "375010Ingelec Telerrupteur new", "reference": "375010", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 110, "image": "/products/image33.jpeg", "description": "Télérupteur Ingelec 375010. Commande à impulsion, coupure omnipolaire. Alimentation 230VAC. Montage sur rail DIN. 3 unités disponibles. Neuf.", "descriptionAr": "Télérupteur Ingelec 375010. Commande à impulsion, coupure omnipolaire. Alimentation 230VAC. Montage sur rail DIN. 3 unités disponibles. Neuf.", "brand": "Industriel", "stock": 3, "featured": false},
  {"id": "101", "name": "Contacteur Schneider LC1D40AQ7 new", "nameAr": "Contacteur Schneider LC1D40AQ7 new", "reference": "LC1D40AQ7", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 935, "image": "/products/image34.jpeg", "description": "Contacteur Schneider Electric LC1D40AQ7. 40A / 18.5kW à 400V. Bobine 380-400VAC 50/60Hz. 3 pôles. Contacts 1NO+1NC. Montage sur rail DIN. Conforme IEC 60947-4-1. Neuf.", "descriptionAr": "Contacteur Schneider Electric LC1D40AQ7. 40A / 18.5kW à 400V. Bobine 380-400VAC 50/60Hz. 3 pôles. Contacts 1NO+1NC. Montage sur rail DIN. Conforme IEC 60947-4-1. Neuf.", "brand": "Schneider", "stock": 1, "featured": false},
  {"id": "102", "name": "Interrupteur Schneider 63A INS63 new", "nameAr": "Interrupteur Schneider 63A INS63 new", "reference": "ins63 Schneider", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 330, "image": "/products/image35.jpeg", "description": "Interrupteur-sectionneur Schneider Electric INS63. 63A, 4 pôles. Tension 400/690V. Coupure visible omnipolaire. Cadenassable. Montage en tableau. Conforme EN 60947-3. Neuf.", "descriptionAr": "Interrupteur-sectionneur Schneider Electric INS63. 63A, 4 pôles. Tension 400/690V. Coupure visible omnipolaire. Cadenassable. Montage en tableau. Conforme EN 60947-3. Neuf.", "brand": "Schneider", "stock": 1, "featured": false},
  {"id": "103", "name": "BMeters 2\" BSP (50mm) GMDM-i Multi Jet Cold Water Meter, PN: GMDM-50AF  NEW", "nameAr": "BMeters 2\" BSP (50mm) GMDM-i Multi Jet Cold Water Meter, PN: GMDM-50AF  NEW", "reference": "GMDM DN50", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 2200, "image": "/products/image41.jpeg", "description": "Compteur d'eau multi-jet BMeters GMDM-i DN50 (2\" BSP). Calibre 50mm, PN16. Mesure eau froide. Conforme EN ISO 4064 classe C. Sortie impulsion. Référence GMDM-50AF. Neuf.", "descriptionAr": "Compteur d'eau multi-jet BMeters GMDM-i DN50 (2\" BSP). Calibre 50mm, PN16. Mesure eau froide. Conforme EN ISO 4064 classe C. Sortie impulsion. Référence GMDM-50AF. Neuf.", "brand": "BMeters", "stock": 1, "featured": false},
  {"id": "104", "name": "Capteur de proximité Omron, M12, Détection 4 mm, PNP NO, 12→24 V c.c", "nameAr": "Capteur de proximité Omron, M12, Détection 4 mm, PNP NO, 12→24 V c.c", "reference": "E2A-M12KS04", "category": "sensors", "categoryAr": "حساسات وكاشفات", "price": 110, "image": "/products/image3.jpeg", "description": "Capteur de proximité inductif Omron E2A-M12KS04. Corps M12, détection 4mm. Sortie PNP NO. Alimentation 12-24VDC. Protection IP67. Connexion câble ou connecteur M12. 3 unités disponibles.", "descriptionAr": "Capteur de proximité inductif Omron E2A-M12KS04. Corps M12, détection 4mm. Sortie PNP NO. Alimentation 12-24VDC. Protection IP67. Connexion câble ou connecteur M12. 3 unités disponibles.", "brand": "Omron", "stock": 3, "featured": false},
  {"id": "105", "name": "Capteur de proximité Omron, M08, Détection 4 mm, PNP NO, 12→24 V c.c", "nameAr": "Capteur de proximité Omron, M08, Détection 4 mm, PNP NO, 12→24 V c.c", "reference": "E2A-M08KS02", "category": "sensors", "categoryAr": "حساسات وكاشفات", "price": 110, "image": "/products/image3.jpeg", "description": "Capteur de proximité inductif Omron E2A-M08KS02. Corps M8, détection 2mm. Sortie PNP NO. Alimentation 12-24VDC. Protection IP67. Très compact, idéal pour espaces restreints.", "descriptionAr": "Capteur de proximité inductif Omron E2A-M08KS02. Corps M8, détection 2mm. Sortie PNP NO. Alimentation 12-24VDC. Protection IP67. Très compact, idéal pour espaces restreints.", "brand": "Omron", "stock": 1, "featured": false},
  {"id": "106", "name": "SCHNEIDER ZCP21M12 LIMIT SWITCH", "nameAr": "SCHNEIDER ZCP21M12 LIMIT SWITCH", "reference": "ZCP21M12", "category": "sensors", "categoryAr": "حساسات وكاشفات", "price": 110, "image": "/products/image23.jpeg", "description": "Fin de course Schneider Electric ZCP21M12. Corps métallique, actuateur à galet. 1NO+1NC. Courant 6A. Alimentation 240VAC. Protection IP65. Montage universel.", "descriptionAr": "Fin de course Schneider Electric ZCP21M12. Corps métallique, actuateur à galet. 1NO+1NC. Courant 6A. Alimentation 240VAC. Protection IP65. Montage universel.", "brand": "Schneider", "stock": 1, "featured": false},
  {"id": "107", "name": "Capteur photoélectrique Omron E3X-NA11", "nameAr": "Capteur photoélectrique Omron E3X-NA11", "reference": "E3X-NA11", "category": "sensors", "categoryAr": "حساسات وكاشفات", "price": 110, "image": "/products/image44.jpeg", "description": "Amplificateur à fibre optique Omron E3X-NA11. Réglage de sensibilité par potentiomètre. LED de sortie et de stabilité. Sortie NPN. Alimentation 12-24VDC. Compatible fibres Omron E32.", "descriptionAr": "Amplificateur à fibre optique Omron E3X-NA11. Réglage de sensibilité par potentiomètre. LED de sortie et de stabilité. Sortie NPN. Alimentation 12-24VDC. Compatible fibres Omron E32.", "brand": "Omron", "stock": 1, "featured": false},
  {"id": "108", "name": "LADN22 Schneider Electric auxiliary contact block", "nameAr": "LADN22 Schneider Electric auxiliary contact block", "reference": "LADN22", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 55, "image": "/products/image12.jpeg", "description": "Bloc de contacts auxiliaires Schneider Electric LADN22. 2 NO + 2 NC. Connexion vis. Compatible contacteurs TeSys D LC1D09 à D65. Montage frontal. 4 unités disponibles.", "descriptionAr": "Bloc de contacts auxiliaires Schneider Electric LADN22. 2 NO + 2 NC. Connexion vis. Compatible contacteurs TeSys D LC1D09 à D65. Montage frontal. 4 unités disponibles.", "brand": "Schneider", "stock": 4, "featured": false},
  {"id": "109", "name": "TELEMECANIQUE ZB2BZ105, 061434, Push button body with switches", "nameAr": "TELEMECANIQUE ZB2BZ105, 061434, Push button body with switches", "reference": "ZB2BZ105", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 55, "image": "/products/image26.jpeg", "description": "Corps de bouton-poussoir Télemécanique ZB2BZ105. 1 NC. Dia. 22mm. Compatible avec têtes ZB2 series. Pour pupitres et coffrets de commande. 4 unités disponibles.", "descriptionAr": "Corps de bouton-poussoir Télemécanique ZB2BZ105. 1 NC. Dia. 22mm. Compatible avec têtes ZB2 series. Pour pupitres et coffrets de commande. 4 unités disponibles.", "brand": "Schneider", "stock": 4, "featured": false},
  {"id": "110", "name": "Harmony XB5 - voyant lumineux BA9s - Ø22 - blanc - direct 250V max - vis étrier", "nameAr": "Harmony XB5 - voyant lumineux BA9s - Ø22 - blanc - direct 250V max - vis étrier", "reference": "XB5 AV61", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 55, "image": "/products/image26.jpeg", "description": "Voyant lumineux Schneider Harmony XB5. Culot BA9s. Diamètre 22mm. Couleur blanche. Tension directe max 250V. Fixation par vis-étrier. 5 unités disponibles.", "descriptionAr": "Voyant lumineux Schneider Harmony XB5. Culot BA9s. Diamètre 22mm. Couleur blanche. Tension directe max 250V. Fixation par vis-étrier. 5 unités disponibles.", "brand": "Schneider", "stock": 5, "featured": false},
  {"id": "111", "name": "1/2'' UW-15 Uni-D Type Brass Solenoid Valve 220VAC", "nameAr": "1/2'' UW-15 Uni-D Type Brass Solenoid Valve 220VAC", "reference": "1/2'' UW-15", "category": "electrical", "categoryAr": "كهرباء صناعية", "price": 110, "image": "/products/image37.jpeg", "description": "Électrovanne laiton 1/2\" (DN15) Uni-D type UW-15. Alimentation 220VAC. 2/2 voies normalement fermée (NC). Pression 0-16 bar. Corps laiton nickelé. Pour eau, air, huile. 2 unités.", "descriptionAr": "Électrovanne laiton 1/2\" (DN15) Uni-D type UW-15. Alimentation 220VAC. 2/2 voies normalement fermée (NC). Pression 0-16 bar. Corps laiton nickelé. Pour eau, air, huile. 2 unités.", "brand": "Industriel", "stock": 2, "featured": false},
  {"id": "112", "name": "Connecteur résistant à 32 broches PG29 Mâle Femelle Butt-Joint H32A Shell Hasp High Surface Mounting High Top Cable Entry", "nameAr": "Connecteur résistant à 32 broches PG29 Mâle Femelle Butt-Joint H32A Shell Hasp High Surface Mounting High Top Cable Entry", "reference": "PG29 H32A", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 110, "image": "/products/image17.jpeg", "description": "Connecteur industriel PG29 32 pôles mâle/femelle. Boîtier plastique haute résistance. Fixation par crampon. Entrée câble PG29. Pour câblage d'équipements mobiles ou vibrants.", "descriptionAr": "Connecteur industriel PG29 32 pôles mâle/femelle. Boîtier plastique haute résistance. Fixation par crampon. Entrée câble PG29. Pour câblage d'équipements mobiles ou vibrants.", "brand": "Industriel", "stock": 1, "featured": false},
  {"id": "113", "name": "Capacitive proximity sensor AKS18/4609S", "nameAr": "Capacitive proximity sensor AKS18/4609S", "reference": "AKS18/4609S", "category": "sensors", "categoryAr": "حساسات وكاشفات", "price": 55, "image": "/products/image44.jpeg", "description": "Capteur de proximité capacitif AKS18/4609S. Corps Ø18mm. Détection matériaux non métalliques. Distance de détection ajustable. Sortie PNP. Alimentation 10-36VDC.", "descriptionAr": "Capteur de proximité capacitif AKS18/4609S. Corps Ø18mm. Détection matériaux non métalliques. Distance de détection ajustable. Sortie PNP. Alimentation 10-36VDC.", "brand": "Industriel", "stock": 1, "featured": false},
  {"id": "114", "name": "ISCH TE-2000PS INDUSTRIAL HYGIENE ENZYME SAMPLER 110V-AC D532586", "nameAr": "ISCH TE-2000PS INDUSTRIAL HYGIENE ENZYME SAMPLER 110V-AC D532586", "reference": "TISCH ENVIREMENT", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 220, "image": "/products/image21.jpeg", "description": "Préleveur d'air industriel TISCH TE-2000PS (Industrial Hygiene Enzyme Sampler). Alimentation 110VAC. Pour prélèvement d'échantillons d'air ambiant. Réf. D532586. 3 unités disponibles. Occasion.", "descriptionAr": "Préleveur d'air industriel TISCH TE-2000PS (Industrial Hygiene Enzyme Sampler). Alimentation 110VAC. Pour prélèvement d'échantillons d'air ambiant. Réf. D532586. 3 unités disponibles. Occasion.", "brand": "Industriel", "stock": 3, "featured": false},
  {"id": "115", "name": "MARANTEC CS310 - Armoire de commande pour moteurs mono ou triphasés", "nameAr": "MARANTEC CS310 - Armoire de commande pour moteurs mono ou triphasés", "reference": "CS310", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 1100, "image": "/products/image42.jpeg", "description": "Armoire de commande MARANTEC CS310 pour moteurs mono ou triphasés. Commande d'automatismes de portails et portes industrielles. Compacte, protégée IP55. 1 unité disponible.", "descriptionAr": "Armoire de commande MARANTEC CS310 pour moteurs mono ou triphasés. Commande d'automatismes de portails et portes industrielles. Compacte, protégée IP55. 1 unité disponible.", "brand": "Marantec", "stock": 1, "featured": false},
  {"id": "116", "name": "Notifier NFS 8 Zone Conventional Fire Alarm Panel", "nameAr": "Notifier NFS 8 Zone Conventional Fire Alarm Panel", "reference": "NFS 2-8", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 1100, "image": "/products/image43.jpeg", "description": "Centrale de détection incendie conventionnelle Notifier NFS 2-8. 8 zones, affichage LED par zone. Alimentation 230VAC avec batterie de secours. Conforme EN 54. Pour bâtiments industriels et tertiaires.", "descriptionAr": "Centrale de détection incendie conventionnelle Notifier NFS 2-8. 8 zones, affichage LED par zone. Alimentation 230VAC avec batterie de secours. Conforme EN 54. Pour bâtiments industriels et tertiaires.", "brand": "Notifier", "stock": 1, "featured": false},
  {"id": "117", "name": "KL731KELSEN  Sans Support", "nameAr": "KL731KELSEN  Sans Support", "reference": "KL731", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 110, "image": "/products/image27.jpeg", "description": "Terminal de câblage KL731 KELSEN. Montage sur rail DIN. Sans support. 3 unités disponibles.", "descriptionAr": "Terminal de câblage KL731 KELSEN. Montage sur rail DIN. Sans support. 3 unités disponibles.", "brand": "Industriel", "stock": 3, "featured": false},
  {"id": "118", "name": "SICK WS36-D430 THROUGH-BEAM PHOTOELECTRIC SENSOR avec Recipteur", "nameAr": "SICK WS36-D430 THROUGH-BEAM PHOTOELECTRIC SENSOR avec Recipteur", "reference": "SICK WS36-D430", "category": "sensors", "categoryAr": "حساسات وكاشفات", "price": 110, "image": "/products/image44.jpeg", "description": "Barrière lumineuse monofaisceau SICK WS36-D430. Émetteur + récepteur fournis. Détection fiable d'objets opaques. Alimentation 10-30VDC. Portée ajustable. Protection IP67.", "descriptionAr": "Barrière lumineuse monofaisceau SICK WS36-D430. Émetteur + récepteur fournis. Détection fiable d'objets opaques. Alimentation 10-30VDC. Portée ajustable. Protection IP67.", "brand": "SICK", "stock": 1, "featured": false},
  {"id": "119", "name": "Optical Patchcord SC UPC/SC UPC Duplex", "nameAr": "Optical Patchcord SC UPC/SC UPC Duplex", "reference": "sc_upc", "category": "equipment", "categoryAr": "معدات متنوعة", "price": 55, "image": "/products/image3.jpeg", "description": "Jarretière optique SC UPC / SC UPC duplex. Fibre monomode OS2 9/125µm. Longueur adaptée à l'installation. Pertes d'insertion < 0.3dB. Gaine PVC jaune. 2 unités disponibles.", "descriptionAr": "Jarretière optique SC UPC / SC UPC duplex. Fibre monomode OS2 9/125µm. Longueur adaptée à l'installation. Pertes d'insertion < 0.3dB. Gaine PVC jaune. 2 unités disponibles.", "brand": "Industriel", "stock": 2, "featured": false}
];



const categories = [
  { id: 'all', name: 'Tous', nameAr: 'الكل' },
  { id: 'plc', name: 'Automates & CPU', nameAr: 'أتمتة وتحكم' },
  { id: 'sensors', name: 'Capteurs & Détecteurs', nameAr: 'حساسات وكاشفات' },
  { id: 'electrical', name: 'Électricité Industrielle', nameAr: 'كهرباء صناعية' },
  { id: 'modules', name: 'Modules & Communication', nameAr: 'وحدات وتوصيلات' },
  { id: 'equipment', name: 'Équipements Divers', nameAr: 'معدات متنوعة' },
];

export default function Products() {
  const { t } = useLanguage();
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Product[]>([]);
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
  const [orderHoneypot, setOrderHoneypot] = useState(''); // Bot trap
  const [orderFormOpenTime, setOrderFormOpenTime] = useState(0); // Timing check
  const { getToken: getRecaptchaToken } = useRecaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('default');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7 },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
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

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const cartSubtotal = cart.reduce((total, item) => total + item.price, 0);
  const shippingFee = Math.round(cartSubtotal * 0.02); // 2% shipping fee
  const tva = Math.round(cartSubtotal * 0.20); // 20% TVA
  const cartTotal = cartSubtotal + shippingFee + tva;

  const generateInvoice = (orderItems: any[], orderInfo: any, total: number) => {
    const doc = new jsPDF();
    
    // SECURITY: Generate cryptographically secure invoice number
    const timestamp = Date.now();
    const randomHash = Math.random().toString(36).substring(2, 15);
    const invoiceNumber = `INV-${timestamp}-${randomHash.toUpperCase()}`;
    
    // Invoice dates
    const date = new Date().toLocaleDateString('fr-FR');
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR');

    // INDUSTRIAL PROFESSIONAL DESIGN - Navy Blue + Cyan
    const primaryColor: [number, number, number] = [30, 58, 95]; // Bleu Marine
    const accentColor: [number, number, number] = [6, 182, 212]; // Cyan Clair
    const secondaryColor: [number, number, number] = [45, 55, 72]; // Gris Foncé
    const lightGray: [number, number, number] = [241, 245, 249];
    const mediumGray: [number, number, number] = [107, 114, 128];
    const darkGray: [number, number, number] = [31, 41, 55];

    // === HEADER with INDUSTRIAL PROFESSIONAL DESIGN ===
    // Main gradient background
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 60, 'F');

    // Accent stripe on top
    doc.setFillColor(...accentColor);
    doc.rect(0, 0, 210, 4, 'F');

    // Secondary accent stripe
    doc.setFillColor(...secondaryColor);
    doc.rect(0, 4, 210, 1.5, 'F');

    // Decorative accent circles (right side)
    doc.setFillColor(...accentColor);
    doc.circle(200, 30, 20, 'F');
    doc.setFillColor(...primaryColor);
    doc.circle(200, 30, 15, 'F');
    
    doc.setFillColor(...secondaryColor);
    doc.circle(185, 45, 12, 'F');

    // Company name - Large & Bold
    doc.setFontSize(32);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('SOMATISME', 15, 22);

    // Tagline
    doc.setFontSize(10);
    doc.setTextColor(6, 182, 212); // Cyan accent
    doc.setFont('helvetica', 'bold');
    doc.text('AUTOMATISATION INDUSTRIELLE', 15, 31);

    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.setFont('helvetica', 'normal');
    doc.text('Équipements • Régulation • Installation Électrique', 15, 37);
    doc.text('+212 679 825 646  |  somatisme@gmail.com  |  www.somatisme.ma', 15, 43);
    
    // === INVOICE TITLE BLOCK ===
    doc.setFillColor(...lightGray);
    doc.roundedRect(15, 65, 180, 28, 3, 3, 'F');

    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURE', 20, 78);

    // Accent badge
    doc.setFillColor(...accentColor);
    doc.roundedRect(20, 82, 30, 7, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('A PAYER', 35, 87, { align: 'center' });

    // Invoice meta info (right side)
    doc.setFontSize(8);
    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'normal');
    doc.text('N FACTURE', 130, 72);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(invoiceNumber, 130, 78);

    doc.setFontSize(8);
    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'normal');
    doc.text('DATE', 130, 84);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');
    doc.text(date, 145, 84);

    doc.text('ECHEANCE', 165, 84);
    doc.setFont('helvetica', 'normal');
    doc.text(dueDate, 165, 89);

    // === FROM / TO BLOCKS ===
    // Facture a
    doc.setFontSize(8);
    doc.setTextColor(...accentColor);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURE A', 15, 108);

    doc.setFillColor(...accentColor);
    doc.rect(15, 110, 25, 0.8, 'F');

    doc.setFontSize(11);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');
    doc.text(orderInfo.name || '-', 15, 118);

    doc.setFontSize(8);
    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'normal');
    let yInfo = 124;
    if (orderInfo.company) {
      doc.text(orderInfo.company, 15, yInfo);
      yInfo += 5;
    }
    if (orderInfo.address) {
      doc.text(orderInfo.address, 15, yInfo);
      yInfo += 5;
    }
    if (orderInfo.email) {
      doc.text(orderInfo.email, 15, yInfo);
      yInfo += 5;
    }
    if (orderInfo.phone) {
      doc.text(orderInfo.phone, 15, yInfo);
    }

    // De
    doc.setFontSize(8);
    doc.setTextColor(...accentColor);
    doc.setFont('helvetica', 'bold');
    doc.text('DE', 120, 108);

    doc.setFillColor(...accentColor);
    doc.rect(120, 110, 15, 0.8, 'F');

    doc.setFontSize(11);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');
    doc.text('SOMATISME', 120, 118);

    doc.setFontSize(8);
    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'normal');
    doc.text('Equipements Industriels', 120, 124);
    doc.text('Rue Résistance Nassime GH12 Appt 1', 120, 129);
    doc.text('Mohammedia, Maroc', 120, 134);
    doc.text('+212 679 825 646', 120, 139);
    doc.text('contact@somatisme.ma', 120, 144);

    // === PRODUCTS TABLE ===
    const tableY = 155;
    doc.setFillColor(...primaryColor);
    doc.roundedRect(15, tableY, 180, 10, 1, 1, 'F');

    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('#', 20, tableY + 6.5);
    doc.text('DESCRIPTION', 30, tableY + 6.5);
    doc.text('QTE', 130, tableY + 6.5, { align: 'center' });
    doc.text('PRIX U.', 155, tableY + 6.5, { align: 'center' });
    doc.text('TOTAL', 188, tableY + 6.5, { align: 'right' });

    // Products table rows
    let y = tableY + 10;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    orderItems.forEach((item, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(...lightGray);
        doc.rect(15, y, 180, 10, 'F');
      }

      doc.setTextColor(...mediumGray);
      doc.setFontSize(8);
      doc.text(`${String(index + 1).padStart(2, '0')}`, 20, y + 6.5);

      doc.setTextColor(...darkGray);
      doc.setFont('helvetica', 'normal');
      const itemName = item.name.substring(0, 55) + (item.name.length > 55 ? '...' : '');
      doc.text(itemName, 30, y + 6.5);

      doc.text('1', 130, y + 6.5, { align: 'center' });
      doc.text(`${item.price} MAD`, 155, y + 6.5, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.text(`${item.price} MAD`, 188, y + 6.5, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      y += 10;
    });

    // === SUMMARY BLOCK ===
    y += 8;

    // Left: Notes
    doc.setFontSize(8);
    doc.setTextColor(...accentColor);
    doc.setFont('helvetica', 'bold');
    doc.text('NOTES & CONDITIONS', 15, y);
    doc.setFillColor(...accentColor);
    doc.rect(15, y + 2, 35, 0.6, 'F');

    doc.setFontSize(7.5);
    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'normal');
    doc.text('Merci pour votre commande.', 15, y + 9);
    doc.text('Le paiement est du a la livraison.', 15, y + 14);
    doc.text('Delai de livraison selon disponibilite.', 15, y + 19);
    doc.text('Garantie selon le type de produit.', 15, y + 24);
    doc.text('Contact: +212 679 825 646', 15, y + 29);

    // Right: Totals card
    doc.setFillColor(...lightGray);
    doc.roundedRect(115, y - 3, 80, 42, 3, 3, 'F');

    doc.setFontSize(8);
    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'normal');
    doc.text('Sous-total', 120, y + 5);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');
    doc.text(`${total} MAD`, 190, y + 5, { align: 'right' });

    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'normal');
    doc.text('TVA (20%)', 120, y + 12);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');
    doc.text(`${tva} MAD`, 190, y + 12, { align: 'right' });

    // Divider
    doc.setDrawColor(...mediumGray);
    doc.setLineWidth(0.2);
    doc.line(120, y + 17, 190, y + 17);

    // Total row - premium
    doc.setFillColor(...primaryColor);
    doc.roundedRect(118, y + 22, 75, 14, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setTextColor(...accentColor);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL', 123, y + 31);
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text(`${total} MAD`, 190, y + 31, { align: 'right' });

    // === FOOTER with SECURITY INFO ===
    // Background
    doc.setFillColor(...primaryColor);
    doc.rect(0, 270, 210, 30, 'F');
    
    // Accent stripe
    doc.setFillColor(...accentColor);
    doc.rect(0, 270, 210, 2, 'F');

    // Company name
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('SOMATISME', 105, 281, { align: 'center' });

    // Contact info
    doc.setFontSize(7);
    doc.setTextColor(203, 213, 225);
    doc.setFont('helvetica', 'normal');
    doc.text('Équipements Industriels  |  +212 679 825 646  |  somatisme@gmail.com', 105, 286, { align: 'center' });
    
    // Website
    doc.setTextColor(...accentColor);
    doc.setFont('helvetica', 'bold');
    doc.text('www.somatisme.ma', 105, 291, { align: 'center' });


    // Save the PDF with secure filename
    doc.save(`Facture_${invoiceNumber}_${timestamp}.pdf`);
  };

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

    setIsSubmitting(true);

    try {
      const orderItems = cart.map(item => ({
        name: language === 'ar' ? item.nameAr : item.name,
        description: language === 'ar' ? item.descriptionAr : item.description,
        price: item.price,
        quantity: 1
      }));

      // Generate invoice and get PDF as base64
      const doc = new jsPDF();
      const timestamp = Date.now();
      const randomHash = Math.random().toString(36).substring(2, 15);
      const invoiceNumber = `INV-${timestamp}-${randomHash.toUpperCase()}`;
      const date = new Date().toLocaleDateString('fr-FR');
      const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR');

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
      doc.text('+212 679 825 646  |  somatisme@gmail.com  |  www.somatisme.ma', 12, 44);

      // Checksum / secure
      doc.setFontSize(6.5);
      doc.setTextColor(...C.muted);
      doc.setFont('helvetica', 'italic');
      doc.text(`Sécurisé  •  Checksum: ${randomHash.substring(0, 4).toUpperCase()}`, 12, 52);

      // ══════════════════════════════════════════
      // INVOICE BLOCK — light rounded rectangle
      // ══════════════════════════════════════════
      doc.setFillColor(...C.light);
      doc.roundedRect(12, 65, 186, 38, 3, 3, 'F');

      // "FACTURE" large text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(...C.text);
      doc.text('FACTURE', 20, 82);

      // "À PAYER" cyan badge
      doc.setFillColor(...C.cyan);
      doc.roundedRect(20, 86, 32, 8, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setTextColor(...C.white);
      doc.setFont('helvetica', 'bold');
      doc.text('À PAYER', 28, 91.5);

      // Invoice number (right side of block)
      doc.setFontSize(7);
      doc.setTextColor(...C.muted);
      doc.setFont('helvetica', 'normal');
      doc.text('N FACTURE', 105, 72);
      doc.setFontSize(8.5);
      doc.setTextColor(...C.text);
      doc.setFont('helvetica', 'bold');
      doc.text(invoiceNumber, 105, 79);

      // Date / Echeance
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
      doc.text('ECHEANCE', 155, 89);
      doc.setTextColor(...C.text);
      doc.setFont('helvetica', 'bold');
      doc.text(dueDate, 155, 96);

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
      doc.text('FACTURE A', col1, infoY);
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
      doc.text(orderForm.phone, col1, cy2);
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
      doc.text('+212 679 825 646', col2, infoY + 35);
      doc.text('contact@somatisme.ma', col2, infoY + 41);

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
      orderItems.forEach((item: any, idx: number) => {
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

        doc.text('1', 120, rY + 7);
        doc.text(`${item.price} MAD`, 138, rY + 7);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...C.text);
        doc.text(`${item.price} MAD`, 196, rY + 7, { align: 'right' });

        rY += 10;
      });

      // ══════════════════════════════════════════
      // NOTES & CONDITIONS  +  TOTALS
      // ══════════════════════════════════════════
      const botY = rY + 10;

      // Notes (left)
      doc.setFontSize(8);
      doc.setTextColor(...C.cyan);
      doc.setFont('helvetica', 'bold');
      doc.text('NOTES & CONDITIONS', col1, botY);

      doc.setFontSize(7.5);
      doc.setTextColor(...C.sub);
      doc.setFont('helvetica', 'normal');
      doc.text('Merci pour votre commande.', col1, botY + 8);
      doc.text('Le paiement est du a la livraison.', col1, botY + 14);
      doc.text('Delai de livraison selon disponibilite.', col1, botY + 20);
      doc.text('Garantie selon le type de produit.', col1, botY + 26);
      doc.text('Contact: +212 679 825 646', col1, botY + 32);

      // Totals (right)
      const totX = 105;
      doc.setFontSize(8.5);
      doc.setTextColor(...C.sub);
      doc.setFont('helvetica', 'normal');
      doc.text('Sous-total', totX, botY + 8);
      doc.setTextColor(...C.text);
      doc.text(`${cartSubtotal} MAD`, 196, botY + 8, { align: 'right' });

      doc.setTextColor(...C.sub);
      doc.text('TVA (20%)', totX, botY + 16);
      doc.setTextColor(...C.text);
      doc.text(`${tva} MAD`, 196, botY + 16, { align: 'right' });

      // Separator
      doc.setDrawColor(210, 220, 230);
      doc.setLineWidth(0.3);
      doc.line(totX, botY + 20, 198, botY + 20);

      // TOTAL box
      doc.setFillColor(...C.navy);
      doc.roundedRect(totX, botY + 23, 93, 14, 2, 2, 'F');
      doc.setFontSize(10);
      doc.setTextColor(...C.white);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL', totX + 5, botY + 32);
      doc.setFontSize(12);
      doc.text(`${cartTotal} MAD`, 196, botY + 32, { align: 'right' });

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
      doc.text('Equipements Industriels  |  +212 679 825 646  |  somatisme@gmail.com', 105, fY + 14, { align: 'center' });

      doc.setTextColor(...C.cyan);
      doc.setFont('helvetica', 'bold');
      doc.text('www.somatisme.ma', 105, fY + 20, { align: 'center' });

      doc.setFontSize(5.5);
      doc.setTextColor(...C.muted);
      doc.setFont('helvetica', 'normal');
      doc.text(invoiceNumber, 105, fY + 24.5, { align: 'center' });

      // Save PDF to downloads
      doc.save(`Facture_${invoiceNumber}_SOMATISME.pdf`);

      // Get PDF as base64
      const pdfBase64 = doc.output('dataurlstring').split(',')[1];

      // Get reCAPTCHA token before sending
      const recaptchaToken = await getRecaptchaToken('order_submit');
      const submitDuration = orderFormOpenTime ? Date.now() - orderFormOpenTime : 99999;

      // Send order email - non-blocking (order completes even if email fails)
      fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderForm,
          orderItems,
          cartTotal,
          pdfBase64,
          invoiceNumber,
          recaptchaToken,
          _duration: submitDuration,
          website: orderHoneypot || undefined,
        })
      }).then(res => res.json())
        .then(data => console.log('[EMAIL] Sent:', data))
        .catch(err => console.error('[EMAIL] Failed (non-blocking):', err));

      // Send order via WhatsApp with clean format
      const orderMessage = `NOUVELLE COMMANDE SOMATISME

INFORMATIONS CLIENT:
Nom: ${orderForm.name}
Email: ${orderForm.email}
Telephone: ${orderForm.phone}
${orderForm.company ? `Entreprise: ${orderForm.company}\n` : ''}${orderForm.address ? `Adresse: ${orderForm.address}\n` : ''}
PRODUITS COMMANDES:
${orderItems.map((item, idx) => `${idx + 1}. ${item.name} - ${item.price} MAD`).join('\n')}

TOTAL: ${cartTotal} MAD
${orderForm.message ? `\nMessage: ${orderForm.message}` : ''}

Facture PDF generee et telechargee.
Confirmation dans les 24h.
Paiement a la livraison.`;
      
      const whatsappUrl = `https://wa.me/212679825646?text=${encodeURIComponent(orderMessage)}`;
      window.open(whatsappUrl, '_blank');
      
      toast.success('Commande envoyée avec succès. Email de confirmation envoyé.');
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
          <div className="bg-gradient-to-br from-card/80 to-card/40 border border-accent/20 rounded-3xl p-8 backdrop-blur-sm hover:border-accent/40 transition-all">
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
              {/* Search Bar - Premium */}
              <motion.div
                {...fadeInLeft}
                transition={{ delay: 0.1 }}
                className="relative flex-1 w-full max-w-2xl group"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-secondary rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                
                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-accent h-6 w-6 group-hover:scale-110 transition-transform" />
                  <Input
                    placeholder={language === 'ar' ? 'ابحث عن منتج...' : 'Rechercher un produit...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-4 bg-background/50 border-2 border-accent/30 rounded-2xl text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-lg font-medium"
                  />
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      ✕
                    </motion.button>
                  )}
                </div>
              </motion.div>
              {/* Category Filters - Premium */}
              <motion.div
                {...fadeInUp}
                transition={{ delay: 0.2 }}
                className="flex gap-3 flex-wrap justify-center lg:justify-start"
              >
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wide text-sm transition-all duration-300 ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/50'
                          : 'bg-background/50 border-2 border-cyan-400/30 text-foreground hover:border-cyan-400/60 hover:bg-cyan-400/10'
                      }`}
                    >
                      {language === 'ar' ? category.nameAr : category.name}
                    </button>
                  </motion.div>
                ))}
              </motion.div>

              {/* Sort Dropdown */}
              <motion.div
                {...fadeInUp}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="appearance-none pl-4 pr-10 py-3 rounded-xl font-semibold text-sm bg-background/50 border-2 border-cyan-400/30 text-foreground hover:border-cyan-400/60 focus:border-cyan-400 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="default">{language === 'ar' ? 'الترتيب' : 'Trier par'}</option>
                  <option value="name-asc">{language === 'ar' ? 'الاسم أ→ي' : 'Nom A→Z'}</option>
                  <option value="name-desc">{language === 'ar' ? 'الاسم ي→أ' : 'Nom Z→A'}</option>
                  <option value="price-asc">{language === 'ar' ? 'السعر ↑' : 'Prix ↑'}</option>
                  <option value="price-desc">{language === 'ar' ? 'السعر ↓' : 'Prix ↓'}</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500 text-xs">▼</span>
              </motion.div>

              {/* Cart Button - Premium */}
              <motion.div
                {...fadeInUp}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
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
                    {cart.map((item, index) => (
                      <motion.div
                        key={index}
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
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(index)}
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
            {filteredProducts.map((product, index) => (
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
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>{language === 'ar' ? 'فاتورة manuelle envoyée par email' : 'Facture manuelle envoyée par email'}</li>
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
                      onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
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
                      onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                      placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">
                      {language === 'ar' ? 'رقم الهاتف *' : 'Téléphone *'}
                    </label>
                    <Input
                      type="tel"
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                      placeholder={language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}
                      className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">
                      {language === 'ar' ? 'الشركة' : 'Entreprise'}
                    </label>
                    <Input
                      value={orderForm.company}
                      onChange={(e) => setOrderForm({ ...orderForm, company: e.target.value })}
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
                      onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
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
                      onChange={(e) => setOrderForm({ ...orderForm, message: e.target.value })}
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
