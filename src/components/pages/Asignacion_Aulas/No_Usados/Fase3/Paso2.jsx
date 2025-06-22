'use client';
import React, { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';

const { Title, Text } = Typography;

export default function Paso2({ dataSource = [], columns = [], filasTachadas = [], columnasTachadas = [], onResolved }) {
  const [matrizReducida, setMatrizReducida] = useState([]);
  const [minimo, setMinimo] = useState(null);

  const horarioKeys = columns.map(col => col.key);

  useEffect(() => {
    // 1. Encontrar mínimo entre elementos NO cubiertos
    let min = Infinity;
    dataSource.forEach((fila, i) => {
      horarioKeys.forEach(k => {
        if (!filasTachadas.includes(i) && !columnasTachadas.includes(k)) {
          if (fila[k] < min) min = fila[k];
        }
      });
    });
    setMinimo(min);

    // 2. Reducir la matriz
    const nueva = dataSource.map((fila, i) => {
      const nuevaFila = {
        key: fila.key || `r${i}`,
        grupo: fila.grupo,
      };

      horarioKeys.forEach(k => {
        let valor = fila[k];
        const filaCubierta = filasTachadas.includes(i);
        const colCubierta = columnasTachadas.includes(k);

        if (!filaCubierta && !colCubierta) {
          valor -= min; // NO cubierto
        } else if (filaCubierta && colCubierta) {
          valor += min; // doblemente cubierto
        }
        // valor sin cambios si cubierto por una sola línea
        nuevaFila[k] = valor;
      });

      return nuevaFila;
    });

    setMatrizReducida(nueva);
    if (onResolved) onResolved(nueva);
  }, [dataSource, columns, filasTachadas, columnasTachadas, onResolved]);

  const columnasTabla = [
    { title: '', dataIndex: 'grupo', key: 'grupo' },
    ...columns.map(col => ({
      title: col.title,
      dataIndex: col.key,
      key: col.key,
    })),
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={4}>Paso 6: Reducción de la matriz</Title>
      <p>
        Se aplica el mínimo <Text code>{minimo}</Text> : se resta a los no cubiertos y se suma a los doblemente cubiertos.
      </p>

      <Table
        dataSource={matrizReducida}
        columns={columnasTabla}
        pagination={false}
        bordered
        rowKey="key"
      />
    </div>
  );
}
