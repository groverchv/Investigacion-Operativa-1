'use client';
import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import Tabla from '../Modal/tabla';

export default function Paso9({
  matriz = [],
  nombresColumnas = [],
  nombresFilas = [],
  setMatrizPaso9,
  setFilasPaso9,
  setColumnasPaso9
}) {
  const [reduccionColumnas, setReduccionColumnas] = useState([]);
  const [matrizReducida, setMatrizReducida] = useState([]);

  useEffect(() => {
    if (!matriz.length || !matriz[0]) return;

    const numFilas = matriz.length;
    const numColumnas = matriz[0].length;

    const minimos = Array(numColumnas).fill(Infinity);
    for (let j = 0; j < numColumnas; j++) {
      for (let i = 0; i < numFilas; i++) {
        if (matriz[i][j] < minimos[j]) minimos[j] = matriz[i][j];
      }
    }

    const nuevaMatriz = matriz.map((fila, i) =>
      fila.map((val, j) => val - minimos[j])
    );

    setReduccionColumnas(minimos);
    setMatrizReducida(nuevaMatriz);

    setMatrizPaso9?.(nuevaMatriz);
    setFilasPaso9?.(nombresFilas);
    setColumnasPaso9?.(nombresColumnas);
  }, [matriz]);

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
    }))
  ];

  const filasTabla = matrizReducida.map((fila, i) => {
    const filaObj = {
      key: `fila-${i}`,
      materia: nombresFilas[i]?.materia || `Materia ${i + 1}`,
      grupo: nombresFilas[i]?.grupo || `Grupo ${i + 1}`,
      estudiantes: nombresFilas[i]?.estudiantes ?? 0
    };
    fila.forEach((val, j) => {
      filaObj[`col${j}`] = val;
    });
    return filaObj;
  });

  // Agregar la fila de reducción
  const filaReduccion = {
    key: 'reduccion-final',
    grupo: <strong style={{ color: '#1677ff' }}>Reducción</strong>,
    materia: '',
    estudiantes: ''
  };
  reduccionColumnas.forEach((val, j) => {
    filaReduccion[`col${j}`] = <strong style={{ color: '#1677ff' }}>{val}</strong>;
  });

  const filasConReduccion = [...filasTabla, filaReduccion];

  return (
    <div style={{ marginTop: 32 }}>
      <Typography.Title level={4}>Paso 9 — Reducción por Columnas</Typography.Title>
      <Tabla
        columnas={columnasTabla}
        filas={filasConReduccion}
        titulo="Matriz reducida por columnas"
        scrollY={260}
      />
    </div>
  );
}
