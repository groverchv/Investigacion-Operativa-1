'use client';
import React, { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';

const { Text } = Typography;

export default function Paso2({ dataSource = [], columns = [], onResolved }) {
  const [alreadySent, setAlreadySent] = useState(false);

  // Validar y obtener claves
  const horarioKeys = columns.map(col => col.key).filter(Boolean);

  // Calcular mínimos por columna
  const columnMins = horarioKeys.map(key => {
    const valores = dataSource.map(row => row[key]);
    return Math.min(...valores);
  });

  // Reducir matriz por columnas
  const reducedTable = dataSource.map((row) => {
    const nuevaFila = {
      key: row.key,
      grupo: row.grupo,
    };
    horarioKeys.forEach((k, i) => {
      nuevaFila[k] = row[k] - columnMins[i];
    });
    return nuevaFila;
  });

  // Notificar al padre una sola vez
  useEffect(() => {
    if (!alreadySent && typeof onResolved === 'function') {
      onResolved(reducedTable);
      setAlreadySent(true);
    }
  }, [alreadySent, onResolved, reducedTable]);

  // Columnas para renderizar
  const reducedColumns = [
    {
      title: '',
      dataIndex: 'grupo',
      key: 'grupo',
    },
    ...columns.map(col => ({
      title: col.title,
      dataIndex: col.key,
      key: col.key,
    })),
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Paso 2: Reducción por columnas</h2>
      <p style={{ marginBottom: 16 }}>
        <strong>Iteración 2:</strong> Se escoge el menor de cada columna (horario) y se resta ese valor.
      </p>

      <Table
        dataSource={reducedTable}
        columns={reducedColumns}
        pagination={false}
        bordered
        rowKey="key"
        footer={() => (
          <div style={{ display: 'flex', gap: 16 }}>
            {columnMins.map((min, i) => (
              <Text italic key={i}>{`h${i + 1} = ${min}`}</Text>
            ))}
          </div>
        )}
      />
    </div>
  );
}
