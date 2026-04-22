import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import Colors from '../../constants/colors';

export default function ForgotPassword() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleEnviar = () => {
    if (!correo) return;
    setEnviado(true);
  };

  if (enviado) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={40} color={Colors.white} />
        </View>
        <Text style={styles.successTitle}>¡Correo enviado!</Text>
        <Text style={styles.successSubtitle}>
          Revisa tu bandeja de entrada para restablecer tu contraseña.
        </Text>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.btnPrimaryText}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="mail-outline" size={36} color={Colors.accent} />
        </View>
      </View>

      <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
      <Text style={styles.subtitle}>
        No te preocupes, te enviaremos un enlace para restablecerla.
      </Text>

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

        <TouchableOpacity style={styles.btnPrimary} onPress={handleEnviar}>
          <Text style={styles.btnPrimaryText}>Enviar enlace</Text>
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
    marginTop: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
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
  successContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
  },
  successSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
