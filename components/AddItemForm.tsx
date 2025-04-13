import React, { useState, FormEvent } from 'react';
import { Category } from '@/lib/types';
import CategoryIcon from './CategoryIcon';

interface AddItemFormProps {
  onAddItem: (name: string, quantity: number, categoryId?: string) => void;
  categories: Category[];
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem, categories }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [showCategorySelect, setShowCategorySelect] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddItem(name.trim(), quantity, categoryId);
      setName('');
      setQuantity(1);
      // Mantém a categoria selecionada para o próximo item
    }
  };

  return (
    <div className="bg-white shadow-sm border rounded-lg mb-6">
      <form onSubmit={handleSubmit} className="p-3">
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adicionar item..."
              className="flex-1 py-2 px-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="ml-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Adicionar
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700 mr-2">
                Quantidade:
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-16 py-1 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center">
              {showCategorySelect ? (
                <div className="flex items-center relative">
                  <div className="absolute z-10 top-8 right-0 w-48 bg-white shadow-lg max-h-60 rounded-md py-1 text-sm overflow-auto focus:outline-none border border-gray-200 transition-all duration-200 ease-in-out">
                    <div 
                      className="cursor-pointer select-none py-2 pl-3 pr-3 hover:bg-gray-100"
                      onClick={() => {
                        setCategoryId(undefined);
                        setShowCategorySelect(false);
                      }}
                    >
                      <span className="font-medium text-gray-700">Sem categoria</span>
                    </div>
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="cursor-pointer select-none py-2 pl-3 pr-3 hover:bg-gray-100"
                        onClick={() => {
                          setCategoryId(category.id);
                          setShowCategorySelect(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <CategoryIcon category={category} size="sm" />
                          <span className="font-medium" style={{ color: category.color }}>
                            {category.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="ml-2 text-xs py-1 px-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                    onClick={() => setShowCategorySelect(false)}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="text-xs py-1 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md flex items-center transition-colors"
                  onClick={() => setShowCategorySelect(true)}
                >
                  {categoryId ? (
                    <>
                      <CategoryIcon 
                        category={categories.find(c => c.id === categoryId)!} 
                        size="sm" 
                        className="mr-1"
                      />
                      <span style={{ color: categories.find(c => c.id === categoryId)?.color }}>
                        {categories.find(c => c.id === categoryId)?.name}
                      </span>
                      <button
                        type="button"
                        className="ml-1 rounded-full hover:bg-white/40 p-0.5 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCategoryId(undefined);
                        }}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="mr-1"
                      >
                        <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
                        <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
                        <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
                        <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
                      </svg>
                      Categoria
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          
          {categoryId && !showCategorySelect && false && (
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Categoria:</span>
              <div 
                className="text-xs py-0.5 px-2 rounded-full flex items-center gap-1.5" 
                style={{ 
                  backgroundColor: `${categories.find(c => c.id === categoryId)?.color}25`,
                  color: categories.find(c => c.id === categoryId)?.color,
                  fontWeight: 600
                }}
              >
                <CategoryIcon 
                  category={categories.find(c => c.id === categoryId)!} 
                  size="sm" 
                  showBackground={false} 
                />
                {categories.find(c => c.id === categoryId)?.name}
                <button
                  type="button"
                  className="ml-1 rounded-full hover:bg-white/40 p-0.5 transition-colors"
                  onClick={() => setCategoryId(undefined)}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}; 