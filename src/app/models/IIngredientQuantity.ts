export interface IIngredintQuantity {
  id?: number;
  amount: number;
  unit: string;
  expiringDate: Date;
  dateOfPurchase: Date;
  ingredientId: number;
}
