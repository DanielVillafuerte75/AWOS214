import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert, ScrollView,
  StyleSheet,
  Text, TouchableOpacity,
  View
} from 'react-native';
import Colors from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { getEstadisticas } from '../../database/db';

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ completadas: 0, pendientes: 0 });

  const cargarStats = useCallback(() => {
    if (!user?.id) return;
    const data = getEstadisticas(user.id);
    if (data) setStats(data);
  }, [user]);

  useFocusEffect(cargarStats);

  const handleLogout = () => {
    Alert.alert(
      '¿Cerrar sesión?',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, cerrar',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      {/* Avatar y nombre */}
      <View style={styles.avatarCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={Colors.white} />
        </View>
        <Text style={styles.userName}>{user?.nombre || 'Usuario'}</Text>
        <Text style={styles.userEmail}>{user?.correo || ''}</Text>
      </View>

      {/* Info personal */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Información personal</Text>

        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={18} color={Colors.textLight} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Nombre</Text>
            <Text style={styles.infoValue}>{user?.nombre || 'Usuario'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={18} color={Colors.textLight} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Correo</Text>
            <Text style={styles.infoValue}>{user?.correo || 'usuario@email.com'}</Text>
          </View>
        </View>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.completadas || 0}</Text>
            <Text style={styles.statLabel}>Completadas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.pendientes || 0}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
        </View>
      </View>

      {/* Cerrar sesión */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.white },
  avatarCard: {
    backgroundColor: Colors.white,
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  userEmail: { fontSize: 14, color: Colors.textLight },
  infoCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, color: Colors.textLight },
  infoValue: { fontSize: 15, color: Colors.text, fontWeight: '500' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  statsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: { alignItems: 'center', gap: 4 },
  statNum: { fontSize: 28, fontWeight: 'bold', color: Colors.accent },
  statLabel: { fontSize: 13, color: Colors.textLight },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.border },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
    paddingVertical: 14,
    gap: 8,
  },
  logoutText: { fontSize: 15, color: Colors.error, fontWeight: '600' },
});