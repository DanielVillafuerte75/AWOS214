// database/index.js
import { Platform } from 'react-native';

let dbModule;

if (Platform.OS === 'web') {
  console.log('🌐 Cargando versión web de la base de datos');
  dbModule = require('./db.web.js');
} else {
  console.log('📱 Cargando versión nativa de la base de datos');
  dbModule = require('./db.native.js');
}

// Exportar todo igual que antes
export const initDatabase = dbModule.initDatabase;
export const createUser = dbModule.createUser;
export const getUserByEmail = dbModule.getUserByEmail;
export const getTareas = dbModule.getTareas;
export const createTarea = dbModule.createTarea;
export const updateTarea = dbModule.updateTarea;
export const completarTarea = dbModule.completarTarea;
export const deleteTarea = dbModule.deleteTarea;
export const getEstadisticas = dbModule.getEstadisticas;
export const getConsejoAleatorio = dbModule.getConsejoAleatorio;

export default dbModule.default;