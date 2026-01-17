import axios from 'axios';
import {FoodItem} from '../types';
import {
  FETCH_MENU_API,
  ADD_ITEM_API,
  UPDATE_ITEM_API,
  DELETE_ITEM_API,
} from '@env';

export const foodAPI = {
  // ================= FETCH MENU =================
  fetchMenu: async (): Promise<FoodItem[]> => {
    try {
      const response = await axios.get(FETCH_MENU_API);
      return response.data;
    } catch (error) {
      console.error('Error fetching menu:', error);
      throw error;
    }
  },

  // ================= ADD ITEM =================
  addItem: async (item: Omit<FoodItem, 'id'>): Promise<FoodItem> => {
    try {
      const apiPayload = {
        Item: item.name,
        Price: item.price,
        description: item.description || '',
        imageUrl: item.imageUrl || '',
      };

      const response = await axios.post(ADD_ITEM_API, apiPayload);

      return {
        id: response.data?.id
          ? String(response.data.id)
          : Math.random().toString(),
        name: response.data.Item || item.name,
        price:
          response.data.Price !== undefined
            ? Number(response.data.Price)
            : item.price,
        imageUrl: response.data.imageUrl || '',
        description: response.data.description || '',
      };
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  },

  // ================= UPDATE ITEM =================
  updateItem: async (
    id: string,
    item: Partial<FoodItem>,
  ): Promise<FoodItem> => {
    try {
      const numericId = Number(id);
      const apiId = !isNaN(numericId) ? numericId : id;

      const apiPayload: any = {};
      if (item.name !== undefined) apiPayload.Item = item.name;
      if (item.price !== undefined) apiPayload.Price = item.price;
      if (item.description !== undefined)
        apiPayload.description = item.description;
      if (item.imageUrl !== undefined)
        apiPayload.imageUrl = item.imageUrl;

      const response = await axios.post(
        `${UPDATE_ITEM_API}?id=${apiId}`,
        apiPayload,
      );

      return {
        id: response.data?.id ? String(response.data.id) : id,
        name: response.data.Item || item.name || '',
        price:
          response.data.Price !== undefined
            ? Number(response.data.Price)
            : item.price || 0,
        imageUrl: response.data.imageUrl || item.imageUrl || '',
        description: response.data.description || item.description || '',
      };
    } catch (error: any) {
      console.error('Error updating item:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      throw error;
    }
  },

  // ================= DELETE ITEM =================
  deleteItem: async (id: string): Promise<void> => {
    try {
      const numericId = Number(id);
      const apiId = !isNaN(numericId) ? numericId : id;

      await axios.post(`${DELETE_ITEM_API}?id=${apiId}`);
    } catch (error: any) {
      console.error('Error deleting item:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      throw error;
    }
  },
};
