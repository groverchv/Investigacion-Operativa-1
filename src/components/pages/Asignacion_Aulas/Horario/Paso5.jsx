import React, { useEffect } from 'react';
import Tabla from './Modal/tabla'; // Ajusta según tu estructura

export default function Paso5({ columnasPaso4, filasPaso4, filasConLinea, columnasConLinea, onResultado }) {
  const keysColumnas = columnasPaso4
    .filter(col => col.dataIndex !== 'materiaGrupo')
    .map(col => col.dataIndex);

  // Convertir a matriz numérica
  const matriz = filasPaso4.map(fila =>
    keysColumnas.map(key => Number(fila[key]) || 0)
  );

  // Encontrar el menor valor en las celdas no cubiertas
  let menor = Infinity;
  matriz.forEach((fila, i) => {
    fila.forEach((val, j) => {
      const filaCubierta = filasConLinea.includes(i);
      const colCubierta = columnasConLinea.includes(j);
      if (!filaCubierta && !colCubierta) {
        menor = Math.min(menor, val);
      }
    });
  });

  // Aplicar la transformación
  const nuevaMatriz = matriz.map((fila, i) =>
    fila.map((val, j) => {
      const filaCubierta = filasConLinea.includes(i);
      const colCubierta = columnasConLinea.includes(j);
      if (!filaCubierta && !colCubierta) {
        return val - menor;
      }
      if (filaCubierta && colCubierta) {
        return val + menor;
      }
      return val;
    })
  );

  // Crear nuevas filas renderizadas (para la visualización)
  const filasRenderizadas = filasPaso4.map((fila, i) => {
    const nuevaFila = { ...fila };
    keysColumnas.forEach((key, j) => {
      nuevaFila[key] = (
        <div
          style={{
            padding: '4px',
            textAlign: 'center'
          }}
        >
          {nuevaMatriz[i][j]}
        </div>
      );
    });
    return nuevaFila;
  });

  // Crear filas para enviar al Paso6 (datos numéricos reales)
  const filasParaPaso6 = filasPaso4.map((fila, i) => {
    const nuevaFila = { key: fila.key, materiaGrupo: fila.materiaGrupo };
    keysColumnas.forEach((key, j) => {
      nuevaFila[key] = nuevaMatriz[i][j];
    });
    return nuevaFila;
  });

  // Enviar resultado al padre
  useEffect(() => {
    if (onResultado) {
      onResultado(filasParaPaso6);
    }
  }, [filasParaPaso6, onResultado]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Paso 5: Generar más ceros</h2>
      <Tabla
        columnas={columnasPaso4}
        filas={filasRenderizadas}
        titulo="PASO 5: Matriz ajustada con más ceros"
      />
      <p><strong>Menor valor restado:</strong> {menor}</p>
    </div>
  );
}
