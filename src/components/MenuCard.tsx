import React from 'react';
import { MenuItem } from '../types';
import { useOrder } from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const { name, price, image, category } = item;
  const { addToCart } = useOrder();
  const navigate = useNavigate();

  const handleClick = () => {
    if (category === 'sides' || category === 'drinks') {
      addToCart(item, 1, [], false, '');
    } else {
      // Navigate to customization page with item data
      navigate('/customize', { 
        state: { 
          menuItem: item, 
          options: [] // You can pass customization options here
        } 
      });
    }
  };

  const isBurger = category.includes('burgers');
  const isAddition = name.startsWith('AD ');

  return (
    <div 
      className={`group relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer border-2 ${
        isAddition ? 'border-transparent' : 'border-gray-100 hover:border-[#FF8C00]/20'
      } hover:scale-[1.02] active:scale-[0.98]`}
      onClick={handleClick}
    >
      {/* Full Image Container - No zoom effect */}
      <div className="relative h-80 w-full overflow-hidden">
        {/* Subtle gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
        
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover" 
        />
        


        {/* Category Badge for Burgers - Top Left */}
        {isBurger && (
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-black/80 text-white text-xs px-3 py-2 rounded-full font-medium backdrop-blur-sm">
              {category === 'classic-burgers' ? '🍔 Clásica' : 
               category === 'deluxe-burgers' ? '👑 Deluxe' : 
               '🏆 Burger Master'}
            </div>
          </div>
        )}

        {/* Product Name - Bottom Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-lg">
            {name}
          </h3>
        </div>
      </div>

      {/* Subtle hover effect without zoom */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#FF8C00]/0 to-[#FF8C00]/0 group-hover:from-[#FF8C00]/5 group-hover:to-[#FF8C00]/5 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
};

export default MenuCard;