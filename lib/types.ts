export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
  createdAt: Date;
  categoryId?: string; // Identificador da categoria
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  categories: Category[]; // Lista de categorias disponíveis na lista
  createdAt: Date;
  updatedAt: Date;
} 