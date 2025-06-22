import React, { useEffect } from 'react';
import Tabla from '../Modal/tabla';

export default function Paso6({ columnas, filas, onResultado }) {
  if (!filas || filas.length === 0) {
    return (
      <div style={{ padding: 24 }}>
        <h2>PASO 6: Cubrir ceros con mínimo de líneas</h2>
        <p style={{ color: 'gray' }}>⚠ No hay datos disponibles.</p>
      </div>
    );
  }

  const keysColumnas = columnas
    .filter(col => col.dataIndex !== 'materiaGrupo')
    .map(col => col.dataIndex);

  const matriz = filas.map(fila =>
    keysColumnas.map(key => Number(fila[key]) || 0)
  );

  const N = matriz.length;
  const M = keysColumnas.length;

  // Construir grafo de ceros
  const ceros = [];
  matriz.forEach((fila, i) => {
    fila.forEach((val, j) => {
      if (val === 0) ceros.push([i, j]);
    });
  });

  // Matching máximo
  const matchCol = Array(M).fill(-1);
  function bpm(u, seen) {
    for (const [i, j] of ceros) {
      if (i !== u) continue;
      if (seen[j]) continue;
      seen[j] = true;
      if (matchCol[j] === -1 || bpm(matchCol[j], seen)) {
        matchCol[j] = u;
        return true;
      }
    }
    return false;
  }

  for (let u = 0; u < N; u++) {
    bpm(u, Array(M).fill(false));
  }

  // Marcar filas y columnas
  const filasMarcadas = Array(N).fill(false);
  const colsMarcadas = Array(M).fill(false);

  for (let i = 0; i < N; i++) {
    if (!matchCol.includes(i)) {
      dfs(i);
    }
  }

  function dfs(u) {
    filasMarcadas[u] = true;
    for (const [i, j] of ceros) {
      if (i === u && !colsMarcadas[j]) {
        colsMarcadas[j] = true;
        if (matchCol[j] !== -1 && !filasMarcadas[matchCol[j]]) {
          dfs(matchCol[j]);
        }
      }
    }
  }

  const filasConLinea = filasMarcadas.map((m, i) => !m ? i : null).filter(i => i !== null);
  const columnasConLinea = colsMarcadas.map((m, j) => m ? j : null).filter(j => j !== null);
  const totalLineas = filasConLinea.length + columnasConLinea.length;

  // Renderizado
  const filasRenderizadas = filas.map((fila, i) => {
    const nuevaFila = { ...fila };
    keysColumnas.forEach((key, j) => {
      const valor = Number(fila[key]);
      const cubierto = filasConLinea.includes(i) || columnasConLinea.includes(j);
      nuevaFila[key] = (
        <div
          style={{
            backgroundColor: cubierto ? '#00ff00' : undefined,
            padding: '4px',
            textAlign: 'center',
            borderRadius: '2px'
          }}
        >
          {valor}
        </div>
      );
    });
    return nuevaFila;
  });

  // Compartir con el padre
  useEffect(() => {
    if (onResultado) {
      onResultado({
        filas,               // La matriz actual
        filasConLinea,       // Índices de filas tachadas
        columnasConLinea     // Índices de columnas tachadas
      });
    }
  }, [filas, filasConLinea, columnasConLinea, onResultado]);

  return (
    <div style={{ padding: 24 }}>
      <h2>PASO 6: Cubrir ceros con mínimo de líneas</h2>
      <Tabla
        columnas={columnas}
        filas={filasRenderizadas}
        titulo="PASO 6: Cubrir ceros con líneas"
      />
      <div style={{ marginTop: '16px' }}>
        <p><strong>Total de filas tachadas:</strong> {filasConLinea.join(', ') || 'Ninguna'}</p>
        <p><strong>Total de columnas tachadas:</strong> {columnasConLinea.join(', ') || 'Ninguna'}</p>
        <p><strong>Total de líneas usadas:</strong> {totalLineas}</p>
        <p style={{ color: totalLineas >= N ? 'green' : 'red', fontWeight: 'bold' }}>
          Resultado: {totalLineas >= N
            ? '✅ Cumple: podemos empezar a realizar asignaciones.'
            : '❌ No cumple: se deben encontrar más ceros.'
          }
        </p>
      </div>
    </div>
  );
}
