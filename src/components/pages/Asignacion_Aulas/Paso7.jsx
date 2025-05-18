'use client';
import React, { useEffect, useState } from 'react';
import { Table, Typography, Tag } from 'antd';

const { Title, Text } = Typography;

export default function Paso7({ dataSource = [], columns = [] }) {
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
          (col) => fila[col] === 0 &&
            !filasTachadas.has(filaIdx) &&
            !columnasTachadas.has(col)
        );
        return { filaIdx, count: disponibles.length, cols: disponibles };
      }).filter(op => op.count > 0);

      if (opciones.length === 0) break;

      const mejor = opciones.reduce((min, curr) => (curr.count < min.count ? curr : min), opciones[0]);
      const colAsignada = mejor.cols[0];

      asignados.push({
        fila: mejor.filaIdx,
        col: colAsignada,
        grupo: matriz[mejor.filaIdx].grupo,
        horario: columns.find(c => c.key === colAsignada)?.title || colAsignada,
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
          nuevaFila[key] = ''; // o mantener el valor original si se desea visualizar todo
        }
      });
      return nuevaFila;
    });

    setAsignaciones(asignados);
    setTablaFinal(tablaCosto);
    setCostoTotal(sumaCostos * 1000); // según el ejemplo
  }, [dataSource, columns]);

  const tabla = [
    { title: 'Grupo', dataIndex: 'grupo', key: 'grupo' },
    ...columns.map(col => ({
      title: col.title,
      dataIndex: col.key,
      key: col.key,
    }))
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Paso 7: Asignación óptima</Title>
      <p>Se realiza la asignación final tachando ceros independientes y calculando el costo mínimo total.</p>

      <Table
        columns={tabla}
        dataSource={tablaFinal}
        pagination={false}
        bordered
        rowKey="key"
      />

      <div style={{ marginTop: 16 }}>
        <Title level={5}>Asignaciones realizadas:</Title>
        {asignaciones.map((a, i) => (
          <Text key={i}>✅ {a.grupo} asignado a {a.horario}<br /></Text>
        ))}

        <div style={{ marginTop: 12 }}>
          <Text strong>Costo total mínimo:</Text> <Text code>{costoTotal.toLocaleString()} euros</Text>
        </div>
      </div>
    </div>
  );
}