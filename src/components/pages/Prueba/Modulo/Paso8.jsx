'use client';
import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import Tabla from '../Modal/tabla';

export default function Paso8({
  matriz = [],
  nombresFilas = [],
  nombresColumnas = [],
  setMatrizPaso8,
  setFilasPaso8,
  setColumnasPaso8
}) {
  const [reduccionFilas, setReduccionFilas] = useState([]);
  const [matrizReducida, setMatrizReducida] = useState([]);

  useEffect(() => {
    if (!matriz.length || !matriz[0]) return;

    const minimos = matriz.map(fila => Math.min(...fila));
    const nuevaMatriz = matriz.map((fila, i) => fila.map(val => val - minimos[i]));

    setReduccionFilas(minimos);
    setMatrizReducida(nuevaMatriz);

    // Compartir datos como en Paso7
    setMatrizPaso8?.(nuevaMatriz);
    setFilasPaso8?.(nombresFilas);
    setColumnasPaso8?.(nombresColumnas);
  }, [matriz, nombresFilas, nombresColumnas]);

  if (!matrizReducida.length) return null;

  const columnasTabla = [
    {
      title: 'Materia / Grupo',
      dataIndex: 'grupo',
      key: 'grupo',
      render: (_, record) => (
        <div style={{ whiteSpace: 'pre-line' }}>
          <strong>{record.materia}</strong><br />
          Grupo {record.grupo} = {record.estudiantes}
        </div>
      ),
    },
    ...nombresColumnas.map((col, j) => ({
      title: col.nombre || `Horario ${j + 1}`,
      dataIndex: `col${j}`,
      key: `col${j}`,
      align: 'center',
    })),
    {
      title: 'Reducción por fila',
      dataIndex: 'reduccion',
      key: 'reduccion',
      align: 'center',
    }
  ];

  const filasTabla = matrizReducida.map((fila, i) => {
    const filaObj = {
      key: `fila-${i}`,
      materia: nombresFilas[i]?.materia || `Materia ${i + 1}`,
      grupo: nombresFilas[i]?.grupo || `Grupo ${i + 1}`,
      estudiantes: nombresFilas[i]?.estudiantes ?? 0,
      reduccion: <strong style={{ color: '#1677ff' }}>{reduccionFilas[i]}</strong>
    };
    fila.forEach((val, j) => {
      filaObj[`col${j}`] = val;
    });
    return filaObj;
  });

  return (
    <div style={{ marginTop: 32 }}>
      <Typography.Title level={4}>Paso 8 — Reducción por Filas</Typography.Title>
      <Tabla
        columnas={columnasTabla}
        filas={filasTabla}
        titulo="Matriz reducida por filas"
        scrollY={260}
      />
    </div>
  );
}
