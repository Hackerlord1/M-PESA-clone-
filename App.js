import { useCallback, useEffect, useState } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import WelcomeScreen from './app/screens/WelcomeScreen';
import MainTabScreen from './app/screens/MainTabScreen';
import MpesaStatementScreen from './app/screens/MpesaStatementScreen';
import TransactionDetailsScreen from './app/screens/TransactionDetailsScreen';
import StatementGenerationScreen from './app/screens/StatementGenerationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [currentSplash, setCurrentSplash] = useState(1);

  // Load custom fonts
  const [fontsLoaded, fontError] = useFonts({
    'Barlow-Regular': require('./app/assets/fonts/Barlow/Barlow-Regular.ttf'),
    'Barlow-Bold': require('./app/assets/fonts/Barlow/Barlow-Bold.ttf'),
    'Barlow-Italic': require('./app/assets/fonts/Barlow/Barlow-Italic.ttf'),
    'Barlow-ExtraBold': require('./app/assets/fonts/Barlow/Barlow-ExtraBold.ttf'),
    'Barlow-Medium': require('./app/assets/fonts/Barlow/Barlow-Medium.ttf'),
    'Barlow-SemiBold': require('./app/assets/fonts/Barlow/Barlow-SemiBold.ttf'),
    'Barlow-ExtraLight': require('./app/assets/fonts/Barlow/Barlow-ExtraLight.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load
        if (!fontsLoaded && !fontError) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for fonts
        }
        if (fontError) {
          console.warn('Font loading error:', fontError);
        }

        // Simulate splash screen transitions
        setTimeout(() => setCurrentSplash(2), 2000);
        setTimeout(() => setAppIsReady(true), 5000);
      } catch (e) {
        console.warn('Error during preparation:', e);
        setAppIsReady(true);
      }
    }
    prepare();
  }, [fontsLoaded, fontError]);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      StatusBar.setHidden(false); // Ensure StatusBar is visible
    }
  }, [appIsReady]);

  if (!appIsReady || !fontsLoaded) {
    return (
      <View style={styles.container}>
        {currentSplash === 1 ? (
          <Image
            source={require('./app/assets/splash.jpg')}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={require('./app/assets/splash2.jpg')}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Main" component={MainTabScreen} />
          <Stack.Screen name="MpesaStatementScreen" component={MpesaStatementScreen} />
          <Stack.Screen name="TransactionDetailsScreen" component={TransactionDetailsScreen} />
          <Stack.Screen name="StatementGenerationScreen" component={StatementGenerationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});