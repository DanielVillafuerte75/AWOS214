import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Colors from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { deleteTarea, getTareas } from '../../database/db';

export default function Completed() {
  const { user } = useAuth();
  const userId = user?.id;
  const [tareas, setTareas] = useState([]);

  const cargarTareas = useCallback(() => {
    if (!userId) return;
    const data = getTareas(userId, 'Completas');
    setTareas(data);
  }, [userId]);

  useFocusEffect(cargarTareas);

  const confirmarEliminar = (id) => {
    Alert.alert(
      '¿Eliminar tarea?',
      'Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => {
          deleteTarea(id);
          cargarTareas();
        }},
      ]
    );
  };

  const getPrioridadColor = (p) => {
    if (p === 'Alta') return Colors.high;
    if (p === 'Media') return Colors.medium;
    return Colors.low;
  };

  const renderTarea = ({ item }) => (
    <View style={styles.card}>
      <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        {item.descripcion ? (
          <Text style={styles.cardDesc}>{item.descripcion}</Text>
        ) : null}
        <View style={styles.cardMeta}>
          <View style={[styles.badge, { backgroundColor: getPrioridadColor(item.prioridad) }]}>
            <Text style={styles.badgeText}>{item.prioridad}</Text>
          </View>
          {item.fecha ? (
            <View style={styles.fechaContainer}>
              <Ionicons name="calendar-outline" size={12} color={Colors.textLight} />
              <Text style={styles.fechaText}>{item.fecha}</Text>
            </View>
          ) : null}
        </View>
      </View>
      <TouchableOpacity onPress={() => confirmarEliminar(item.id)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={18} color={Colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Completadas</Text>
        <Text style={styles.headerCount}>{tareas.length} tareas</Text>
      </View>

      {tareas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-done-circle-outline" size={60} color={Colors.border} />
          <Text style={styles.emptyText}>No hay tareas completadas</Text>
          <Text style={styles.emptySubtext}>¡Completa algunas tareas para verlas aquí!</Text>
        </View>
      ) : (
        <FlatList
          data={tareas}
          keyExtractor={item => item.id.toString()}
          renderItem={renderTarea}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.white },
  headerCount: { fontSize: 14, color: Colors.accent, fontWeight: '600' },
  list: { padding: 16 },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: { fontSize: 16, color: Colors.textLight, fontWeight: '600' },
  emptySubtext: { fontSize: 13, color: Colors.textLight, textAlign: 'center' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginBottom: 10,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textLight,
    textDecorationLine: 'line-through',
  },
  cardDesc: { fontSize: 13, color: Colors.textLight, marginTop: 2 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, color: Colors.white, fontWeight: 'bold' },
  fechaContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  fechaText: { fontSize: 11, color: Colors.textLight },
  deleteBtn: { padding: 6 },
});