/**
 * ============================================
 * CONSTANTES: Configuracion del Sistema
 * ============================================
 * Valores constantes utilizados en toda la aplicacion.
 */

/**
 * Colores del tema
 */
export const COLORS = {
  primary: '#2563eb',
  primaryDark: '#1e40af',
  secondary: '#64748b',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  
  // Fondos
  bgPrimary: '#ffffff',
  bgSecondary: '#f8fafc',
  bgTertiary: '#f1f5f9',
  
  // Textos
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  
  // Bordes
  border: '#e2e8f0',
  borderHover: '#cbd5e1',
};

/**
 * Configuracion del algoritmo hungaro
 */
export const HUNGARIAN_CONFIG = {
  // Umbral para considerar un valor como ficticio
  THRESHOLD_FICTITIOUS: 1000,
  
  // Valor maximo para celdas ficticias
  MAX_FICTITIOUS_VALUE: 99999,
  
  // Numero maximo de iteraciones
  MAX_ITERATIONS: 100,
};

/**
 * Horarios predeterminados del sistema
 */
export const DEFAULT_SCHEDULES = [
  { nombre: 'Horario 1', inicio: '07:00', fin: '09:15', costo: 50 },
  { nombre: 'Horario 2', inicio: '09:15', fin: '11:30', costo: 40 },
  { nombre: 'Horario 3', inicio: '11:30', fin: '13:45', costo: 45 },
  { nombre: 'Horario 4', inicio: '14:00', fin: '16:15', costo: 45 },
  { nombre: 'Horario 5', inicio: '16:15', fin: '18:30', costo: 40 },
  { nombre: 'Horario 6', inicio: '18:30', fin: '20:45', costo: 35 },
];

/**
 * Configuracion de responsividad
 */
export const BREAKPOINTS = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

/**
 * Mensajes del sistema
 */
export const MESSAGES = {
  SUCCESS_ASSIGNMENT: 'Asignacion completada exitosamente',
  ERROR_NO_DATA: 'No hay datos suficientes para realizar la asignacion',
  WARNING_INCOMPLETE: 'Complete todos los campos requeridos',
};
