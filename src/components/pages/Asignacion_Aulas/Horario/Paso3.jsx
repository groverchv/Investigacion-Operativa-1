import React, { useEffect } from 'react';
import Tabla from './Modal/tabla'; // Ajusta el path según tu estructura

export default function Paso3({ columnasPaso2, filasPaso2, onResultado }) {
  // Filtrar solo las claves de columnas (H1, H2, etc)
  const keysColumnas = columnasPaso2
    .filter(col => col.dataIndex !== 'materiaGrupo')
    .map(col => col.dataIndex);

  // Encontrar el mínimo por columna
  const minPorColumna = {};
  keysColumnas.forEach(key => {
    const valores = filasPaso2.map(fila => Number(fila[key]) || 0);
    minPorColumna[key] = Math.min(...valores);
  });

  // Crear nuevas filas reducidas por columnas
  const filasPaso3 = filasPaso2.map(fila => {
    const nuevaFila = {
      key: fila.key,
      materiaGrupo: fila.materiaGrupo,
    };

    keysColumnas.forEach(key => {
      const valor = Number(fila[key]) || 0;
      nuevaFila[key] = valor - minPorColumna[key];
    });

    return nuevaFila;
  });

  // Compartir el resultado con el padre
  useEffect(() => {
    if (onResultado) {
      onResultado(filasPaso3);
    }
  }, [filasPaso3, onResultado]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Paso 3: Reducción por Columnas</h2>
      <Tabla
        columnas={columnasPaso2}
        filas={filasPaso3}
        titulo="Matriz Paso 3"
      />
    </div>
  );
}
