import { ShoppingItem, ShoppingList, Category } from './types';

const STORAGE_KEY = 'shopping-lists';

// Categorias padrão
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'fruits', name: 'Frutas e Vegetais', color: '#4ade80' }, // verde
  { id: 'dairy', name: 'Laticínios', color: '#60a5fa' }, // azul
  { id: 'meat', name: 'Carnes', color: '#f43f5e' }, // vermelho
  { id: 'bakery', name: 'Padaria', color: '#fbbf24' }, // amarelo
  { id: 'cleaning', name: 'Limpeza', color: '#a3a3a3' }, // cinza
  { id: 'drinks', name: 'Bebidas', color: '#c084fc' }, // roxo
  { id: 'canned', name: 'Enlatados', color: '#f97316' }, // laranja
  { id: 'frozen', name: 'Congelados', color: '#0ea5e9' }, // azul claro
  { id: 'other', name: 'Outros', color: '#737373' }, // cinza escuro
];

export function getShoppingLists(): ShoppingList[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const lists = localStorage.getItem(STORAGE_KEY);
  if (!lists) {
    return [];
  }
  
  try {
    const parsed = JSON.parse(lists);
    return parsed.map((list: any) => ({
      ...list,
      createdAt: new Date(list.createdAt),
      updatedAt: new Date(list.updatedAt),
      items: list.items.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      })),
      // Garantir que a lista tenha categorias
      categories: list.categories || DEFAULT_CATEGORIES
    }));
  } catch (error) {
    console.error('Failed to parse shopping lists from localStorage', error);
    return [];
  }
}

export function saveShoppingLists(lists: ShoppingList[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

export function createShoppingList(name: string): ShoppingList {
  const newList: ShoppingList = {
    id: generateId(),
    name,
    items: [],
    categories: [...DEFAULT_CATEGORIES], // Adiciona categorias padrão
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const lists = getShoppingLists();
  saveShoppingLists([...lists, newList]);
  
  return newList;
}

export function addShoppingItem(
  listId: string, 
  name: string, 
  quantity: number = 1, 
  categoryId?: string
): ShoppingItem | null {
  const lists = getShoppingLists();
  const listIndex = lists.findIndex(list => list.id === listId);
  
  if (listIndex === -1) {
    return null;
  }
  
  const newItem: ShoppingItem = {
    id: generateId(),
    name,
    quantity,
    checked: false,
    createdAt: new Date(),
    categoryId // Adiciona categoria ao item
  };
  
  lists[listIndex].items.push(newItem);
  lists[listIndex].updatedAt = new Date();
  
  saveShoppingLists(lists);
  return newItem;
}

export function updateItemCategory(
  listId: string,
  itemId: string,
  categoryId: string | undefined
): boolean {
  const lists = getShoppingLists();
  const listIndex = lists.findIndex(list => list.id === listId);
  
  if (listIndex === -1) {
    return false;
  }
  
  const itemIndex = lists[listIndex].items.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    return false;
  }
  
  lists[listIndex].items[itemIndex].categoryId = categoryId;
  lists[listIndex].updatedAt = new Date();
  
  saveShoppingLists(lists);
  return true;
}

export function addCategory(listId: string, name: string, color: string): Category | null {
  const lists = getShoppingLists();
  const listIndex = lists.findIndex(list => list.id === listId);
  
  if (listIndex === -1) {
    return null;
  }
  
  const newCategory: Category = {
    id: generateId(),
    name,
    color
  };
  
  if (!lists[listIndex].categories) {
    lists[listIndex].categories = [];
  }
  
  lists[listIndex].categories.push(newCategory);
  lists[listIndex].updatedAt = new Date();
  
  saveShoppingLists(lists);
  return newCategory;
}

export function removeCategory(listId: string, categoryId: string): boolean {
  const lists = getShoppingLists();
  const listIndex = lists.findIndex(list => list.id === listId);
  
  if (listIndex === -1 || !lists[listIndex].categories) {
    return false;
  }
  
  const categoryIndex = lists[listIndex].categories.findIndex(cat => cat.id === categoryId);
  
  if (categoryIndex === -1) {
    return false;
  }
  
  // Remove a categoria
  lists[listIndex].categories.splice(categoryIndex, 1);
  
  // Remove a referência a esta categoria de todos os itens
  lists[listIndex].items.forEach(item => {
    if (item.categoryId === categoryId) {
      item.categoryId = undefined;
    }
  });
  
  lists[listIndex].updatedAt = new Date();
  
  saveShoppingLists(lists);
  return true;
}

export function removeShoppingItem(listId: string, itemId: string): boolean {
  const lists = getShoppingLists();
  const listIndex = lists.findIndex(list => list.id === listId);
  
  if (listIndex === -1) {
    return false;
  }
  
  const itemIndex = lists[listIndex].items.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    return false;
  }
  
  lists[listIndex].items.splice(itemIndex, 1);
  lists[listIndex].updatedAt = new Date();
  
  saveShoppingLists(lists);
  return true;
}

export function toggleItemChecked(listId: string, itemId: string): boolean {
  const lists = getShoppingLists();
  const listIndex = lists.findIndex(list => list.id === listId);
  
  if (listIndex === -1) {
    return false;
  }
  
  const itemIndex = lists[listIndex].items.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    return false;
  }
  
  lists[listIndex].items[itemIndex].checked = !lists[listIndex].items[itemIndex].checked;
  lists[listIndex].updatedAt = new Date();
  
  saveShoppingLists(lists);
  return true;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
} 