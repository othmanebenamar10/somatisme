import { FileText, Globe, Mail, Phone, MapPin } from 'lucide-react';

interface InvoiceItem {
  name: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface InvoiceProps {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string;
  customerAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  total: number;
  notes?: string;
}

export default function InvoiceTemplate({
  invoiceNumber,
  invoiceDate,
  dueDate,
  customerName,
  customerEmail,
  customerPhone,
  customerCompany,
  customerAddress,
  items,
  subtotal,
  taxRate = 0,
  taxAmount = 0,
  total,
  notes
}: InvoiceProps) {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 border-b pb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-600 mb-2">SOMATISME</h1>
          <p className="text-sm text-gray-600">Solutions d'Automatisme Industriel</p>
          <p className="text-sm text-gray-600">Régulation, Installation Électrique, Maintenance</p>
          <div className="mt-4 text-sm">
            <p className="font-semibold">Contact:</p>
            <p>Email: info@somatisme.ma</p>
            <p>Tél: 05 23 30 28 29</p>
            <p>WhatsApp: +212 679 825 646</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">FACTURE</h2>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">N° Facture:</span> {invoiceNumber}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Date:</span> {invoiceDate.toLocaleDateString('fr-FR')}
          </p>
          {dueDate && (
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Date d'échéance:</span> {dueDate.toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold text-lg mb-2">Facturé à:</h3>
        <p className="font-semibold">{customerName}</p>
        {customerCompany && <p className="text-gray-600">{customerCompany}</p>}
        <p className="text-gray-600">{customerEmail}</p>
        <p className="text-gray-600">{customerPhone}</p>
        {customerAddress && <p className="text-gray-600">{customerAddress}</p>}
      </div>

      {/* Invoice Items */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-center">Quantité</th>
              <th className="p-3 text-right">Prix Unitaire</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-3">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-right">{item.price.toFixed(2)} MAD</td>
                <td className="p-3 text-right font-semibold">{item.total.toFixed(2)} MAD</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Sous-total:</span>
            <span className="font-semibold">{subtotal.toFixed(2)} MAD</span>
          </div>
          {taxRate > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-600">TVA ({taxRate}%):</span>
              <span className="font-semibold">{taxAmount.toFixed(2)} MAD</span>
            </div>
          )}
          <div className="flex justify-between py-3 border-t-2 border-blue-600">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-bold text-lg text-blue-600">{total.toFixed(2)} MAD</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold mb-2">Notes:</h3>
          <p className="text-sm text-gray-600">{notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t pt-8 text-center text-sm text-gray-600">
        <p className="font-semibold mb-2">Conditions de paiement:</p>
        <p>Paiement dû à réception pour les paiements en face-à-face</p>
        <p>Pour toute question concernant cette facture, contactez-nous à info@somatisme.ma</p>
        <p className="mt-4">Merci de votre confiance!</p>
      </div>
    </div>
  );
}

// Example usage:
/*
const sampleInvoice: InvoiceProps = {
  invoiceNumber: 'FAC-2024-001',
  invoiceDate: new Date(),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  customerName: 'Jean Dupont',
  customerEmail: 'jean.dupont@example.com',
  customerPhone: '0612345678',
  customerCompany: 'ABC Industrie',
  customerAddress: '123 Rue de l\'Industrie, Casablanca',
  items: [
    {
      name: 'Automate Programmable Siemens S7-1200',
      description: '14 entrées/10 sorties, communication PROFINET',
      quantity: 2,
      price: 12500,
      total: 25000
    },
    {
      name: 'Variateur de Vitesse ABB ACS580',
      description: 'Puissance 7.5kW, contrôle vectoriel',
      quantity: 1,
      price: 18500,
      total: 18500
    }
  ],
  subtotal: 43500,
  taxRate: 20,
  taxAmount: 8700,
  total: 52200,
  notes: 'Livraison prévue dans 5 jours ouvrables.'
};

// To use:
// <InvoiceTemplate {...sampleInvoice} />
*/
