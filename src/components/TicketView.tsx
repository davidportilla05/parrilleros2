import React, { useRef, useEffect } from 'react';
import { Check, Printer, Download, Share2, Home, Clock, MapPin, Phone, Receipt } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import OrderSummary from './OrderSummary';
import { generateInvoicePDF } from '../utils/pdfGenerator';

interface TicketViewProps {
  onDone: () => void;
}

const TicketView: React.FC<TicketViewProps> = ({ onDone }) => {
  const { orderNumber, cart, total, currentOrder } = useOrder();
  const ticketRef = useRef<HTMLDivElement>(null);
  
  // Simulate printing animation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (ticketRef.current) {
        ticketRef.current.classList.remove('translate-y-full', 'opacity-0');
        ticketRef.current.classList.add('translate-y-0', 'opacity-100');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = () => {
    if (ticketRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Ticket Parrilleros #${orderNumber.toString().padStart(3, '0')}</title>
              <style>
                @page { 
                  margin: 15mm; 
                  size: A4; 
                }
                
                body { 
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                  font-size: 11px; 
                  line-height: 1.5; 
                  margin: 0; 
                  padding: 0;
                  color: #333;
                  background: white;
                }
                
                .invoice-container {
                  max-width: 800px;
                  margin: 0 auto;
                  background: white;
                  box-shadow: 0 0 20px rgba(0,0,0,0.1);
                  border: 1px solid #ddd;
                }
                
                .header { 
                  background: linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%);
                  color: white;
                  padding: 25px;
                  text-align: center;
                  position: relative;
                }
                
                .header::after {
                  content: '';
                  position: absolute;
                  bottom: -10px;
                  left: 0;
                  right: 0;
                  height: 10px;
                  background: linear-gradient(45deg, transparent 50%, #FF8C00 50%);
                  background-size: 20px 20px;
                }
                
                .company-name {
                  font-size: 28px;
                  font-weight: bold;
                  margin-bottom: 5px;
                  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                  letter-spacing: 2px;
                }
                
                .company-tagline {
                  font-size: 14px;
                  opacity: 0.9;
                  font-weight: 300;
                  letter-spacing: 1px;
                }
                
                .invoice-title {
                  background: #f8f9fa;
                  border-left: 5px solid #FF8C00;
                  padding: 20px;
                  margin: 20px 0;
                }
                
                .invoice-number {
                  font-size: 24px;
                  font-weight: bold;
                  color: #FF8C00;
                  margin-bottom: 5px;
                }
                
                .invoice-date {
                  color: #666;
                  font-size: 12px;
                }
                
                .info-section {
                  display: flex;
                  justify-content: space-between;
                  margin: 30px 0;
                  gap: 30px;
                }
                
                .info-box {
                  flex: 1;
                  background: #f8f9fa;
                  border: 1px solid #e9ecef;
                  border-radius: 8px;
                  padding: 20px;
                }
                
                .info-title {
                  font-weight: bold;
                  color: #FF8C00;
                  font-size: 14px;
                  margin-bottom: 15px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  border-bottom: 2px solid #FF8C00;
                  padding-bottom: 5px;
                }
                
                .info-content {
                  line-height: 1.6;
                }
                
                .info-content p {
                  margin: 8px 0;
                  color: #555;
                }
                
                .items-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 30px 0;
                  background: white;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                  border-radius: 8px;
                  overflow: hidden;
                }
                
                .items-table th {
                  background: linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%);
                  color: white;
                  padding: 15px;
                  text-align: left;
                  font-weight: bold;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  font-size: 11px;
                }
                
                .items-table td {
                  padding: 15px;
                  border-bottom: 1px solid #e9ecef;
                  vertical-align: top;
                }
                
                .items-table tr:nth-child(even) {
                  background: #f8f9fa;
                }
                
                .items-table tr:hover {
                  background: #fff3e0;
                }
                
                .item-name {
                  font-weight: bold;
                  color: #333;
                  margin-bottom: 5px;
                }
                
                .item-extras {
                  font-size: 10px;
                  color: #666;
                  font-style: italic;
                  margin-top: 3px;
                }
                
                .item-instructions {
                  font-size: 10px;
                  color: #888;
                  margin-top: 3px;
                  background: #f0f0f0;
                  padding: 3px 6px;
                  border-radius: 3px;
                }
                
                .price {
                  font-weight: bold;
                  color: #FF8C00;
                  text-align: right;
                }
                
                .totals-section {
                  background: #f8f9fa;
                  border: 2px solid #e9ecef;
                  border-radius: 8px;
                  padding: 25px;
                  margin: 30px 0;
                  max-width: 400px;
                  margin-left: auto;
                }
                
                .totals-title {
                  font-size: 16px;
                  font-weight: bold;
                  color: #333;
                  margin-bottom: 15px;
                  text-align: center;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                
                .total-row {
                  display: flex;
                  justify-content: space-between;
                  margin: 10px 0;
                  padding: 8px 0;
                }
                
                .total-row.subtotal {
                  border-bottom: 1px solid #ddd;
                }
                
                .total-row.final {
                  border-top: 2px solid #FF8C00;
                  font-size: 18px;
                  font-weight: bold;
                  color: #FF8C00;
                  background: white;
                  margin-top: 15px;
                  padding: 15px 0;
                  border-radius: 5px;
                }
                
                .payment-info {
                  background: #e3f2fd;
                  border: 1px solid #2196f3;
                  border-radius: 8px;
                  padding: 20px;
                  margin: 30px 0;
                  text-align: center;
                }
                
                .payment-title {
                  font-weight: bold;
                  color: #1976d2;
                  margin-bottom: 10px;
                  font-size: 14px;
                }
                
                .pickup-info {
                  background: #e8f5e8;
                  border: 1px solid #4caf50;
                  border-radius: 8px;
                  padding: 20px;
                  margin: 30px 0;
                  text-align: center;
                }
                
                .pickup-title {
                  font-weight: bold;
                  color: #2e7d32;
                  margin-bottom: 10px;
                  font-size: 14px;
                }
                
                .footer {
                  background: #333;
                  color: white;
                  padding: 25px;
                  text-align: center;
                  margin-top: 40px;
                }
                
                .footer-title {
                  font-size: 16px;
                  font-weight: bold;
                  margin-bottom: 10px;
                }
                
                .footer-text {
                  font-size: 11px;
                  opacity: 0.8;
                  line-height: 1.6;
                }
                
                .qr-section {
                  text-align: center;
                  margin: 30px 0;
                  padding: 20px;
                  background: #f8f9fa;
                  border-radius: 8px;
                }
                
                .qr-placeholder {
                  width: 80px;
                  height: 80px;
                  border: 2px solid #ddd;
                  margin: 0 auto 10px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 10px;
                  color: #666;
                  background: white;
                }
                
                .watermark {
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) rotate(-45deg);
                  font-size: 120px;
                  color: rgba(255, 140, 0, 0.05);
                  font-weight: bold;
                  z-index: -1;
                  pointer-events: none;
                }
                
                @media print {
                  .invoice-container {
                    box-shadow: none;
                    border: none;
                  }
                  
                  .watermark {
                    position: absolute;
                  }
                }
              </style>
            </head>
            <body>
              <div class="watermark">PARRILLEROS</div>
              <div class="invoice-container">
                <!-- Header -->
                <div class="header">
                  <div class="company-name">PARRILLEROS</div>
                  <div class="company-tagline">FAST FOOD - Hamburguesas Artesanales</div>
                </div>
                
                <!-- Invoice Title -->
                <div class="invoice-title">
                  <div class="invoice-number">COMPROBANTE DE PEDIDO #${orderNumber.toString().padStart(3, '0')}</div>
                  <div class="invoice-date">${new Date().toLocaleDateString('es-CO', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} - ${new Date().toLocaleTimeString('es-CO')}</div>
                </div>
                
                <!-- Info Section -->
                <div class="info-section">
                  <div class="info-box">
                    <div class="info-title">🏪 Información del Kiosco</div>
                    <div class="info-content">
                      <p><strong>Parrilleros Fast Food</strong></p>
                      <p>Sistema de Autoservicio</p>
                      <p>📞 Ver sedes disponibles</p>
                      <p>🌐 Pedido realizado en kiosco</p>
                    </div>
                  </div>
                  
                  <div class="info-box">
                    <div class="info-title">📋 Detalles del Pedido</div>
                    <div class="info-content">
                      <p><strong>Tipo:</strong> Recogida en sede</p>
                      <p><strong>Estado:</strong> En preparación</p>
                      <p><strong>Tiempo estimado:</strong> 15-20 min</p>
                      <p><strong>Productos:</strong> ${cart.length} item${cart.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Items Table -->
                <table class="items-table">
                  <thead>
                    <tr>
                      <th style="width: 5%">#</th>
                      <th style="width: 50%">Producto</th>
                      <th style="width: 10%">Cant.</th>
                      <th style="width: 15%">Precio Unit.</th>
                      <th style="width: 20%">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${cart.map((item, index) => {
                      const basePrice = item.withFries ? (item.menuItem.priceWithFries || item.menuItem.price) : item.menuItem.price;
                      const customizationsTotal = item.customizations.reduce((sum, option) => sum + option.price, 0);
                      const unitPrice = basePrice + customizationsTotal;
                      const itemTotal = unitPrice * item.quantity;
                      
                      return `
                        <tr>
                          <td style="text-align: center; font-weight: bold;">${index + 1}</td>
                          <td>
                            <div class="item-name">${item.menuItem.name}${item.withFries ? ' + Papas Francesas' : ''}</div>
                            ${item.customizations.length > 0 ? `
                              <div class="item-extras">+ ${item.customizations.map(c => c.name.replace('AD ', '')).join(', ')}</div>
                            ` : ''}
                            ${item.specialInstructions ? `
                              <div class="item-instructions">📝 ${item.specialInstructions}</div>
                            ` : ''}
                          </td>
                          <td style="text-align: center; font-weight: bold;">${item.quantity}</td>
                          <td class="price">$${unitPrice.toLocaleString()}</td>
                          <td class="price">$${itemTotal.toLocaleString()}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
                
                <!-- Totals Section -->
                <div class="totals-section">
                  <div class="totals-title">💰 Resumen de Costos</div>
                  <div class="total-row subtotal">
                    <span>Subtotal:</span>
                    <span>$${Math.round(subtotal).toLocaleString()}</span>
                  </div>
                  <div class="total-row">
                    <span>INC (8%):</span>
                    <span>$${Math.round(inc).toLocaleString()}</span>
                  </div>
                  <div class="total-row final">
                    <span>TOTAL A PAGAR:</span>
                    <span>$${Math.round(total).toLocaleString()}</span>
                  </div>
                </div>
                
                <!-- Payment Info -->
                <div class="payment-info">
                  <div class="payment-title">💳 Información de Pago</div>
                  <p><strong>Forma de pago:</strong> Por definir en sede</p>
                  <p>Puedes pagar en efectivo o con tarjeta al recoger</p>
                </div>
                
                <!-- Pickup Info -->
                <div class="pickup-info">
                  <div class="pickup-title">🏪 Información de Recogida</div>
                  <p><strong>Tiempo estimado:</strong> 15-20 minutos</p>
                  <p><strong>Estado:</strong> En preparación</p>
                  <p>Presenta este comprobante al recoger tu pedido</p>
                </div>
                
                <!-- QR Section -->
                <div class="qr-section">
                  <div class="qr-placeholder">
                    QR CODE<br>
                    PEDIDO<br>
                    #${orderNumber.toString().padStart(3, '0')}
                  </div>
                  <p style="font-size: 10px; color: #666;">Código QR para seguimiento del pedido</p>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                  <div class="footer-title">¡Gracias por tu preferencia!</div>
                  <div class="footer-text">
                    PARRILLEROS FAST FOOD - Hamburguesas artesanales a la parrilla<br>
                    Síguenos en redes sociales para promociones especiales<br>
                    Comprobante generado automáticamente el ${new Date().toLocaleString('es-CO')}
                  </div>
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownload = () => {
    // Cálculos de impuestos corregidos - INC en lugar de IVA
    const subtotal = total * 0.92; // Base gravable (92%)
    const inc = total * 0.08; // INC (8%)

    const invoiceData = {
      orderNumber,
      customerName: 'Cliente Kiosco',
      customerPhone: 'N/A',
      customerEmail: undefined,
      customerCedula: undefined,
      address: 'RECOGIDA EN SEDE',
      neighborhood: 'Kiosco',
      locationName: 'Parrilleros Fast Food',
      locationAddress: 'Sede Principal',
      locationPhone: 'Ver sedes disponibles',
      items: cart,
      subtotal: Math.round(subtotal),
      iva: Math.round(inc), // Using iva field for INC
      total: Math.round(total),
      paymentMethod: 'Por definir',
      requiresInvoice: false,
      date: new Date()
    };

    generateInvoicePDF(invoiceData);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Pedido Parrilleros #${orderNumber.toString().padStart(3, '0')}`,
      text: `¡Mi pedido en Parrilleros está listo! Pedido #${orderNumber.toString().padStart(3, '0')} - Total: $${Math.round(total).toLocaleString()}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `${shareData.text} - ${shareData.url}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('¡Enlace copiado al portapapeles!');
      });
    }
  };

  // Cálculos de impuestos corregidos - INC en lugar de IVA
  const subtotal = total * 0.92; // Base gravable (92%)
  const inc = total * 0.08; // INC (8%)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center mb-6 border border-green-200">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gray-800">¡Pedido Completado!</h2>
          <div className="bg-gradient-to-r from-[#FF8C00] to-orange-600 text-white px-6 py-3 rounded-full inline-block mb-4">
            <span className="text-lg font-bold">Pedido #{orderNumber.toString().padStart(3, '0')}</span>
          </div>
          
          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-center mb-2">
                <Clock size={20} className="text-blue-600 mr-2" />
                <span className="font-bold text-blue-800">Tiempo</span>
              </div>
              <p className="text-xl font-bold text-blue-600">15-20 min</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-center mb-2">
                <Receipt size={20} className="text-green-600 mr-2" />
                <span className="font-bold text-green-800">Total</span>
              </div>
              <p className="text-xl font-bold text-green-600">${Math.round(total).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Detailed Ticket */}
        <div 
          ref={ticketRef}
          className="bg-white rounded-2xl shadow-2xl transition-all duration-1000 ease-out transform translate-y-full opacity-0 border border-gray-200"
        >
          <div className="p-8">
            {/* Ticket Header */}
            <div className="text-center border-b-2 border-dashed border-gray-300 pb-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-[#FF8C00] rounded-full p-3 mr-3">
                  <Receipt size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl font-heavyrust-primary text-gray-800">PARRILLEROS</h3>
                  <p className="text-gray-600 text-sm font-bebas-neue-primary">FAST FOOD</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Fecha:</span>
                    <p className="font-medium">{new Date().toLocaleDateString('es-CO')}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Hora:</span>
                    <p className="font-medium">{new Date().toLocaleTimeString('es-CO')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Details */}
            <div className="mb-6">
              <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                <div className="bg-blue-100 rounded-lg p-2 mr-3">
                  <Receipt size={16} className="text-blue-600" />
                </div>
                Detalles del Pedido
              </h4>
              
              <div className="space-y-3">
                {cart.map((item, index) => {
                  const basePrice = item.withFries ? (item.menuItem.priceWithFries || item.menuItem.price) : item.menuItem.price;
                  const customizationsTotal = item.customizations.reduce((sum, option) => sum + option.price, 0);
                  const itemTotal = (basePrice + customizationsTotal) * item.quantity;
                  
                  return (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-800">
                            {index + 1}. {item.menuItem.name}
                            {item.withFries && ' + Papas'}
                          </h5>
                          <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                        </div>
                        <span className="font-bold text-[#FF8C00] text-lg">
                          ${Math.round(itemTotal).toLocaleString()}
                        </span>
                      </div>
                      
                      {item.customizations.length > 0 && (
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Extras: </span>
                          {item.customizations.map(c => c.name.replace('AD ', '')).join(', ')}
                        </div>
                      )}
                      
                      {item.specialInstructions && (
                        <div className="text-sm text-gray-600 italic">
                          <span className="font-medium">Instrucciones: </span>
                          {item.specialInstructions}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t-2 border-dashed border-gray-300 pt-6 mb-6">
              <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                <div className="bg-green-100 rounded-lg p-2 mr-3">
                  <Receipt size={16} className="text-green-600" />
                </div>
                Resumen de Costos
              </h4>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-medium">${Math.round(subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>INC (8%):</span>
                  <span className="font-medium">${Math.round(inc).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between font-bold text-xl">
                    <span className="text-gray-800">TOTAL:</span>
                    <span className="text-[#FF8C00]">${Math.round(total).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <Clock size={20} className="text-blue-600 mr-2" />
                <span className="font-bold text-blue-800">Instrucciones Importantes</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Conserva este comprobante hasta recibir tu pedido</li>
                <li>• Tiempo estimado de preparación: 15-20 minutos</li>
                <li>• Te llamaremos cuando esté listo</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={handleDownload}
                  className="flex flex-col items-center justify-center py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={20} className="mb-1" />
                  <span className="text-xs">Descargar</span>
                </button>
                
                <button
                  onClick={handlePrint}
                  className="flex flex-col items-center justify-center py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Printer size={20} className="mb-1" />
                  <span className="text-xs">Imprimir</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center justify-center py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Share2 size={20} className="mb-1" />
                  <span className="text-xs">Compartir</span>
                </button>
              </div>
              
              <button
                onClick={onDone}
                className="w-full py-4 bg-gradient-to-r from-[#FF8C00] to-orange-600 text-white font-bold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
              >
                <Home size={24} className="mr-2" />
                Finalizar y Volver al Inicio
              </button>
            </div>
          </div>
          
          {/* Decorative bottom border */}
          <div className="h-4 w-full overflow-hidden relative bg-gray-100">
            <div className="absolute w-full h-8 left-0" style={{ 
              backgroundImage: 'radial-gradient(circle at 10px -4px, transparent 14px, white 16px)',
              backgroundSize: '20px 20px',
              backgroundPosition: 'bottom',
              backgroundRepeat: 'repeat-x'
            }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketView;