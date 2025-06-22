'use client';
import React, { useEffect, useState } from 'react';
import { Table, Typography, Tag } from 'antd';

const { Title } = Typography;

export default function Paso1({ dataSource = [], columns = [], onResolved }) {
  const [asignaciones, setAsignaciones] = useState([]);
  const [tablaFinal, setTablaFinal] = useState([]);
  const [costoTotal, setCostoTotal] = useState(0);

  const horarioKeys = columns.map(col => col.key);

  useEffect(() => {
    const matriz = JSON.parse(JSON.stringify(dataSource));
    const asignados = [];
    const filasTachadas = new Set();
    const columnasTachadas = new Set();
    let sumaCostos = 0;

    while (asignados.length < Math.min(matriz.length, horarioKeys.length)) {
      const opciones = matriz.map((fila, filaIdx) => {
        const disponibles = horarioKeys.filter(
          (col) =>
            fila[col] === 0 &&
            !filasTachadas.has(filaIdx) &&
            !columnasTachadas.has(col)
        );
        return { filaIdx, count: disponibles.length, cols: disponibles };
      }).filter(op => op.count > 0);

      if (opciones.length === 0) break;

      const mejor = opciones.reduce(
        (min, curr) => (curr.count < min.count ? curr : min),
        opciones[0]
      );
      const colAsignada = mejor.cols[0];

      asignados.push({
        fila: mejor.filaIdx,
        col: colAsignada, // <- usamos key, no título
        grupo: matriz[mejor.filaIdx].grupo,
        horario: columns.find(c => c.key === colAsignada)?.title || colAsignada,
        costo: dataSource[mejor.filaIdx][colAsignada],
      });

      filasTachadas.add(mejor.filaIdx);
      columnasTachadas.add(colAsignada);
    }

    const tablaCosto = matriz.map((fila, filaIdx) => {
      const nuevaFila = { key: fila.key, grupo: fila.grupo };
      horarioKeys.forEach(key => {
        const asignada = asignados.find(a => a.fila === filaIdx && a.col === key);
        if (asignada) {
          const original = dataSource[filaIdx][key];
          sumaCostos += original;
          nuevaFila[key] = (
            <Tag color="green" style={{ fontWeight: 'bold' }}>{original}</Tag>
          );
        } else {
          nuevaFila[key] = '';
        }
      });
      return nuevaFila;
    });

    setAsignaciones(asignados);
    setTablaFinal(tablaCosto);
    setCostoTotal(sumaCostos * 1000);

    if (onResolved) {
      onResolved(asignados, sumaCostos * 1000); // ✅ Enviar asignaciones y costo
    }
  }, [dataSource, columns]);

  const tabla = [
    { title: '', dataIndex: 'grupo', key: 'grupo' },
    ...columns.map(col => ({
      title: col.title,
      dataIndex: col.key,
      key: col.key,
    }))
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Paso 7: Asignación óptima</Title>

      <Table
        columns={tabla}
        dataSource={tablaFinal}
        pagination={false}
        bordered
        rowKey="key"
      />
    </div>
  );
}
