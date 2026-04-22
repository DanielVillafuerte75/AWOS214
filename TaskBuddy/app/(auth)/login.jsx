import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import Colors from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { getUserByEmail } from '../../database/db';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!correo || !contrasena) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const user = getUserByEmail(correo.trim().toLowerCase());

    if (!user || user.contrasena !== contrasena) {
      Alert.alert('Error', 'Correo o contraseña incorrectos');
      return;
    }

    login({ id: user.id, nombre: user.nombre, correo: user.correo });
    router.replace('/(tabs)');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/TaskBuddyLogo.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>¡Bienvenido de vuelta!</Text>
      <Text style={styles.subtitle}>Ingresa tus datos para continuar</Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry={!showPassword}
            placeholderTextColor={Colors.textLight}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={Colors.textLight}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}>
          <Text style={styles.btnPrimaryText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.registerText}>
            ¿No tienes cuenta? <Text style={styles.registerLink}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  forgotText: {
    color: Colors.accent,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
  },
  btnPrimary: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnPrimaryText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    textAlign: 'center',
    color: Colors.textLight,
    fontSize: 14,
  },
  registerLink: {
    color: Colors.accent,
    fontWeight: 'bold',
  },
});