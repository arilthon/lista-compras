'use client';

import { useState } from 'react';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { ShoppingItem } from '@/components/ShoppingItem';
import { AddItemForm } from '@/components/AddItemForm';
import { ShareListForm } from '@/components/ShareListForm';
import { CreateListForm } from '@/components/CreateListForm';
import { CategoryGroup } from '@/components/CategoryGroup';
import { ExportPDFButton } from '@/components/ExportPDFButton';
import { Category } from '@/lib/types';

export default function Home() {
  const {
    lists,
    activeListId,
    setActiveListId,
    createShoppingList,
    deleteShoppingList,
    addShoppingItem,
    removeShoppingItem,
    toggleItemChecked,
    updateItemCategory,
    addCategory,
    removeCategory,
    getItemsByCategory,
    getCategoryById,
    shareListViaWhatsApp,
    exportListAsPDF
  } = useShoppingList();

  const [showNewListForm, setShowNewListForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#60a5fa');

  const activeList = lists.find(list => list.id === activeListId);
  const itemsByCategory = activeList ? getItemsByCategory(activeList.id) : {};
  
  const handleAddItem = (name: string, quantity: number, categoryId?: string) => {
    if (activeListId) {
      addShoppingItem(activeListId, name, quantity, categoryId);
    }
  };
  
  const handleAddCategory = () => {
    if (activeListId && newCategoryName.trim()) {
      addCategory(activeListId, newCategoryName.trim(), newCategoryColor);
      setNewCategoryName('');
      setNewCategoryColor('#60a5fa');
    }
  };
  
  return (
    <main className="min-h-screen pb-12">
      <header className="gradient-bg py-6 mb-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Lista de Compras
              </h1>
              <p className="mt-1 text-indigo-100">
                Organize suas compras e compartilhe via WhatsApp
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-white opacity-60"></div>
                <div className="h-2 w-2 rounded-full bg-white opacity-80"></div>
                <div className="h-2 w-2 rounded-full bg-white"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4">
        {lists.length === 0 ? (
          <div className="mt-12 text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Bem-vindo à sua Lista de Compras!</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Comece criando sua primeira lista de compras para organizar seus itens por categorias.</p>
            
            <div className="max-w-md mx-auto">
              <div className="modern-card p-6 bg-white">
                <CreateListForm onCreateList={createShoppingList} />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <div className="modern-card animate-fade-in">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">Suas Listas</h2>
                    <button
                      onClick={() => setShowNewListForm(!showNewListForm)}
                      className="text-indigo-100 hover:text-white transition"
                    >
                      {showNewListForm ? 'Cancelar' : '+ Nova Lista'}
                    </button>
                  </div>
                  <p className="text-indigo-200 text-sm">
                    {lists.length} {lists.length === 1 ? 'lista' : 'listas'} disponíveis
                  </p>
                </div>
                
                {showNewListForm && (
                  <div className="p-4 border-b border-gray-100 bg-indigo-50 animate-slide-up">
                    <CreateListForm 
                      onCreateList={(name) => {
                        createShoppingList(name);
                        setShowNewListForm(false);
                      }} 
                    />
                  </div>
                )}
                
                <div className="divide-y divide-gray-100">
                  {lists.map(list => (
                    <div
                      key={list.id}
                      className={`p-4 cursor-pointer hover:bg-indigo-50 transition-colors ${
                        list.id === activeListId
                          ? 'bg-indigo-50 border-l-4 border-indigo-500'
                          : ''
                      }`}
                      onClick={() => setActiveListId(list.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{list.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {list.items.length} {list.items.length === 1 ? 'item' : 'itens'} · 
                            {list.items.filter(i => i.checked).length} concluídos
                          </p>
                        </div>
                        
                        {list.id === activeListId && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Tem certeza que deseja excluir a lista "${list.name}"?`)) {
                                deleteShoppingList(list.id);
                              }
                            }}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                            aria-label="Excluir lista"
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="16" 
                              height="16" 
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
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {activeList && (
                <>
                  <div className="modern-card animate-fade-in">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 text-white">
                      <div className="flex items-center justify-between mb-1">
                        <h2 className="text-xl font-bold">Categorias</h2>
                        <button
                          onClick={() => setShowCategoryManager(!showCategoryManager)}
                          className="text-pink-100 hover:text-white transition"
                        >
                          {showCategoryManager ? 'Fechar' : 'Gerenciar'}
                        </button>
                      </div>
                      <p className="text-pink-100 text-sm">
                        Organize seus itens para facilitar suas compras
                      </p>
                    </div>
                    
                    {showCategoryManager && (
                      <div className="p-4 border-b border-gray-100 animate-slide-up">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {activeList.categories.map(category => (
                            <div 
                              key={category.id}
                              className="py-1 px-3 rounded-full flex items-center gap-1 shadow-sm"
                              style={{ 
                                backgroundColor: `${category.color}20`,
                                color: category.color,
                                borderLeft: `2px solid ${category.color}`
                              }}
                            >
                              <span 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: category.color }}
                              ></span>
                              <span className="text-sm font-medium">{category.name}</span>
                              <button
                                onClick={() => removeCategory(activeList.id, category.id)}
                                className="ml-1 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-white/20 transition-colors"
                                aria-label="Remover categoria"
                              >
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  width="12" 
                                  height="12" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Nova categoria"
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          />
                          <input
                            type="color"
                            value={newCategoryColor}
                            onChange={(e) => setNewCategoryColor(e.target.value)}
                            className="w-10 h-10 p-1 border border-gray-300 rounded-lg cursor-pointer"
                          />
                        </div>
                        
                        <button
                          onClick={handleAddCategory}
                          disabled={!newCategoryName.trim()}
                          className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Adicionar Categoria
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <ShareListForm 
                    onShare={(phoneNumber) => shareListViaWhatsApp(activeList.id, phoneNumber)} 
                  />
                  
                  <ExportPDFButton 
                    onExport={() => exportListAsPDF(activeList.id)}
                  />
                </>
              )}
            </div>
            
            <div className="md:col-span-2 space-y-6">
              {activeList ? (
                <>
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <span className="mr-2">{activeList.name}</span>
                      <span className="py-1 px-3 rounded-full text-xs text-gray-600 bg-gray-100">
                        {activeList.items.length} itens
                      </span>
                    </h2>
                    
                    <AddItemForm 
                      onAddItem={handleAddItem} 
                      categories={activeList.categories}
                    />
                  </div>
                  
                  <div className="modern-card animate-fade-in">
                    {activeList.items.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 bg-indigo-50/50">
                        <div className="w-16 h-16 mx-auto mb-4 text-indigo-300">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <p className="text-lg font-medium">Nenhum item na lista</p>
                        <p className="text-sm mt-1">Adicione itens acima para começar sua lista de compras.</p>
                      </div>
                    ) : (
                      <div>
                        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-indigo-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="font-semibold text-indigo-800">Itens da Lista</span>
                              {activeList.items.filter(item => item.checked).length > 0 && (
                                <span className="ml-3 text-xs text-white py-0.5 px-2 rounded-full bg-green-500">
                                  {Math.round((activeList.items.filter(item => item.checked).length / activeList.items.length) * 100)}% concluído
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-indigo-600">
                              {activeList.items.filter(item => item.checked).length} de {activeList.items.length} itens marcados
                            </span>
                          </div>
                        </div>
                        
                        {/* Mostrar itens não categorizados primeiro */}
                        <CategoryGroup
                          items={itemsByCategory['uncategorized'] || []}
                          onRemove={(id) => removeShoppingItem(activeList.id, id)}
                          onToggle={(id) => toggleItemChecked(activeList.id, id)}
                          onChangeCategory={(id, categoryId) => updateItemCategory(activeList.id, id, categoryId)}
                          categories={activeList.categories}
                        />
                        
                        {/* Mostrar itens por categoria */}
                        {activeList.categories.map(category => (
                          <CategoryGroup
                            key={category.id}
                            category={category}
                            items={itemsByCategory[category.id] || []}
                            onRemove={(id) => removeShoppingItem(activeList.id, id)}
                            onToggle={(id) => toggleItemChecked(activeList.id, id)}
                            onChangeCategory={(id, categoryId) => updateItemCategory(activeList.id, id, categoryId)}
                            categories={activeList.categories}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="modern-card p-8 text-center animate-fade-in">
                  <div className="w-16 h-16 mx-auto mb-4 text-indigo-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-700">Selecione uma lista</p>
                  <p className="text-gray-500 mt-1">Escolha uma lista à esquerda ou crie uma nova para começar.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <footer className="mt-20 py-6 text-center text-gray-500 border-t border-gray-200">
        <div className="container mx-auto">
          <p>Lista de Compras com Integração WhatsApp © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </main>
  );
}
