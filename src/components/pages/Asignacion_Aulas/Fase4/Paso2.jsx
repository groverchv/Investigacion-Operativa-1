'use client';
import React, { useEffect, useState } from 'react';
import { Table, Typography, Tag } from 'antd';

const { Title, Text, Paragraph } = Typography;

export default function Paso2({ dataSource = [], columns = [], asignaciones = [] }) {
  const [tablaPaso0Marcada, setTablaPaso0Marcada] = useState([]);

  useEffect(() => {
    const horarioKeys = columns.map(col => col.key);

    const tablaPaso0 = dataSource.map((fila, filaIdx) => {
      const nuevaFila = { key: fila.key, grupo: fila.grupo };

      horarioKeys.forEach(key => {
        const esAsignacion = asignaciones.some(
          a => a.fila === filaIdx && a.col === key
        );
        const valor = fila[key];
        nuevaFila[key] = esAsignacion ? (
          <Tag color="green" style={{ fontWeight: 'bold' }}>
            {valor}
          </Tag>
        ) : valor;
      });

      return nuevaFila;
    });

    setTablaPaso0Marcada(tablaPaso0);
  }, [dataSource, columns, asignaciones]);

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
      <Title level={3}>Paso 8: Asignaciones y tabla original marcada</Title>

      <Title level={5}>Tabla original con celdas asignadas marcadas:</Title>
      <Table
        columns={tabla}
        dataSource={tablaPaso0Marcada}
        pagination={false}
        bordered
        rowKey="key"
      />

      <div style={{ marginTop: 32 }}>
        <Title level={5}>Asignaciones realizadas:</Title>
        {asignaciones.map((a, i) => {
          const cantidad = dataSource[a.fila]?.[a.col] ?? '?';
          return (
            <Paragraph key={i}>
              ✅ Se asignaron <strong>{cantidad}</strong> estudiantes del <strong>{a.grupo}</strong> al <strong>{a.horario}</strong>.
            </Paragraph>
          );
        })}
      </div>
    </div>
  );
}
