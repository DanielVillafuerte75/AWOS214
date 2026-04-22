import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider } from '../context/AuthContext';
import { initDatabase } from '../database/db';

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    try {
      initDatabase();
      setDbReady(true);
    } catch (error) {
      console.error('Error iniciando base de datos:', error);
    }
  }, []);

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A2E' }}>
        <ActivityIndicator size="large" color="#F5B800" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}