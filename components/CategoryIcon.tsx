import React from 'react';
import { Category } from '@/lib/types';

interface CategoryIconProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  size = 'md',
  showBackground = true,
  className = '',
}) => {
  // Definir tamanhos para os ícones
  const sizes = {
    sm: {
      container: 'w-5 h-5',
      icon: 'w-3 h-3',
    },
    md: {
      container: 'w-6 h-6',
      icon: 'w-4 h-4',
    },
    lg: {
      container: 'w-8 h-8',
      icon: 'w-5 h-5',
    },
  };

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

  // Função para renderizar ícone com base no ID da categoria
  const renderIcon = () => {
    const iconColor = showBackground ? getContrastColor(category.color) : category.color;
    
    switch (category.id) {
      case 'fruits':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={sizes[size].icon}>
            <path d="M17.5 9.644C21.3 7.811 22 12.275 19.5 12.275c0 2.237-1.5 4-7 4s-7-2-7-4c-2.2 0-1.5-3.927 1.5-2.578"></path>
            <path d="M13.678 7.418c.412 1.5-1.397 2.355-3.375 1.633l-.206-.085C8.466 8.5 7.95 8.275 7.5 7.8"></path>
            <path d="M17 12.275c0-2-1.5-3-3.5-4-2-.5-3.5.5-3.5.5"></path>
          </svg>
        );
      case 'dairy':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={sizes[size].icon}>
            <path d="M8 2h8"></path>
            <path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 5.211V2"></path>
          </svg>
        );
      case 'meat':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={sizes[size].icon}>
            <path d="M15.787 8.392a6.38 6.38 0 0 0 2.177-4.813c0-1.964-3.964-4-8.964-4-5 0-9 2-9 6s.518 6.982 9.518 6.982 7.35-3.113 6.269-4.169Z"></path>
            <path d="M6.5 12.5 5 15s3 1 6 1 6-1 6-1l-1.5-2.5"></path>
            <path d="M11 10v10c0 .333-.167.5-.5.5s-.5-.5-.5-1c0 .5-.167 1-.5 1s-.5-.167-.5-.5V10"></path>
          </svg>
        );
      case 'bakery':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={sizes[size].icon}>
            <path d="M8 14c0-2.5-5-2.5-5-2.5v-2c5 0 5-2.5 5-2.5s0 2.5 5 2.5-5 2.5-5 2.5 0-2.5-5-2.5-5 2.5-5 2.5"></path>
            <path d="M16 14c0-2.5 5-2.5 5-2.5v-2c-5 0-5-2.5-5-2.5s0 2.5-5 2.5 5 2.5 5 2.5 0-2.5 5-2.5 5 2.5 5 2.5"></path>
            <path d="M12 14a5 5 0 0 0-5-5 5 5 0 0 0 5-5 5 5 0 0 0 5 5 5 5 0 0 0-5 5Z"></path>
            <path d="M7 19a5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0-5-5 5 5 0 0 0-5 5Z"></path>
          </svg>
        );
      case 'cleaning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={sizes[size].icon}>
            <path d="M3 5v14"></path>
            <path d="M21 5v14"></path>
            <path d="M12 5.5A4.5 4.5 0 0 1 7.5 10a3.5 3.5 0 0 0-3.5 3.5A3.5 3.5 0 0 0 7.5 17a4.5 4.5 0 0 1 9 0 3.5 3.5 0 0 0 3.5-3.5A3.5 3.5 0 0 0 16.5 10 4.5 4.5 0 0 1 12 5.5z"></path>
          </svg>
        );
      case 'drinks':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={sizes[size].icon}>
            <path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"></path>
            <path d="M5 8h14"></path>
            <path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"></path>
            <path d="m12 8 1-6h2"></path>
          </svg>
        );
      case 'canned':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={sizes[size].icon}>
            <path d="M19 7v10c0 0 -2 3 -7 3s-7 -3 -7 -3v-10"></path>
            <path d="M5 7c0 0 2 -3 7 -3s7 3 7 3"></path>
            <rect x="10" y="10" width="4" height="4"></rect>
          </svg>
        );
      case 'frozen':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={sizes[size].icon}>
            <path d="M12 3v18"></path>
            <path d="M9 3a3 3 0 1 0 6 0"></path>
            <path d="M9 21a3 3 0 1 1 6 0"></path>
            <path d="M3 12h18"></path>
            <path d="M3 9a3 3 0 1 0 0 6"></path>
            <path d="M21 9a3 3 0 1 1 0 6"></path>
          </svg>
        );
      case 'other':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={sizes[size].icon}>
            <rect width="8" height="8" x="3" y="3" rx="1"></rect>
            <rect width="8" height="8" x="13" y="3" rx="1"></rect>
            <rect width="8" height="8" x="3" y="13" rx="1"></rect>
            <rect width="8" height="8" x="13" y="13" rx="1"></rect>
          </svg>
        );
    }
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full ${sizes[size].container} ${className}`}
      style={{
        backgroundColor: showBackground ? category.color : 'transparent',
      }}
    >
      {renderIcon()}
    </div>
  );
};

export default CategoryIcon; 