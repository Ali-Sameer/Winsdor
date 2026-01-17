import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch} from 'react-redux';
import {FoodItem, RootStackParamList} from '../types';
import {foodAPI} from '../services/api';
import {addToCart} from '../store/cartSlice';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FoodListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFoodItems();
  }, []);

  // ================= FETCH MENU =================
  const loadFoodItems = async () => {
    try {
      setLoading(true);
      const items = await foodAPI.fetchMenu();

      const normalizedItems: FoodItem[] = (Array.isArray(items)
        ? items
        : []
      )
        .map((item: any) => {
          if (!item.id) {
            console.warn('Item skipped (no id):', item);
            return null;
          }

          return {
            id: String(item.id), // ✅ ONLY backend id
            name: item.Item || item.name || 'Unnamed Item',
            price:
              item.Price !== undefined
                ? Number(item.Price)
                : Number(item.price || 0),
            imageUrl:
              item.imageUrl || item.image || item.image_url || '',
            description:
              item.description || item.Description || '',
          };
        })
        .filter(Boolean) as FoodItem[];

      setFoodItems(normalizedItems);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load food items');
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE ITEM =================
  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await foodAPI.deleteItem(id);

              setFoodItems(prev =>
                prev.filter(item => item.id !== id),
              );

              Alert.alert('Success', 'Item deleted successfully');
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ],
    );
  };

  // ================= ADD TO CART =================
  const handleAddToCart = (item: FoodItem) => {
    dispatch(addToCart(item));
    Alert.alert('Added', 'Item added to cart');
  };

  // ================= RENDER ITEM =================
  const renderFoodItem = ({item}: {item: FoodItem}) => (
    <View style={styles.foodCard}>
      {item.imageUrl ? (
        <Image source={{uri: item.imageUrl}} style={styles.foodImage} />
      ) : (
        <View style={[styles.foodImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>

        {!!item.description && (
          <Text style={styles.foodDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <Text style={styles.foodPrice}>
          ₹{item.price.toFixed(2)}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() =>
              navigation.navigate('AddEditFood', {item})
            }>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => handleDelete(item.id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cartButton]}
            onPress={() => handleAddToCart(item)}>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // ================= UI =================
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food Menu</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddEditFood')}>
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={foodItems}
        renderItem={renderFoodItem}
        keyExtractor={item => item.id} // ✅ stable key
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={loadFoodItems}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>No food items found</Text>
          ) : null
        }
      />

      <TouchableOpacity
        style={styles.cartFloatingButton}
        onPress={() => navigation.navigate('Cart')}>
        <Text style={styles.cartFloatingButtonText}>🛒 Cart</Text>
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  foodCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  placeholderImage: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  foodInfo: {
    padding: 16,
  },
  foodName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  foodDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  foodPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
  },
  editButton: {
    backgroundColor: '#4ECDC4',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  cartButton: {
    backgroundColor: '#95E1D3',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  cartFloatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cartFloatingButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FoodListScreen;
