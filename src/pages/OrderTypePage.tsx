import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const OrderTypePage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, total } = useOrder();
  const [selectedType, setSelectedType] = useState<'delivery' | 'pickup' | null>(null);

  const handleBack = () => {
    navigate('/cart');
  };

  const handleContinue = () => {
    if (!selectedType) return;
    
    if (selectedType === 'delivery') {
      navigate('/delivery-form');
    } else {
      navigate('/pickup-form');
    }
  };

  const handleTypeSelect = (type: 'delivery' | 'pickup') => {
    setSelectedType(type);
    // Auto-navigate after selection
    setTimeout(() => {
      if (type === 'delivery') {
        navigate('/delivery-form');
      } else {
        navigate('/pickup-form');
      }
    }, 500);
  };

  const orderTypes = [
    {
      id: 'delivery' as const,
      title: 'Entrega a Domicilio',
      subtitle: 'Te llevamos tu pedido hasta tu puerta',
      icon: <Truck size={48} className="text-[#FF8C00]" />,
      features: [
        'Entrega en 45-60 minutos',
        'Cobertura en toda la ciudad',
        'Seguimiento del pedido',
        'Pago contra entrega'
      ],
      color: 'border-[#FF8C00] bg-orange-50',
      priceText: `$${total.toLocaleString()} + domicilio`
    },
    {
      id: 'pickup' as const,
      title: 'Recoger en el Lugar',
      subtitle: 'Recoge tu pedido en nuestra sede',
      icon: <MapPin size={48} className="text-green-600" />,
      features: [
        'Listo en 15-20 minutos',
        'Sin costo de envío',
        'Producto más fresco',
        'Atención personalizada'
      ],
      color: 'border-green-600 bg-green-50',
      priceText: `$${total.toLocaleString()}`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md p-4">
        <div className="max-w-4xl mx-auto flex items-center">
          <button
            onClick={handleBack}
            className="mr-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">¿Cómo quieres recibir tu pedido?</h1>
            <p className="text-gray-600">Elige la opción que más te convenga</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Resumen de tu pedido</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} producto{cart.length !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-gray-500">
                {cart.map(item => item.menuItem.name).join(', ')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#FF8C00]">
                ${total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Order Type Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {orderTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => handleTypeSelect(type.id)}
              className={`relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] border-2 ${
                selectedType === type.id
                  ? type.color + ' shadow-xl scale-[1.02]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {selectedType === type.id && (
                <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    {type.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{type.title}</h3>
                    <p className="text-gray-600">{type.subtitle}</p>
                  </div>
                </div>

                {/* Price Display */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Total a pagar:</p>
                    <p className="text-2xl font-bold text-[#FF8C00]">
                      {type.id === 'delivery' ? `$${total.toLocaleString()} + domicilio` : `$${total.toLocaleString()}`}
                    </p>
                    {type.id === 'delivery' && (
                      <p className="text-xs text-gray-500 mt-1">*Costo de domicilio según zona</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {type.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {type.id === 'delivery' && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <Clock size={20} className="text-blue-600 mr-2" />
                      <span className="text-sm text-blue-800 font-medium">
                        Tiempo estimado: 45-60 minutos
                      </span>
                    </div>
                  </div>
                )}

                {type.id === 'pickup' && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <Clock size={20} className="text-green-600 mr-2" />
                      <span className="text-sm text-green-800 font-medium">
                        Listo para recoger: 15-20 minutos
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-blue-100 rounded-full p-3 mr-3">
              <span className="text-2xl">👆</span>
            </div>
            <h3 className="text-lg font-bold text-blue-800">¡Selecciona tu opción preferida!</h3>
          </div>
          <p className="text-blue-700">
            Haz clic en cualquiera de las opciones de arriba para continuar automáticamente
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderTypePage;