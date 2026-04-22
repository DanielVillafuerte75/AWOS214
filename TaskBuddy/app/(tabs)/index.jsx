import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet, Alert, Modal, TextInput, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import {
  getTareas, createTarea, updateTarea,
  deleteTarea, completarTarea, getConsejoAleatorio
} from '../../database/db';
import Colors from '../../constants/colors';

export default function TaskList() {
  const { user } = useAuth();
  const router = useRouter();
  const userId = user?.id;
  const userName = user?.nombre;

  const [tareas, setTareas] = useState([]);
  const [filtro, setFiltro] = useState('Todas');
  const [consejo, setConsejo] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [prioridad, setPrioridad] = useState('Media');

  const cargarTareas = useCallback(() => {
    if (!userId) return;
    const data = getTareas(userId, filtro);
    setTareas(data);
  }, [userId, filtro]);

  useFocusEffect(cargarTareas);

  useEffect(() => {
    const c = getConsejoAleatorio();
    if (c) setConsejo(c.texto);
  }, []);

  useEffect(() => {
    cargarTareas();
  }, [filtro]);

  const pendientes = tareas.filter(t => t.completada === 0).length;
  const completadas = tareas.filter(t => t.completada === 1).length;

  const abrirModal = (tarea = null) => {
    if (tarea) {
      setEditando(tarea);
      setTitulo(tarea.titulo);
      setDescripcion(tarea.descripcion || '');
      setFecha(tarea.fecha || '');
      setPrioridad(tarea.prioridad || 'Media');
    } else {
      setEditando(null);
      setTitulo('');
      setDescripcion('');
      setFecha('');
      setPrioridad('Media');
    }
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setEditando(null);
  };

  const guardarTarea = () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }

    if (editando) {
      updateTarea(editando.id, titulo.trim(), descripcion, fecha, prioridad);
      cerrarModal();
      cargarTareas();
      router.push({
        pathname: '/success',
        params: { message: '¡Tarea actualizada con éxito!' }
      });
    } else {
      createTarea(userId, titulo.trim(), descripcion, fecha, prioridad);
      cerrarModal();
      cargarTareas();
      router.push({
        pathname: '/success',
        params: { message: '¡Tarea guardada con éxito!' }
      });
    }
  };

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

  const marcarCompletada = (id) => {
    completarTarea(id);
    cargarTareas();
  };

  const getPrioridadColor = (p) => {
    if (p === 'Alta') return Colors.high;
    if (p === 'Media') return Colors.medium;
    return Colors.low;
  };

  const getFecha = () => {
    const d = new Date();
    return d.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const renderTarea = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.checkBtn}
        onPress={() => !item.completada && marcarCompletada(item.id)}
      >
        <Ionicons
          name={item.completada ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={item.completada ? Colors.success : Colors.border}
        />
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, item.completada && styles.cardTitleDone]}>
          {item.titulo}
        </Text>
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

      {!item.completada && (
        <TouchableOpacity onPress={() => abrirModal(item)} style={styles.editBtn}>
          <Ionicons name="pencil-outline" size={18} color={Colors.textLight} />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => confirmarEliminar(item.id)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={18} color={Colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Tareas</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Saludo */}
        <View style={styles.greetingCard}>
          <Text style={styles.greetingText}>¡Hola, {userName || 'Usuario'}! 👋</Text>
          <Text style={styles.dateText}>{getFecha()}</Text>
        </View>

        {/* Consejo */}
        {consejo ? (
          <View style={styles.consejoCard}>
            <Text style={styles.consejoTitle}>💡 Consejo del día</Text>
            <Text style={styles.consejoText}>{consejo}</Text>
          </View>
        ) : null}

        {/* Filtros */}
        <View style={styles.filtros}>
          {['Todas', 'Pendientes', 'Completas'].map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filtroBtn, filtro === f && styles.filtroBtnActive]}
              onPress={() => setFiltro(f)}
            >
              <Text style={[styles.filtroText, filtro === f && styles.filtroTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Lista */}
        {tareas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={60} color={Colors.border} />
            <Text style={styles.emptyText}>Aún no tienes tareas</Text>
          </View>
        ) : (
          <FlatList
            data={tareas}
            keyExtractor={item => item.id.toString()}
            renderItem={renderTarea}
            scrollEnabled={false}
          />
        )}

        {/* Contador */}
        <View style={styles.contador}>
          <Text style={styles.contadorText}>
            Pendientes: <Text style={styles.contadorNum}>{pendientes}</Text>
          </Text>
          <Text style={styles.contadorSep}>|</Text>
          <Text style={styles.contadorText}>
            Completadas: <Text style={styles.contadorNum}>{completadas}</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Botón + */}
      <TouchableOpacity style={styles.fab} onPress={() => abrirModal()}>
        <Ionicons name="add" size={32} color={Colors.white} />
      </TouchableOpacity>

      {/* Modal Agregar/Editar */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editando ? 'Editar Tarea' : 'Nueva Tarea'}</Text>
              <TouchableOpacity onPress={cerrarModal}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ej: Comprar víveres"
              value={titulo}
              onChangeText={setTitulo}
              placeholderTextColor={Colors.textLight}
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.modalInput, styles.modalInputMulti]}
              placeholder="Agrega detalles adicionales (opcional)"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              numberOfLines={3}
              placeholderTextColor={Colors.textLight}
            />

            <Text style={styles.label}>Fecha</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="dd/mm/aaaa"
              value={fecha}
              onChangeText={setFecha}
              placeholderTextColor={Colors.textLight}
            />

            <Text style={styles.label}>Prioridad</Text>
            <View style={styles.prioridadContainer}>
              {['Alta', 'Media', 'Baja'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.prioridadBtn,
                    prioridad === p && { backgroundColor: getPrioridadColor(p) }
                  ]}
                  onPress={() => setPrioridad(p)}
                >
                  <Text style={[
                    styles.prioridadText,
                    prioridad === p && styles.prioridadTextActive
                  ]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.btnCancelar} onPress={cerrarModal}>
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGuardar} onPress={guardarTarea}>
                <Text style={styles.btnGuardarText}>
                  {editando ? 'Actualizar' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  greetingCard: {
    backgroundColor: Colors.white,
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  greetingText: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  dateText: { fontSize: 13, color: Colors.textLight, marginTop: 4 },
  consejoCard: {
    backgroundColor: '#FFF8E1',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  consejoTitle: { fontSize: 13, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  consejoText: { fontSize: 13, color: Colors.text },
  filtros: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    gap: 8,
  },
  filtroBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filtroBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filtroText: { fontSize: 13, color: Colors.textLight, fontWeight: '600' },
  filtroTextActive: { color: Colors.white },
  emptyContainer: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textLight },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  checkBtn: { marginRight: 12 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
  cardTitleDone: { textDecorationLine: 'line-through', color: Colors.textLight },
  cardDesc: { fontSize: 13, color: Colors.textLight, marginTop: 2 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, color: Colors.white, fontWeight: 'bold' },
  fechaContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  fechaText: { fontSize: 11, color: Colors.textLight },
  editBtn: { padding: 6 },
  deleteBtn: { padding: 6 },
  contador: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  contadorText: { fontSize: 14, color: Colors.textLight },
  contadorNum: { fontWeight: 'bold', color: Colors.accent },
  contadorSep: { color: Colors.border },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000060',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  label: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  modalInput: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  modalInputMulti: { height: 80, textAlignVertical: 'top' },
  prioridadContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  prioridadBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  prioridadText: { fontSize: 14, color: Colors.textLight, fontWeight: '600' },
  prioridadTextActive: { color: Colors.white },
  modalButtons: { flexDirection: 'row', gap: 12 },
  btnCancelar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  btnCancelarText: { fontSize: 15, color: Colors.text },
  btnGuardar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: 'center',
  },
  btnGuardarText: { fontSize: 15, color: Colors.white, fontWeight: 'bold' },
});