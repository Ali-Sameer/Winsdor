/**
 * Food Ordering App
 * @format
 */

import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {Provider, useDispatch} from 'react-redux';
import {store} from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import {loadCartFromStorage, setCart} from './src/store/cartSlice';
import {foodAPI} from './src/services/api';

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize app: Load cart and preload food items
    const initializeApp = async () => {
      try {
        // Load cart from AsyncStorage
        const savedCart = await loadCartFromStorage();
        dispatch(setCart(savedCart));

        // Preload food items (this will cache the data)
        await foodAPI.fetchMenu();
        
        // Wait a bit for smooth transition
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  if (isLoading) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />
        <SplashScreen onFinish={() => {}} />
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />
      <AppNavigator />
    </>
  );
};

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({});

export default App;
