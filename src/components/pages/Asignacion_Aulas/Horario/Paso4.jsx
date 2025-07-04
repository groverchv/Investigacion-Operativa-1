import React, { useEffect } from 'react';
import Tabla from '../../Prueba/Modal/tabla'; // Ajusta según tu estructura

export default function Paso4({ columnasPaso3, filasPaso3, onResultado }) {
  const keysColumnas = columnasPaso3
    .filter(col => col.dataIndex !== 'materiaGrupo')
    .map(col => col.dataIndex);

  const matriz = filasPaso3.map(fila =>
    keysColumnas.map(key => Number(fila[key]) || 0)
  );

  const N = matriz.length;

  // === Método A: húngaro simplificado ===
  const filasMarcadasA = new Set();
  matriz.forEach((fila, i) => {
    if (!fila.some(val => val === 0)) {
      filasMarcadasA.add(i);
    }
  });

  let columnasMarcadasA = new Set();
  let cambiado = true;
  while (cambiado) {
    cambiado = false;

    filasMarcadasA.forEach(i => {
      matriz[i].forEach((val, j) => {
        if (val === 0 && !columnasMarcadasA.has(j)) {
          columnasMarcadasA.add(j);
          cambiado = true;
        }
      });
    });

    matriz.forEach((fila, i) => {
      fila.forEach((val, j) => {
        if (val === 0 && columnasMarcadasA.has(j) && !filasMarcadasA.has(i)) {
          filasMarcadasA.add(i);
          cambiado = true;
        }
      });
    });
  }

  const filasConLineaA = [];
  for (let i = 0; i < N; i++) {
    if (!filasMarcadasA.has(i)) {
      filasConLineaA.push(i);
    }
  }
  const columnasConLineaA = Array.from(columnasMarcadasA);
  const totalLineasA = filasConLineaA.length + columnasConLineaA.length;

  // === Método B: filas/columnas con todos ceros ===
  const filasConLineaB = matriz
    .map((fila, i) => fila.every(val => val === 0) ? i : null)
    .filter(i => i !== null);

  const columnasConLineaB = keysColumnas
    .map((_, j) => matriz.every(row => row[j] === 0) ? j : null)
    .filter(j => j !== null);

  const totalLineasB = filasConLineaB.length + columnasConLineaB.length;

  // === Elegir mejor ===
  const usarA = totalLineasA <= totalLineasB;

  const filasConLinea = usarA ? filasConLineaA : filasConLineaB;
  const columnasConLinea = usarA ? columnasConLineaA : columnasConLineaB;
  const totalLineas = usarA ? totalLineasA : totalLineasB;

  const cumple = totalLineas >= N
    ? '✅ Cumple: podemos empezar a realizar asignaciones.'
    : '❌ No cumple: se deben encontrar más ceros.';

  const filasRenderizadas = filasPaso3.map((fila, filaIndex) => {
    const nuevaFila = { ...fila };
    keysColumnas.forEach((key, colIndex) => {
      const valor = Number(fila[key]);
      const cubierto = filasConLinea.includes(filaIndex) || columnasConLinea.includes(colIndex);
      nuevaFila[key] = (
        <div
          style={{
            backgroundColor: cubierto ? '#00ff00' : undefined,
            padding: '4px',
            borderRadius: '2px',
            textAlign: 'center',
          }}
        >
          {valor}
        </div>
      );
    });
    return nuevaFila;
  });

  // Enviar resultado al padre
  useEffect(() => {
    if (onResultado) {
      onResultado({
        filas: filasPaso3,
        filasConLinea,
        columnasConLinea
      });
    }
  }, [filasPaso3, filasConLinea, columnasConLinea, onResultado]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Paso 4: Cubrir ceros con líneas (Comparando estrategias)</h2>
      <Tabla
        columnas={columnasPaso3}
        filas={filasRenderizadas}
        titulo="PASO 4: Cubrir ceros con líneas"
      />
      <div style={{ marginTop: '16px' }}>
        <p><strong>Total de filas tachadas:</strong> {filasConLinea.length}</p>
        <p><strong>Total de columnas tachadas:</strong> {columnasConLinea.length}</p>
        <p><strong>Total de líneas usadas:</strong> {totalLineas}</p>
        <p style={{ color: cumple.includes('✅') ? 'green' : 'red', fontWeight: 'bold' }}>
          Resultado: {cumple}
        </p>
        <p style={{ fontStyle: 'italic' }}>
          Estrategia usada: {usarA ? 'Método Húngaro simplificado' : 'Filas/columnas con puros ceros'}
        </p>
      </div>
    </div>
  );
}
