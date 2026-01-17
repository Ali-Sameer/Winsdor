import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CartItem, FoodItem} from '../types';

interface CartState {
  items: CartItem[];
}

const CART_STORAGE_KEY = '@cart_items';

const initialState: CartState = {
  items: [],
};

/* =======================
   AsyncStorage Helpers
======================= */

// Load cart
export const loadCartFromStorage = async (): Promise<CartItem[]> => {
  try {
    const data = await AsyncStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Load cart error:', error);
    return [];
  }
};

// Save cart
export const saveCartToStorage = async (items: CartItem[]) => {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Save cart error:', error);
  }
};

/* =======================
        Cart Slice
======================= */

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // ADD ITEM
    addToCart: (state, action: PayloadAction<FoodItem>) => {
      const existingItem = state.items.find(
        item => item.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }

      saveCartToStorage(state.items);
    },

    // REMOVE ITEM COMPLETELY
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        item => item.id !== action.payload,
      );
      saveCartToStorage(state.items);
    },

    // INCREASE QUANTITY
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(
        item => item.id === action.payload,
      );

      if (item) {
        item.quantity += 1;
        saveCartToStorage(state.items);
      }
    },

    // DECREASE QUANTITY (❌ no auto delete)
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(
        item => item.id === action.payload,
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCartToStorage(state.items);
      }
    },

    // CLEAR CART
    clearCart: state => {
      state.items = [];
      saveCartToStorage([]);
    },

    // SET CART (used when loading from AsyncStorage)
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  setCart,
} = cartSlice.actions;

export default cartSlice.reducer;
