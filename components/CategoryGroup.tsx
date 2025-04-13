import React from 'react';
import { ShoppingItem, Category } from '@/lib/types';
import { ShoppingItem as ShoppingItemComponent } from './ShoppingItem';

interface CategoryGroupProps {
  category?: Category;
  items: ShoppingItem[];
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onChangeCategory: (itemId: string, categoryId?: string) => void;
  categories: Category[];
}

export const CategoryGroup: React.FC<CategoryGroupProps> = ({
  category,
  items,
  onRemove,
  onToggle,
  onChangeCategory,
  categories
}) => {
  if (items.length === 0) {
    return null;
  }

  // Função para calcular uma cor de texto contrastante baseada na cor de fundo
  const getContrastColor = (hexColor: string) => {
    // Converter hex para RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calcular luminância
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Retornar cor de texto baseada na luminância
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  // Ajustar a opacidade do fundo para melhor contraste
  const bgOpacity = '25'; // 25% de opacidade
  const textColor = category ? getContrastColor(category.color) : '#000000';
  const borderSize = '3px';

  return (
    <div className="mb-5 rounded-lg overflow-hidden shadow-sm">
      <div 
        className="p-3 flex items-center gap-2 font-medium"
        style={{ 
          borderLeft: category ? `${borderSize} solid ${category.color}` : `${borderSize} solid #e5e5e5`,
          backgroundColor: category ? `${category.color}${bgOpacity}` : '#f9fafb',
          color: category ? textColor : 'inherit' 
        }}
      >
        {category ? (
          <span 
            className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm" 
            style={{ backgroundColor: category.color }}
          ></span>
        ) : (
          <span className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm bg-gray-400"></span>
        )}
        <h3 className="font-semibold text-base tracking-tight">
          {category ? category.name : 'Sem categoria'}
        </h3>
        <span className="text-sm ml-auto px-2 py-0.5 rounded-full" style={{
          backgroundColor: 'rgba(0,0,0,0.1)',
          color: 'inherit'
        }}>
          {items.length} {items.length === 1 ? 'item' : 'itens'}
        </span>
      </div>
      
      <div className="bg-white divide-y divide-gray-100">
        {items.map(item => (
          <ShoppingItemComponent
            key={item.id}
            item={item}
            onRemove={onRemove}
            onToggle={onToggle}
            onChangeCategory={onChangeCategory}
            categories={categories}
          />
        ))}
      </div>
    </div>
  );
}; 