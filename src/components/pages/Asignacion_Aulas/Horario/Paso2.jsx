import React, { useEffect } from 'react';
import Tabla from './Modal/tabla'; // Ajusta el path según tu estructura

export default function Paso2({ columnasPaso1, filasPaso1, onResultado }) {
  // Crear nuevas filas reducidas
  const filasPaso2 = filasPaso1.map((fila) => {
    // Filtrar solo las claves de columnas (H1, H2, etc)
    const keysColumnas = columnasPaso1
      .filter(col => col.dataIndex !== 'materiaGrupo')
      .map(col => col.dataIndex);

    // Extraer los valores numéricos de la fila
    const valoresFila = keysColumnas.map(key => Number(fila[key]) || 0);

    // Encontrar el mínimo de la fila
    const minFila = Math.min(...valoresFila);

    // Construir nueva fila reducida
    const nuevaFila = {
      key: fila.key,
      materiaGrupo: fila.materiaGrupo,
    };

    keysColumnas.forEach((key, colIndex) => {
      nuevaFila[key] = (valoresFila[colIndex] - minFila);
    });

    return nuevaFila;
  });

  // Compartir el resultado con el padre
  useEffect(() => {
    if (onResultado) {
      onResultado(filasPaso2);
    }
  }, [filasPaso2, onResultado]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Paso 2: Reducción por Filas</h2>
      <Tabla
        columnas={columnasPaso1}
        filas={filasPaso2}
        titulo="Matriz Paso 2"
      />
    </div>
  );
}
