import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import FoodListScreen from '../screens/FoodListScreen';
import AddEditFoodScreen from '../screens/AddEditFoodScreen';
import CartScreen from '../screens/CartScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="FoodList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FF6B6B',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          animation: 'slide_from_right',
          animationDuration: 300,
        }}>
        <Stack.Screen
          name="FoodList"
          component={FoodListScreen}
          options={{title: 'Winsdor'}}
        />
        <Stack.Screen
          name="AddEditFood"
          component={AddEditFoodScreen}
          options={({route}) => ({
            title: route.params?.item ? 'Edit Food Item' : 'Add Food Item',
          })}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{title: 'Shopping Cart'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
