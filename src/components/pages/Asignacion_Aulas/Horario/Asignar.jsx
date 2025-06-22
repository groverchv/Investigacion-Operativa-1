import React from 'react';
import Tabla from '../Modal/tabla';
import { useDatosCompartidos } from './DatosContext';

export default function Asignar({ columnas, filasPaso1, filasPaso8, horarios }) {
  const { datosCompartidos } = useDatosCompartidos();

  const keysColumnas = columnas
    .filter(col => col.dataIndex !== 'materiaGrupo')
    .map(col => col.dataIndex);

  // 👉 Buscar asignaciones: un cero por fila sin repetir columna
  const asignaciones = [];
  const columnasUsadas = new Set();

  filasPaso8.forEach((fila, filaIndex) => {
    for (const key of keysColumnas) {
      const colIndex = keysColumnas.indexOf(key);
      const valorPaso8 = Number(fila[key]) || 0;
      if (valorPaso8 === 0 && !columnasUsadas.has(colIndex)) {
        asignaciones.push({ filaIndex, colIndex, key });
        columnasUsadas.add(colIndex);
        break;
      }
    }
  });

  // 👉 Generar tabla renderizada
  const filasMarcadas = filasPaso1.map((fila, filaIndex) => {
    const nuevaFila = { ...fila };

    keysColumnas.forEach((key, colIndex) => {
      const valorOriginal = fila[key];
      const valorPaso8 = Number(filasPaso8?.[filaIndex]?.[key]) || 0;

      const esAsignado = asignaciones.some(
        asig => asig.filaIndex === filaIndex && asig.colIndex === colIndex
      );

      nuevaFila[key] = (
        <div
          style={{
            backgroundColor: esAsignado
              ? 'orange'
              : valorPaso8 === 0
              ? 'yellow'
              : undefined,
            padding: '4px',
            textAlign: 'center',
            borderRadius: '2px',
          }}
        >
          {valorOriginal}
        </div>
      );
    });

    return nuevaFila;
  });

  return (
    <div style={{ padding: 24 }}>
      <h2>Matriz de Asignaciones (con asignaciones y ceros marcados)</h2>
      <Tabla columnas={columnas} filas={filasMarcadas} titulo="Matriz Asignada" />

      <h3 style={{ marginTop: '24px' }}>Resultados de la asignación</h3>
      <ul>
        {asignaciones.map((asig, idx) => {
          const grupoInfo = datosCompartidos?.[asig.filaIndex];
          const horario = horarios[asig.colIndex];

          if (!grupoInfo || !horario) return null;

          return (
            <li key={idx}>
              ✅ Al grupo {grupoInfo.grupo} de la materia "{grupoInfo.materia}" con {grupoInfo.estudiantes} estudiantes se le asignó el aula {grupoInfo.aula} del {grupoInfo.piso} que tiene una capacidad de {grupoInfo.capacidad} personas en el horario {horario.inicio} - {horario.fin}.
            </li>
          );
        })}
      </ul>
    </div>
  );
}
