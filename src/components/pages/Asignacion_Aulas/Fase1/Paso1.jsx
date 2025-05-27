'use client';
import React, { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';

const { Text } = Typography;

export default function Paso1({ dataSource = [], columns = [], onResolved }) {
  const [alreadySent, setAlreadySent] = useState(false);

  // Claves válidas de horarios
  const horarioKeys = columns.map(col => col.key).filter(Boolean);

  // Calcular mínimos por fila
  const rowMins = dataSource.map(row =>
    Math.min(...horarioKeys.map(k => row[k]))
  );

  // Generar tabla reducida con columna 'min'
  const reducedTable = dataSource.map((row, rowIndex) => {
    const newRow = {
      key: row.key,
      grupo: row.grupo,
      min: rowMins[rowIndex],
    };
    horarioKeys.forEach(k => {
      newRow[k] = row[k] - rowMins[rowIndex];
    });
    return newRow;
  });

  // Notificar al padre solo una vez sin generar loop
  useEffect(() => {
    if (!alreadySent && typeof onResolved === 'function') {
      const cleanData = reducedTable.map(({ min, ...rest }) => ({ ...rest }));
      onResolved(cleanData);
      setAlreadySent(true);
    }
  }, [alreadySent, onResolved, reducedTable]);

  // Columnas para la tabla visual
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
    {
      title: 'Mín. fila',
      dataIndex: 'min',
      key: 'min',
      render: (val, _, idx) => <Text italic>{`g${idx + 1} = ${val}`}</Text>,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Paso 1: Reducción por filas</h2>
      <p><strong>Iteración 1:</strong> Se escoge el menor de cada fila (grupo) y se resta.</p>
      <Table
        dataSource={reducedTable}
        columns={reducedColumns}
        pagination={false}
        bordered
        rowKey="key"
      />
    </div>
  );
}
