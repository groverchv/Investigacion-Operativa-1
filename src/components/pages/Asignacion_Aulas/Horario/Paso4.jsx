import React from 'react';
import { Table } from 'antd';

export default function Paso4({ columnasPaso3, filasPaso3 }) {
  const keysColumnas = columnasPaso3
    .filter(col => col.dataIndex !== 'materiaGrupo')
    .map(col => col.dataIndex);

  const matriz = filasPaso3.map(fila =>
    keysColumnas.map(key => Number(fila[key]) || 0)
  );

  const N = matriz.length;

  // Paso húngaro: encontrar mínimo de rectas
  const filasMarcadas = new Set();
  matriz.forEach((fila, i) => {
    const tieneCero = fila.some(val => val === 0);
    if (!tieneCero) {
      filasMarcadas.add(i);
    }
  });

  let columnasMarcadas = new Set();
  let cambiado = true;

  while (cambiado) {
    cambiado = false;

    filasMarcadas.forEach(i => {
      matriz[i].forEach((val, j) => {
        if (val === 0 && !columnasMarcadas.has(j)) {
          columnasMarcadas.add(j);
          cambiado = true;
        }
      });
    });

    matriz.forEach((fila, i) => {
      fila.forEach((val, j) => {
        if (val === 0 && columnasMarcadas.has(j) && !filasMarcadas.has(i)) {
          filasMarcadas.add(i);
          cambiado = true;
        }
      });
    });
  }

  const filasConLinea = [];
  for (let i = 0; i < N; i++) {
    if (!filasMarcadas.has(i)) {
      filasConLinea.push(i);
    }
  }

  const columnasConLinea = Array.from(columnasMarcadas);

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

  const totalLineas = filasConLinea.length + columnasConLinea.length;
  const cumple = totalLineas >= N
    ? '✅ Cumple: suficientes líneas para cubrir todos los ceros.'
    : '❌ No cumple: se deben encontrar más ceros.';

  return (
    <div style={{ padding: 24 }}>
      <h2>Paso 4: Cubrir ceros con líneas (Mínimo de rectas)</h2>
      <Table
        columns={columnasPaso3}
        dataSource={filasRenderizadas}
        pagination={false}
        bordered
      />
      <div style={{ marginTop: '16px' }}>
        <p><strong>Total de filas tachadas:</strong> {filasConLinea.length}</p>
        <p><strong>Total de columnas tachadas:</strong> {columnasConLinea.length}</p>
        <p><strong>Total de líneas usadas:</strong> {totalLineas}</p>
        <p style={{ color: cumple.includes('✅') ? 'green' : 'red' }}><strong>Resultado:</strong> {cumple}</p>
      </div>
    </div>
  );
}
