import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {FoodItem, RootStackParamList} from '../types';
import {foodAPI} from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RoutePropType = RouteProp<RootStackParamList, 'AddEditFood'>;

const AddEditFoodScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const editingItem = route.params?.item;

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setPrice(editingItem.price.toString());
      setImageUrl(editingItem.imageUrl);
      setDescription(editingItem.description);
    }
    navigation.setOptions({
      title: editingItem ? 'Edit Food Item' : 'Add Food Item',
    });
  }, [editingItem, navigation]);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter food name');
      return false;
    }
    if (!price.trim() || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }
    if (!imageUrl.trim()) {
      Alert.alert('Error', 'Please enter image URL');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter description');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const foodItem: Omit<FoodItem, 'id'> = {
        name: name.trim(),
        price: parseFloat(price),
        imageUrl: imageUrl.trim(),
        description: description.trim(),
      };

      if (editingItem?.id) {
        await foodAPI.updateItem(editingItem.id, foodItem);
        Alert.alert('Success', 'Food item updated successfully', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      } else {
        await foodAPI.addItem(foodItem);
        Alert.alert('Success', 'Food item added successfully', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      const statusCode = error.response?.status;
      
      Alert.alert(
        'Error',
        editingItem
          ? `Failed to update food item${statusCode ? ` (${statusCode})` : ''}: ${errorMessage}`
          : `Failed to add food item${statusCode ? ` (${statusCode})` : ''}: ${errorMessage}`,
      );
      console.error('Error details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Food Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter food name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price ($) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image URL *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter image URL"
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              {editingItem ? 'Update Item' : 'Add Item'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  form: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFF',
  },
  textArea: {
    height: 100,
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddEditFoodScreen;
