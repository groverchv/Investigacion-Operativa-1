'use client';

import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import Tabla from '../Modal/tabla';

/**
 * Paso9 — Reducción por columnas.
 * Para cada columna, se resta el valor mínimo a todos sus elementos.
 * El objetivo es asegurar al menos un cero por columna en la matriz reducida.
 */
export default function Paso9({
  matriz = [],                  // Matriz resultante del Paso 8
  nombresColumnas = [],        // Lista de columnas (horarios)
  nombresFilas = [],           // Lista de filas (grupos)
  setMatrizPaso9,              // Setter para matriz reducida por columnas
  setFilasPaso9,               // Setter para filas (sin modificar)
  setColumnasPaso9             // Setter para columnas (sin modificar)
}) {
  const [reduccionColumnas, setReduccionColumnas] = useState([]);
  const [matrizReducida, setMatrizReducida] = useState([]);

  useEffect(() => {
    if (!matriz.length || !matriz[0]) return;

    const numFilas = matriz.length;
    const numColumnas = matriz[0].length;

    // 1. Obtener el mínimo de cada columna
    const minimos = Array(numColumnas).fill(Infinity);
    for (let j = 0; j < numColumnas; j++) {
      for (let i = 0; i < numFilas; i++) {
        if (matriz[i][j] < minimos[j]) minimos[j] = matriz[i][j];
      }
    }

    // 2. Restar el mínimo de su columna a cada elemento
    const nuevaMatriz = matriz.map((fila, i) =>
      fila.map((val, j) => val - minimos[j])
    );

    setReduccionColumnas(minimos);
    setMatrizReducida(nuevaMatriz);

    // Exportar resultados al componente padre
    setMatrizPaso9?.(nuevaMatriz);
    setFilasPaso9?.(nombresFilas);
    setColumnasPaso9?.(nombresColumnas);
  }, [matriz]);

  // Si no hay datos, no renderizar nada
  if (!matrizReducida.length) return null;

  // Definición de columnas para la tabla
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

  // Construcción de las filas de la tabla
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

  // Fila adicional para mostrar la reducción aplicada a cada columna
  const filaReduccion = {
    key: 'reduccion-final',
    grupo: <strong style={{ color: '#1677ff' }}>Reducción</strong>,
    materia: '',
    estudiantes: ''
  };
  reduccionColumnas.forEach((val, j) => {
    filaReduccion[`col${j}`] = <strong style={{ color: '#1677ff' }}>{val}</strong>;
  });

  // Agregamos la fila de reducción como última fila en la tabla
  const filasConReduccion = [...filasTabla, filaReduccion];

  return (
    <div style={{ marginTop: 32 }}>
      <Tabla
        columnas={columnasTabla}
        filas={filasConReduccion}
        titulo="Matriz reducida por columnas"
        scrollY={260}
      />
    </div>
  );
}
