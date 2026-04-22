import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('taskbuddy.db');

export const initDatabase = () => {
  db.execSync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      correo TEXT NOT NULL UNIQUE,
      contrasena TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tareas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      fecha TEXT,
      prioridad TEXT CHECK(prioridad IN ('Alta','Media','Baja')),
      completada INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS consejos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      texto TEXT NOT NULL
    );

    INSERT OR IGNORE INTO consejos (id, texto) VALUES
    (1, 'Prioriza las tareas importantes primero para un dia mas productivo'),
    (2, 'Divide tareas grandes en pasos pequenos para avanzar mas facil'),
    (3, 'Completar una tarea a la vez mejora tu concentracion'),
    (4, 'Empieza por las tareas dificiles cuando tienes mas energia');
  `);
};

// ─── Usuarios ───────────────────────────────────────────────
export const createUser = (nombre, correo, contrasena) => {
  return db.runSync(
    'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)',
    [nombre, correo, contrasena]
  );
};

export const getUserByEmail = (correo) => {
  return db.getFirstSync(
    'SELECT * FROM usuarios WHERE correo = ?',
    [correo]
  );
};

// ─── Tareas ─────────────────────────────────────────────────
export const getTareas = (usuario_id, filtro = 'Todas') => {
  if (filtro === 'Pendientes') {
    return db.getAllSync(
      'SELECT * FROM tareas WHERE usuario_id = ? AND completada = 0 ORDER BY fecha ASC',
      [usuario_id]
    );
  } else if (filtro === 'Completas') {
    return db.getAllSync(
      'SELECT * FROM tareas WHERE usuario_id = ? AND completada = 1 ORDER BY fecha ASC',
      [usuario_id]
    );
  }
  return db.getAllSync(
    'SELECT * FROM tareas WHERE usuario_id = ? ORDER BY fecha ASC',
    [usuario_id]
  );
};

export const createTarea = (usuario_id, titulo, descripcion, fecha, prioridad) => {
  return db.runSync(
    'INSERT INTO tareas (usuario_id, titulo, descripcion, fecha, prioridad) VALUES (?, ?, ?, ?, ?)',
    [usuario_id, titulo, descripcion, fecha, prioridad]
  );
};

export const updateTarea = (id, titulo, descripcion, fecha, prioridad) => {
  return db.runSync(
    'UPDATE tareas SET titulo = ?, descripcion = ?, fecha = ?, prioridad = ?, updated_at = datetime("now") WHERE id = ?',
    [titulo, descripcion, fecha, prioridad, id]
  );
};

export const completarTarea = (id) => {
  return db.runSync(
    'UPDATE tareas SET completada = 1, updated_at = datetime("now") WHERE id = ?',
    [id]
  );
};

export const deleteTarea = (id) => {
  return db.runSync('DELETE FROM tareas WHERE id = ?', [id]);
};

export const getEstadisticas = (usuario_id) => {
  return db.getFirstSync(
    `SELECT
      SUM(CASE WHEN completada = 1 THEN 1 ELSE 0 END) AS completadas,
      SUM(CASE WHEN completada = 0 THEN 1 ELSE 0 END) AS pendientes
    FROM tareas WHERE usuario_id = ?`,
    [usuario_id]
  );
};

export const getConsejoAleatorio = () => {
  return db.getFirstSync('SELECT texto FROM consejos ORDER BY RANDOM() LIMIT 1');
};

export default db;