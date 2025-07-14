import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ArrowRight, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { MenuItem } from '../types';
import { useOrder } from '../context/OrderContext';
import { menuItems } from '../data/menu';

const SuggestionsPage: React.FC = () => {
  const { addToCart } = useOrder();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['gaseosas'])); // Gaseosas expanded by default

  const sides = menuItems.filter((item) => item.category === 'sides');
  const drinks = menuItems.filter((item) => item.category === 'drinks');

  const handleAddItem = (item: MenuItem) => {
    addToCart(item, 1, [], false, '');
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.add(item.id);
      return newSet;
    });
  };

  const handleContinue = () => {
    navigate('/cart');
  };

  const handleSkip = () => {
    navigate('/cart');
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

  // Get popular sides (first few items)
  const popularSides = sides.slice(0, 4);

  // Categorize drinks
  const gaseosas = drinks.filter(drink => 
    drink.name.includes('GASEOSA') || drink.name.includes('COCA')
  );

  const limonadas = drinks.filter(drink => 
    drink.name.includes('LIMONADA')
  );

  const jugosNaturales = drinks.filter(drink => 
    drink.name.includes('JUGO NATURAL')
  );

  const otherDrinks = drinks.filter(drink => 
    !gaseosas.includes(drink) && 
    !limonadas.includes(drink) && 
    !jugosNaturales.includes(drink)
  );

  const ProductCard = ({ item }: { item: MenuItem }) => (
    <div 
      className={`relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer border-2 ${
        selectedItems.has(item.id) ? 'border-[#FF8C00] ring-2 ring-[#FF8C00]/20' : 'border-gray-100 hover:border-gray-200'
      }`}
      onClick={() => handleAddItem(item)}
    >
      {selectedItems.has(item.id) && (
        <div className="absolute top-2 right-2 bg-[#FF8C00] text-white rounded-full p-1 z-10 shadow-lg">
          <ShoppingCart size={16} />
        </div>
      )}
      
      <div className="h-32 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
        />
      </div>
      
      <div className="p-4">
        <h4 className="font-bold text-gray-800 mb-2 line-clamp-2">{item.name}</h4>
        <p className="text-[#FF8C00] font-bold text-lg mb-3">${item.price.toLocaleString()}</p>
        
        <button className={`w-full py-2 px-3 rounded text-sm font-medium transition-all ${
          selectedItems.has(item.id)
            ? 'bg-[#FF8C00] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-[#FF8C00] hover:text-white'
        }`}>
          {selectedItems.has(item.id) ? (
            <span className="flex items-center justify-center">
              <ShoppingCart size={16} className="mr-2" />
              Agregado
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Plus size={16} className="mr-2" />
              Agregar
            </span>
          )}
        </button>
      </div>
    </div>
  );

  const DrinkCategory = ({ 
    id, 
    title, 
    drinks, 
    icon 
  }: { 
    id: string;
    title: string; 
    drinks: MenuItem[]; 
    icon: string;
  }) => {
    if (drinks.length === 0) return null;
    
    const isExpanded = expandedCategories.has(id);
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        <button
          onClick={() => toggleCategory(id)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <span className="text-2xl mr-3">{icon}</span>
            <h4 className="text-xl font-bold text-gray-800">{title}</h4>
            <span className="ml-3 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {drinks.length} opciones
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp size={24} className="text-gray-500" />
          ) : (
            <ChevronDown size={24} className="text-gray-500" />
          )}
        </button>
        
        {isExpanded && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {drinks.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
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
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/menu')}
              className="mr-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">¿Deseas agregar algo más?</h1>
              <p className="text-gray-600">Completa tu pedido con nuestros acompañamientos y bebidas</p>
            </div>
          </div>
          
          <button
            onClick={handleSkip}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Omitir
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Drinks Section - Organized by categories with dropdowns */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">🥤</span>
            <h3 className="text-2xl font-bold text-gray-800">Bebidas</h3>
            <span className="ml-4 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
              {drinks.length} opciones disponibles
            </span>
          </div>
          
          <div className="space-y-4">
            <DrinkCategory id="gaseosas" title="Gaseosas" drinks={gaseosas} icon="🥤" />
            <DrinkCategory id="limonadas" title="Limonadas" drinks={limonadas} icon="🍋" />
            <DrinkCategory id="jugos" title="Jugos Naturales" drinks={jugosNaturales} icon="🧃" />
            {otherDrinks.length > 0 && (
              <DrinkCategory id="otros" title="Otras Bebidas" drinks={otherDrinks} icon="🥤" />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 sticky bottom-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={handleSkip}
              className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              No, gracias
            </button>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              {selectedItems.size > 0 && (
                <span className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg text-center">
                  {selectedItems.size} producto{selectedItems.size > 1 ? 's' : ''} agregado{selectedItems.size > 1 ? 's' : ''}
                </span>
              )}
              
              <button
                onClick={handleContinue}
                className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-[#FF8C00] text-white rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Continuar con el pedido
                <ArrowRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsPage;