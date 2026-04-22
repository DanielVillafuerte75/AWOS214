import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/colors';

export default function Onboarding() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/TaskBuddyLogo.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Organiza tu día con facilidad</Text>
      <Text style={styles.subtitle}>
        Gestiona tus tareas de manera simple y eficiente. Nunca vuelvas a olvidar lo importante.
      </Text>

      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.replace('/(auth)/login')}
      >
        <Text style={styles.btnText}>Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  logoContainer: {
    width: 180,
    height: 180,
    borderRadius: 40,
    backgroundColor: '#2A2A4A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: Colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: '#AAAACC',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 60,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#AAAACC',
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.accent,
  },
  btn: {
    backgroundColor: Colors.accent,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 60,
    width: '100%',
    alignItems: 'center',
  },
  btnText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});