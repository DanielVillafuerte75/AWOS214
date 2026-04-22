import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert, ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import Colors from '../../constants/colors';
import { createUser, getUserByEmail } from '../../database/db';

export default function Register() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    if (!nombre || !correo || !contrasena || !confirmar) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (contrasena !== confirmar) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (contrasena.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const existingUser = getUserByEmail(correo.trim().toLowerCase());
    if (existingUser) {
      Alert.alert('Error', 'Ya existe una cuenta con ese correo');
      return;
    }

    try {
      createUser(nombre.trim(), correo.trim().toLowerCase(), contrasena);
      Alert.alert('¡Éxito!', 'Cuenta creada correctamente', [
        { text: 'Iniciar sesión', onPress: () => router.replace('/(auth)/login') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la cuenta');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="person-add-outline" size={36} color={Colors.white} />
        </View>
      </View>

      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>Completa tus datos para comenzar</Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={nombre}
            onChangeText={setNombre}
            placeholderTextColor={Colors.textLight}
          />
        </View>

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

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            value={confirmar}
            onChangeText={setConfirmar}
            secureTextEntry={!showPassword}
            placeholderTextColor={Colors.textLight}
          />
        </View>

        <TouchableOpacity style={styles.btnPrimary} onPress={handleRegister}>
          <Text style={styles.btnPrimaryText}>Registrarme</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.loginText}>
            ¿Ya tienes cuenta? <Text style={styles.loginLink}>Iniciar sesión</Text>
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
  },
  backBtn: {
    marginTop: 40,
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
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
  loginText: {
    textAlign: 'center',
    color: Colors.textLight,
    fontSize: 14,
  },
  loginLink: {
    color: Colors.accent,
    fontWeight: 'bold',
  },
});
