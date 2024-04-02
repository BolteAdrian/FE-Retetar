export interface IIngredintQuantity {
  id?: number;
  amount: number;
  unit: string;
  price: number;
  currency: string;
  expiringDate: Date;
  dateOfPurchase: Date;
  ingredientId: number;
}
