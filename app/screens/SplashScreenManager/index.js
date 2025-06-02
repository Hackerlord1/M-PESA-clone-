import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

export default function SplashScreenManager({ onFinish }) {
  useEffect(() => {
    // Hide native splash after 2 seconds (first splash)
    const timer1 = setTimeout(() => {
      // Show your second splash (custom)
    }, 2000);

    // Hide everything after 4 seconds
    const timer2 = setTimeout(() => {
      SplashScreen.hide();
      onFinish();
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/splash2.png')}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});