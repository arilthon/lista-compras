import React, { useState } from 'react';
import { ShoppingItem as ShoppingItemType, Category } from '@/lib/types';
import CategoryIcon from './CategoryIcon';

interface ShoppingItemProps {
  item: ShoppingItemType;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onChangeCategory: (itemId: string, categoryId?: string) => void;
  categories: Category[];
}

export const ShoppingItem: React.FC<ShoppingItemProps> = ({ 
  item, 
  onRemove, 
  onToggle,
  onChangeCategory,
  categories
}) => {
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoryId = e.target.value || undefined;
    onChangeCategory(item.id, newCategoryId);
    setShowCategorySelect(false);
  };
  
  // Encontrar a categoria do item
  const itemCategory = categories.find(cat => cat.id === item.categoryId);
  
  return (
    <div className="flex flex-col border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between p-3 transition-opacity" style={{ 
        opacity: item.checked ? 0.7 : 1 
      }}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => onToggle(item.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
              ${item.checked 
                ? 'bg-green-500 border-green-500 text-white shadow-sm' 
                : 'border-gray-300 hover:border-green-500'
              }`}
            aria-label={item.checked ? "Marcar como não comprado" : "Marcar como comprado"}
          >
            {item.checked && (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </button>
          
          <div className="flex flex-col truncate">
            <span className={`text-base font-medium truncate ${item.checked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {item.name}
            </span>
            
            <div className="flex items-center gap-2 mt-0.5">
              {item.quantity > 1 && (
                <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                  {item.quantity}
                </span>
              )}
              
              {itemCategory ? (
                <button 
                  className="flex items-center gap-1.5 text-xs py-0.5 px-2 rounded-full focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors" 
                  style={{ 
                    backgroundColor: `${itemCategory.color}25`, 
                    color: itemCategory.color,
                    fontWeight: 600
                  }}
                  onClick={() => setShowCategorySelect(!showCategorySelect)}
                >
                  <CategoryIcon 
                    category={itemCategory} 
                    size="sm" 
                    showBackground={false} 
                  />
                  {itemCategory.name}
                </button>
              ) : (
                <button 
                  className="text-xs py-0.5 px-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors font-medium"
                  onClick={() => setShowCategorySelect(!showCategorySelect)}
                >
                  + Categoria
                </button>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onRemove(item.id)}
          className="ml-2 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors flex-shrink-0"
          aria-label="Remover item"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>
      
      {showCategorySelect && (
        <div className="px-3 pb-3 pt-1 bg-gray-50">
          <select
            value={item.categoryId || ''}
            onChange={handleCategoryChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            autoFocus
          >
            <option value="">Sem categoria</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}; 