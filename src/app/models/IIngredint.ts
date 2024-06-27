export interface IIngredint {
  id?: number;
  name: string;
  description?: string;
  picture?: string;
  categoryId?: number;
}

export interface IngredientWithStock extends IIngredint {
  StockEmpty: boolean;
  StockExpired: boolean;
  StockAlmostExpired: boolean;
}
