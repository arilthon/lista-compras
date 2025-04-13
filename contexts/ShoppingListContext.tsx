'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ShoppingItem, ShoppingList, Category } from '@/lib/types';
import { 
  getShoppingLists, 
  saveShoppingLists, 
  createShoppingList as createList,
  addShoppingItem as addItem,
  removeShoppingItem as removeItem,
  toggleItemChecked as toggleItem,
  updateItemCategory,
  addCategory as addCat,
  removeCategory as removeCat,
  DEFAULT_CATEGORIES
} from '@/lib/storage';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ShareResponse {
  success: boolean;
  url?: string;
  error?: string;
}

interface PDFExportResponse {
  success: boolean;
  error?: string;
}

interface ShoppingListContextType {
  lists: ShoppingList[];
  activeListId: string | null;
  setActiveListId: (id: string | null) => void;
  createShoppingList: (name: string) => ShoppingList;
  deleteShoppingList: (id: string) => void;
  addShoppingItem: (listId: string, name: string, quantity?: number, categoryId?: string) => ShoppingItem | null;
  removeShoppingItem: (listId: string, itemId: string) => void;
  toggleItemChecked: (listId: string, itemId: string) => void;
  updateItemCategory: (listId: string, itemId: string, categoryId?: string) => void;
  addCategory: (listId: string, name: string, color: string) => Category | null;
  removeCategory: (listId: string, categoryId: string) => void;
  getItemsByCategory: (listId: string) => Record<string, ShoppingItem[]>;
  getCategoryById: (listId: string, categoryId?: string) => Category | undefined;
  shareListViaWhatsApp: (listId: string, phoneNumber: string) => Promise<ShareResponse>;
  exportListAsPDF: (listId: string) => Promise<PDFExportResponse>;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

interface ShoppingListProviderProps {
  children: ReactNode;
}

export const ShoppingListProvider: React.FC<ShoppingListProviderProps> = ({ children }) => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);

  // Load lists from localStorage on component mount
  useEffect(() => {
    const loadedLists = getShoppingLists();
    setLists(loadedLists);
    
    // Set active list to the first list if exists and no active list is set
    if (loadedLists.length > 0 && !activeListId) {
      setActiveListId(loadedLists[0].id);
    }
  }, []);

  const createShoppingList = (name: string) => {
    const newList = createList(name);
    setLists(prev => [...prev, newList]);
    if (!activeListId) {
      setActiveListId(newList.id);
    }
    return newList;
  };

  const deleteShoppingList = (id: string) => {
    const updatedLists = lists.filter(list => list.id !== id);
    setLists(updatedLists);
    saveShoppingLists(updatedLists);
    
    // If active list is deleted, set active list to first list or null
    if (activeListId === id) {
      setActiveListId(updatedLists.length > 0 ? updatedLists[0].id : null);
    }
  };

  const addShoppingItem = (listId: string, name: string, quantity = 1, categoryId?: string) => {
    const newItem = addItem(listId, name, quantity, categoryId);
    if (newItem) {
      const updatedLists = getShoppingLists();
      setLists(updatedLists);
      return newItem;
    }
    return null;
  };

  const removeShoppingItem = (listId: string, itemId: string) => {
    const success = removeItem(listId, itemId);
    if (success) {
      const updatedLists = getShoppingLists();
      setLists(updatedLists);
    }
  };

  const toggleItemChecked = (listId: string, itemId: string) => {
    const success = toggleItem(listId, itemId);
    if (success) {
      const updatedLists = getShoppingLists();
      setLists(updatedLists);
    }
  };

  const changeItemCategory = (listId: string, itemId: string, categoryId?: string) => {
    const success = updateItemCategory(listId, itemId, categoryId);
    if (success) {
      const updatedLists = getShoppingLists();
      setLists(updatedLists);
    }
  };

  const addCategory = (listId: string, name: string, color: string) => {
    const newCategory = addCat(listId, name, color);
    if (newCategory) {
      const updatedLists = getShoppingLists();
      setLists(updatedLists);
      return newCategory;
    }
    return null;
  };

  const removeCategory = (listId: string, categoryId: string) => {
    const success = removeCat(listId, categoryId);
    if (success) {
      const updatedLists = getShoppingLists();
      setLists(updatedLists);
    }
  };

  const getItemsByCategory = (listId: string): Record<string, ShoppingItem[]> => {
    const list = lists.find(l => l.id === listId);
    if (!list) return {};
    
    const categorizedItems: Record<string, ShoppingItem[]> = {};
    
    // Inicializar todas as categorias com arrays vazios
    categorizedItems['uncategorized'] = [];
    list.categories.forEach(cat => {
      categorizedItems[cat.id] = [];
    });
    
    // Distribuir itens nas categorias
    list.items.forEach(item => {
      const categoryId = item.categoryId || 'uncategorized';
      if (!categorizedItems[categoryId]) {
        categorizedItems[categoryId] = []; // Garante que a categoria existe
      }
      categorizedItems[categoryId].push(item);
    });
    
    return categorizedItems;
  };

  const getCategoryById = (listId: string, categoryId?: string): Category | undefined => {
    if (!categoryId) return undefined;
    
    const list = lists.find(l => l.id === listId);
    if (!list) return undefined;
    
    return list.categories.find(cat => cat.id === categoryId);
  };

  const shareListViaWhatsApp = async (listId: string, phoneNumber: string): Promise<ShareResponse> => {
    const list = lists.find(l => l.id === listId);
    if (!list) {
      throw new Error('Lista não encontrada');
    }

    // Format phone number if needed
    const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    // Agrupar itens por categoria para a mensagem
    const itemsByCategory = getItemsByCategory(listId);
    
    // Construir a mensagem com categorias
    let message = `Lista de Compras: ${list.name}\n\n`;
    
    // Primeiro, adicionar itens sem categoria
    if (itemsByCategory['uncategorized'] && itemsByCategory['uncategorized'].length > 0) {
      message += `- Gerais:\n`;
      itemsByCategory['uncategorized'].forEach(item => {
        message += `  ${item.checked ? '✓' : '☐'} ${item.name} (${item.quantity})\n`;
      });
      message += '\n';
    }
    
    // Adicionar itens por categoria
    list.categories.forEach(category => {
      const items = itemsByCategory[category.id];
      if (items && items.length > 0) {
        message += `- ${category.name}:\n`;
        items.forEach(item => {
          message += `  ${item.checked ? '✓' : '☐'} ${item.name} (${item.quantity})\n`;
        });
        message += '\n';
      }
    });
    
    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formattedPhoneNumber,
          message
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Falha ao gerar link do WhatsApp'
        };
      }
      
      const data = await response.json();
      
      // Abrir link do WhatsApp em nova janela
      if (data.url && typeof window !== 'undefined') {
        window.open(data.url, '_blank');
      }
      
      return {
        success: true,
        url: data.url
      };
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  };

  const exportListAsPDF = async (listId: string): Promise<PDFExportResponse> => {
    try {
      const list = lists.find(l => l.id === listId);
      if (!list) {
        return { success: false, error: 'Lista não encontrada' };
      }

      // Agrupar itens por categoria para o documento
      const itemsByCategory = getItemsByCategory(listId);
      
      // Inicializar o documento PDF
      const doc = new jsPDF();
      
      // Adicionar título
      doc.setFontSize(20);
      doc.text(`Lista de Compras: ${list.name}`, 14, 22);
      
      doc.setFontSize(12);
      doc.text(`Gerado em: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30);
      
      // Posição inicial do conteúdo
      let yPosition = 40;
      
      // Primeiro, adicionar itens sem categoria
      if (itemsByCategory['uncategorized'] && itemsByCategory['uncategorized'].length > 0) {
        doc.setFontSize(16);
        doc.text('Itens Gerais', 14, yPosition);
        yPosition += 10;
        
        const uncategorizedData = itemsByCategory['uncategorized'].map(item => [
          item.checked ? '✓' : '☐',
          item.name,
          item.quantity.toString()
        ]);
        
        autoTable(doc, {
          startY: yPosition,
          head: [['Status', 'Item', 'Quantidade']],
          body: uncategorizedData,
          theme: 'striped',
          headStyles: { fillColor: [100, 100, 100] },
          margin: { top: 10 }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }
      
      // Adicionar itens por categoria
      list.categories.forEach(category => {
        const items = itemsByCategory[category.id];
        if (items && items.length > 0) {
          // Verificar se precisamos de uma nova página
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          // Converter a cor hex para RGB para o título
          let hexColor = category.color.replace('#', '');
          if (hexColor.length === 3) {
            hexColor = hexColor[0] + hexColor[0] + hexColor[1] + hexColor[1] + hexColor[2] + hexColor[2];
          }
          const r = parseInt(hexColor.substring(0, 2), 16);
          const g = parseInt(hexColor.substring(2, 4), 16);
          const b = parseInt(hexColor.substring(4, 6), 16);
          
          doc.setFontSize(16);
          doc.setTextColor(r, g, b);
          doc.text(category.name, 14, yPosition);
          doc.setTextColor(0, 0, 0); // Resetar para preto
          yPosition += 10;
          
          const categoryData = items.map(item => [
            item.checked ? '✓' : '☐',
            item.name,
            item.quantity.toString()
          ]);
          
          autoTable(doc, {
            startY: yPosition,
            head: [['Status', 'Item', 'Quantidade']],
            body: categoryData,
            theme: 'striped',
            headStyles: { fillColor: [r, g, b] },
            margin: { top: 10 }
          });
          
          yPosition = (doc as any).lastAutoTable.finalY + 10;
        }
      });
      
      // Adicionar rodapé
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          'Lista de Compras - Gerado por Lista de Compras App',
          14,
          doc.internal.pageSize.height - 10
        );
        doc.text(
          `Página ${i} de ${pageCount}`,
          doc.internal.pageSize.width - 30,
          doc.internal.pageSize.height - 10
        );
      }
      
      // Salvar o PDF
      doc.save(`lista-compras-${list.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao gerar PDF'
      };
    }
  };

  return (
    <ShoppingListContext.Provider
      value={{
        lists,
        activeListId,
        setActiveListId,
        createShoppingList,
        deleteShoppingList,
        addShoppingItem,
        removeShoppingItem,
        toggleItemChecked,
        updateItemCategory: changeItemCategory,
        addCategory,
        removeCategory,
        getItemsByCategory,
        getCategoryById,
        shareListViaWhatsApp,
        exportListAsPDF
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = (): ShoppingListContextType => {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
}; 