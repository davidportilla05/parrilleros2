import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { MenuItem, CustomizationOption } from '../types';
import { useOrder } from '../context/OrderContext';
import { customizationOptions } from '../data/menu';

const CustomizationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { menuItem } = location.state as { menuItem: MenuItem };
  
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<CustomizationOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [withFries, setWithFries] = useState(false);
  const [withRusticFries, setWithRusticFries] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['proteinas'])); // Proteínas expanded by default
  const { addToCart } = useOrder();

  // Get all available customization options for hamburgers
  const availableOptions = customizationOptions;

  const toggleOption = (option: CustomizationOption) => {
    setSelectedOptions((prevOptions) => {
      const exists = prevOptions.some((item) => item.id === option.id);
      if (exists) {
        return prevOptions.filter((item) => item.id !== option.id);
      } else {
        return [...prevOptions, option];
      }
    });
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleAddToCart = () => {
    addToCart(menuItem, quantity, selectedOptions, withFries, specialInstructions);
    
    // Check if it's a burger to show suggestions
    const isBurgerCategory = menuItem.category.includes('burger');
    if (isBurgerCategory) {
      navigate('/suggestions');
    } else {
      navigate('/menu');
    }
  };

  const basePrice = withFries ? (menuItem.priceWithFries || menuItem.price) : menuItem.price;
  const optionsPrice = selectedOptions.reduce((sum, option) => sum + option.price, 0);
  const totalPrice = (basePrice + optionsPrice) * quantity;

  // Group options by type for better organization
  const proteinOptions = availableOptions.filter(opt => 
    opt.name.includes('CARNE') || opt.name.includes('CHORIZO') || opt.name.includes('TOCINETA')
  );
  
  const cheeseOptions = availableOptions.filter(opt => 
    opt.name.includes('QUESO')
  );
  
  const vegetableOptions = availableOptions.filter(opt => 
    opt.name.includes('CEBOLLA') || opt.name.includes('PIÑA') || opt.name.includes('PEPINILLOS') || 
    opt.name.includes('JALAPEÑOS') || opt.name.includes('AROS')
  );
  
  const otherOptions = availableOptions.filter(opt => 
    !proteinOptions.includes(opt) && !cheeseOptions.includes(opt) && !vegetableOptions.includes(opt)
  );

  const OptionGroup = ({ 
    id,
    title, 
    options, 
    icon,
    description 
  }: { 
    id: string;
    title: string; 
    options: CustomizationOption[]; 
    icon: string;
    description?: string;
  }) => {
    if (options.length === 0) return null;
    
    const isExpanded = expandedCategories.has(id);
    const selectedCount = options.filter(opt => selectedOptions.some(selected => selected.id === opt.id)).length;
    
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4 border border-gray-200">
        <button
          onClick={() => toggleCategory(id)}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-xl p-3 mr-4">
              <span className="text-2xl">{icon}</span>
            </div>
            <div className="text-left">
              <h4 className="text-xl font-bold text-gray-800 flex items-center">
                {title}
                {selectedCount > 0 && (
                  <span className="ml-3 bg-[#FF8C00] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {selectedCount} seleccionado{selectedCount > 1 ? 's' : ''}
                  </span>
                )}
              </h4>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {options.length} opciones disponibles
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {isExpanded ? (
              <ChevronUp size={24} className="text-gray-500" />
            ) : (
              <ChevronDown size={24} className="text-gray-500" />
            )}
          </div>
        </button>
        
        {isExpanded && (
          <div className="border-t border-gray-100 bg-gray-50">
            <div className="p-6 pt-4">
              <div className="grid grid-cols-1 gap-3">
                {options.map((option) => (
                  <label 
                    key={option.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-sm ${
  selectedOptions.some(opt => opt.id === option.id)
    ? 'border-[#FF8C00] bg-orange-50 shadow-sm'
    : 'border-gray-200 bg-white hover:border-gray-300'
}`}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedOptions.some(opt => opt.id === option.id)}
                        onChange={() => toggleOption(option)}
                        className="w-5 h-5 accent-[#FF8C00] mr-4"
                      />
                      <span className="text-gray-800 font-medium">
                        {option.name.replace('AD ', '')}
                      </span>
                    </div>
                    {option.price > 0 && (
                      <span className="font-bold text-[#FF8C00]">
                        +${option.price.toLocaleString()}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <button
            onClick={() => navigate('/menu')}
            className="mr-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Personalizar Producto</h1>
            <p className="text-gray-600">Agrega tus ingredientes favoritos</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
{/* Product Header */}
<div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-200">
  <div className="grid grid-cols-1 lg:grid-cols-2">

    {/* Image Section */}
    <div className="relative h-64 lg:h-80 overflow-hidden">
      <img
        src={menuItem.image}
        alt={menuItem.name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
      <div className="absolute top-4 right-4 bg-white/90 text-[#FF8C00] text-base font-semibold px-3 py-1 rounded-full shadow-sm">
        ${menuItem.price.toLocaleString()}
      </div>
    </div>

    {/* Information Section */}
    <div className="p-6 flex flex-col justify-center bg-white">
      {/* Categoría */}
      <span className="text-sm text-[#FF8C00] uppercase font-semibold tracking-wider mb-2">
        {menuItem.category.includes('classic') ? 'Clásica' :
         menuItem.category.includes('deluxe') ? 'Deluxe' :
         menuItem.category.includes('contest') ? 'Burger Master' : 'Hamburguesa'}
      </span>

      {/* Nombre del producto */}
      <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
        {menuItem.name}
      </h2>

      {/* Descripción */}
      <p className="text-base text-gray-700 leading-relaxed">
        {menuItem.description}
      </p>

      {/* Precio con papas */}
      {menuItem.priceWithFries && (
        <div className="mt-4 border border-gray-200 rounded-lg p-3 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-800 font-medium">🍟 Con papas francesas:</span>
            <span className="text-[#FF8C00] font-bold">
              ${menuItem.priceWithFries.toLocaleString()}
            </span>
          </div>
        </div>
      )}
            {/* Precio con papas */}
      {menuItem.priceWithFries && (
        <div className="mt-4 border border-gray-200 rounded-lg p-3 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-800 font-medium">🍟 Con papas rusticas:</span>
            <span className="text-[#FF8C00] font-bold">
              ${menuItem.priceWithFries.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  </div>
</div>





        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customization Options */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Fries option - prominent placement */}
              {menuItem.priceWithFries && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="text-2xl mr-3">🍟</span>
                    Agregar Papas
                  </h3>
                  {/* Opción 1: Papas Francesas */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-sm ${
                      withFries
                        ? 'border-[#FF8C00] bg-orange-50 shadow-md scale-[1.01]'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    } transition-transform duration-200 ease-in-out`}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={withFries}
                        onChange={() => setWithFries(!withFries)}
                        className="w-5 h-5 accent-[#FF8C00] mr-4"
                      />
                      <div>
                        <span className="text-lg font-bold text-gray-800">Papas Francesas</span>
                        <p className="text-sm text-gray-600">Crujientes, doradas y clásicas</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#FF8C00] text-lg">
                      +${((menuItem.priceWithFries || menuItem.price) - menuItem.price).toLocaleString()}
                    </span>
                  </label>

                  {/* Opción 2: Papas Rústicas */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-sm ${
                      withRusticFries
                        ? 'border-[#FF8C00] bg-orange-50 shadow-md scale-[1.01]'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    } transition-transform duration-200 ease-in-out mt-4`}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={withFries}
                        onChange={() => setWithFries(!withFries)}
                        className="w-5 h-5 accent-[#FF8C00] mr-4"
                      />
                      <div>
                        <span className="text-lg font-bold text-gray-800">Papas Rústicas</span>
                        <p className="text-sm text-gray-600">Más gruesas, doradas y con cáscara</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#FF8C00] text-lg">
                      +${((menuItem.priceWithFries || menuItem.price) - menuItem.price).toLocaleString()}
                    </span>
                  </label>

                </div>
              )}

              {/* Organized customization options with dropdowns */}
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Personaliza tu Hamburguesa</h3>
                  <p className="text-gray-600">Selecciona los ingredientes adicionales que desees</p>
                </div>

                <OptionGroup 
                  id="proteinas"
                  title="Proteínas Adicionales" 
                  options={proteinOptions} 
                  icon="🥩"
                  description="Agrega más proteína a tu hamburguesa"
                />
                
                <OptionGroup 
                  id="quesos"
                  title="Quesos Premium" 
                  options={cheeseOptions} 
                  icon="🧀"
                  description="Diferentes tipos de queso para tu hamburguesa"
                />
                
                <OptionGroup 
                  id="vegetales"
                  title="Vegetales y Extras" 
                  options={vegetableOptions} 
                  icon="🥬"
                  description="Vegetales frescos y extras crujientes"
                />
                
                <OptionGroup 
                  id="otros"
                  title="Otros Complementos" 
                  options={otherOptions} 
                  icon="➕"
                  description="Complementos especiales para tu hamburguesa"
                />
              </div>
              
              {/* Special instructions */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-3">📝</span>
                  Instrucciones Especiales
                </h4>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Ej: Sin cebolla, salsa aparte, término de la carne..."
                  className="w-full p-4 border-2 border-gray-200 rounded-lg resize-none h-24 focus:ring-2 focus:ring-[#FF8C00] focus:border-[#FF8C00] transition-colors"
                />
                <p className="text-sm text-gray-500 mt-2">
                  💡 Comparte cualquier preferencia especial para tu pedido
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary - Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Resumen del Pedido</h3>
              
              {/* Product image and name */}
              <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                <img 
                  src={menuItem.image} 
                  alt={menuItem.name} 
                  className="w-16 h-16 object-cover rounded-lg mr-3"
                />
                <div>
                  <h4 className="font-bold text-gray-800">{menuItem.name}</h4>
                  {withFries && (
                    <span className="text-sm text-[#FF8C00] font-medium">+ Papas Francesas</span>
                  )}
                </div>
              </div>
              
              {/* Selected customizations */}
              {selectedOptions.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Extras seleccionados:</h5>
                  <div className="space-y-1">
                    {selectedOptions.map((option) => (
                      <div key={option.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">+ {option.name.replace('AD ', '')}</span>
                        <span className="text-[#FF8C00] font-medium">+${option.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Price breakdown */}
              <div className="space-y-3 mb-6 border-t pt-4">
                <div className="flex justify-between">
                  <span>Precio base:</span>
                  <span className="font-medium">${basePrice.toLocaleString()}</span>
                </div>
                {optionsPrice > 0 && (
                  <div className="flex justify-between">
                    <span>Extras:</span>
                    <span className="font-medium">+${optionsPrice.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-[#FF8C00]">${Math.round(totalPrice).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-medium">Cantidad:</span>
                <div className="flex items-center bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-l-lg transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-r-lg transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-[#FF8C00] text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPage;