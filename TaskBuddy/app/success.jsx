import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/colors';

export default function Success() {
  const router = useRouter();
  const { message } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/TaskBuddyLogo.jpeg')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>{message || '¡Operación exitosa!'}</Text>
      <Text style={styles.subtitle}>Tu tarea ha sido guardada correctamente</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={styles.btnText}>Regresar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 30,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  btn: {
    marginTop: 24,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    paddingHorizontal: 48,
  },
  btnText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
  },
});