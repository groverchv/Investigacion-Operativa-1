/**
 * ============================================
 * BARREL EXPORT: Assignment Feature
 * ============================================
 * Exportaciones centralizadas del modulo de asignacion.
 */

// Pagina principal
export { default as AssignmentPage } from './AssignmentPage';
export { default as AssignmentModule } from './AssignmentModule';

// Componentes de edificios
export { default as CrearModulo } from './components/building/CrearModulo';

// Componentes de materias
export { default as GrupoMateria } from './components/subjects/GrupoMateria';

// Componentes de horarios
export { default as CrearHorario } from './components/schedule/CrearHorario';
export { default as AsignacionHorario } from './components/schedule/AsignacionHorario';

// Componentes de matrices
export { default as MatrizGeneral } from './components/matrix/MatrizGeneral';
export { default as MatrizReducida } from './components/matrix/MatrizReducida';

// Componentes de resultados
export { default as Asignar } from './components/results/Asignar';
export { default as ExportarResultados } from './components/results/ExportarResultados';

// Pasos del algoritmo
export * from './components/steps';
