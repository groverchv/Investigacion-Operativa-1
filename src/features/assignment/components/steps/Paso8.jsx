'use client';

import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import Tabla from '../../../../components/common/TablaModal';

/**
 * Paso8 — Reducción por filas (fase inicial del método húngaro).
 * Para cada fila, se resta el valor mínimo a todos sus elementos.
 * Esta operación garantiza que al menos un cero quede en cada fila,
 * lo que facilita la aplicación de pasos posteriores del algoritmo.
 */
export default function Paso8({
  matriz = [],                  // Matriz de costos original (por ejemplo, de Paso7)
  nombresFilas = [],           // Lista de grupos (filas)
  nombresColumnas = [],        // Lista de horarios (columnas)
  setMatrizPaso8,              // Setter para matriz reducida que se exportará
  setFilasPaso8,               // Setter para filas (sin modificar)
  setColumnasPaso8             // Setter para columnas (sin modificar)
}) {
  // Estado para almacenar los valores mínimos de cada fila (reducción aplicada)
  const [reduccionFilas, setReduccionFilas] = useState([]);

  // Estado para almacenar la matriz resultante después de la reducción por filas
  const [matrizReducida, setMatrizReducida] = useState([]);

  // Al montar el componente o cambiar entradas, calculamos la reducción
  useEffect(() => {
    if (!matriz.length || !matriz[0]) return;

    // 1. Para cada fila, obtenemos su valor mínimo
    const minimos = matriz.map(fila => Math.min(...fila));

    // 2. Restamos ese valor mínimo a cada elemento de la fila
    const nuevaMatriz = matriz.map((fila, i) =>
      fila.map(val => val - minimos[i])
    );

    // Guardamos resultados en el estado
    setReduccionFilas(minimos);
    setMatrizReducida(nuevaMatriz);

    // Enviamos los resultados al componente padre
    setMatrizPaso8?.(nuevaMatriz);
    setFilasPaso8?.(nombresFilas);
    setColumnasPaso8?.(nombresColumnas);
  }, [matriz, nombresFilas, nombresColumnas]);

  // Si la matriz aún no está lista, no renderizamos nada
  if (!matrizReducida.length) return null;

  // Definimos las columnas de la tabla, incluyendo la reducción aplicada al final
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

  // Construimos las filas para visualizar en la tabla
  const filasTabla = matrizReducida.map((fila, i) => {
    const filaObj = {
      key: `fila-${i}`,
      materia: nombresFilas[i]?.materia || `Materia ${i + 1}`,
      grupo: nombresFilas[i]?.grupo || `Grupo ${i + 1}`,
      estudiantes: nombresFilas[i]?.estudiantes ?? 0,
      reduccion: (
        <strong style={{ color: '#1677ff' }}>
          {reduccionFilas[i]}
        </strong>
      )
    };

    // Asignamos los valores de cada columna
    fila.forEach((val, j) => {
      filaObj[`col${j}`] = val;
    });

    return filaObj;
  });

  return (
    <div style={{ marginTop: 32 }}>
      <Tabla
        columnas={columnasTabla}
        filas={filasTabla}
        titulo="Matriz reducida por filas"
        scrollY={260}
      />
    </div>
  );
}
