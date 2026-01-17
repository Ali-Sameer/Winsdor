export interface FoodItem {
  id?: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export type RootStackParamList = {
  FoodList: undefined;
  AddEditFood: {item?: FoodItem} | undefined;
  Cart: undefined;
};
