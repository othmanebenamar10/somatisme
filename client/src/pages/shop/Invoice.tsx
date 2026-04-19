import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InvoiceTemplate from '@/components/InvoiceTemplate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function Invoice() {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: 'FAC-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerCompany: '',
    customerAddress: '',
    items: [] as Array<{
      name: string;
      description: string;
      quantity: number;
      price: number;
      total: number;
    }>,
    notes: ''
  });

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    quantity: 1,
    price: 0
  });

  const addItem = () => {
    if (!newItem.name || newItem.price <= 0) {
      toast.error('Veuillez remplir le nom et le prix');
      return;
    }

    const total = newItem.quantity * newItem.price;
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { ...newItem, total }]
    });
    setNewItem({ name: '', description: '', quantity: 1, price: 0 });
  };

  const removeItem = (index: number) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.filter((_, i) => i !== index)
    });
  };

  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.total, 0);
  const taxRate = 20;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => window.history.back()} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-3xl font-bold mb-2">Générateur de Facture</h1>
            <p className="text-muted-foreground">Créez des factures professionnelles pour vos clients</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-xl font-bold mb-4">Informations Client</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom du client *</label>
                    <Input
                      value={invoiceData.customerName}
                      onChange={(e) => setInvoiceData({ ...invoiceData, customerName: e.target.value })}
                      placeholder="Nom complet"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <Input
                      type="email"
                      value={invoiceData.customerEmail}
                      onChange={(e) => setInvoiceData({ ...invoiceData, customerEmail: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone *</label>
                    <Input
                      type="tel"
                      value={invoiceData.customerPhone}
                      onChange={(e) => setInvoiceData({ ...invoiceData, customerPhone: e.target.value })}
                      placeholder="06XXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Entreprise</label>
                    <Input
                      value={invoiceData.customerCompany}
                      onChange={(e) => setInvoiceData({ ...invoiceData, customerCompany: e.target.value })}
                      placeholder="Nom de l'entreprise"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Adresse</label>
                    <Textarea
                      value={invoiceData.customerAddress}
                      onChange={(e) => setInvoiceData({ ...invoiceData, customerAddress: e.target.value })}
                      placeholder="Adresse complète"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-xl font-bold mb-4">Ajouter un Article</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom du produit *</label>
                    <Input
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Nom du produit/service"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      placeholder="Description détaillée"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Quantité</label>
                      <Input
                        type="number"
                        min="1"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Prix unitaire (MAD) *</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <Button onClick={addItem} className="w-full">
                    Ajouter à la facture
                  </Button>
                </div>
              </div>

              {invoiceData.items.length > 0 && (
                <div className="bg-card p-6 rounded-lg border">
                  <h2 className="text-xl font-bold mb-4">Articles de la Facture</h2>
                  <div className="space-y-2">
                    {invoiceData.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted rounded">
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <p className="text-sm">{item.quantity} x {item.price.toFixed(2)} MAD</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold">{item.total.toFixed(2)} MAD</span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <span className="font-semibold">{subtotal.toFixed(2)} MAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVA (20%):</span>
                      <span className="font-semibold">{taxAmount.toFixed(2)} MAD</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                      <span>Total:</span>
                      <span className="text-blue-600">{total.toFixed(2)} MAD</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-xl font-bold mb-4">Notes</h2>
                <Textarea
                  value={invoiceData.notes}
                  onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                  placeholder="Notes ou conditions particulières"
                  rows={3}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4 print:hidden">
                <h2 className="text-xl font-bold">Aperçu de la Facture</h2>
                <Button onClick={handlePrint}>
                  <Download className="w-4 h-4 mr-2" />
                  Imprimer / PDF
                </Button>
              </div>
              <InvoiceTemplate
                invoiceNumber={invoiceData.invoiceNumber}
                invoiceDate={new Date()}
                dueDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                customerName={invoiceData.customerName}
                customerEmail={invoiceData.customerEmail}
                customerPhone={invoiceData.customerPhone}
                customerCompany={invoiceData.customerCompany}
                customerAddress={invoiceData.customerAddress}
                items={invoiceData.items}
                subtotal={subtotal}
                taxRate={taxRate}
                taxAmount={taxAmount}
                total={total}
                notes={invoiceData.notes}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
