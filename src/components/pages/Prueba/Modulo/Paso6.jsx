'use client';
import React, { useEffect } from 'react';
import { Typography } from 'antd';
import Tabla from '../Modal/tabla';

export default function Paso6({
  nombresFilas = [],
  horarios = [],
  setNombreHorario,
  setMatrizPaso6,
  setFilasPaso6,
}) {
  if (!nombresFilas.length || !horarios.length) return null;

  // Generar la matriz y las filas internas
  const columnas = [
    {
      title: 'Materia / Grupo',
      dataIndex: 'grupo',
      key: 'grupo',
      fixed: 'left',
      render: (_, record) => (
        <div style={{ whiteSpace: 'pre-line' }}>
          <strong>{record.materia}</strong><br />
          Grupo {record.grupoNumero} = {record.estudiantes}
        </div>
      ),
    },
    ...horarios.map((h, idx) => ({
      title: (
        <div style={{ textAlign: 'center' }}>
          <strong>{h.nombre || `Horario ${idx + 1}`}</strong><br />
          <span style={{ fontSize: 12 }}>Costo: ${h.costo}</span>
        </div>
      ),
      dataIndex: `col${idx}`,
      key: `col${idx}`,
      align: 'center',
      render: (valor) => (
        <span style={{ color: valor === 1000 ? 'red' : 'black' }}>
          ${valor}
        </span>
      ),
    })),
  ];

  const filas = nombresFilas.map((fila, i) => {
    const nuevaFila = {
      key: `grupo-${i}`,
      materia: fila.materia,
      grupoNumero: fila.grupo?.match(/\d+/)?.[0] || '-',
      estudiantes: Number(fila.estudiantes),
    };

    horarios.forEach((h, j) => {
      const suma = Number(h.costo) + nuevaFila.estudiantes;
      nuevaFila[`col${j}`] = suma;
    });

    return nuevaFila;
  });

  const matrizCostos = nombresFilas.map((fila) =>
    horarios.map((h) => Number(h.costo) + Number(fila.estudiantes))
  );

  // Exportar los datos hacia el componente padre
  useEffect(() => {
    if (typeof setNombreHorario === 'function') {
      const nombreHorario = horarios.map((h, idx) => h.nombre || `Horario ${idx + 1}`);
      setNombreHorario(nombreHorario);
    }

    if (typeof setMatrizPaso6 === 'function') {
      setMatrizPaso6(matrizCostos);
    }

    if (typeof setFilasPaso6 === 'function') {
      setFilasPaso6(nombresFilas);
    }
  }, [horarios, nombresFilas]);

  return (
    <div style={{ marginTop: 32 }}>
      <Typography.Title level={4}>
  
      </Typography.Title>
      <Tabla
        columnas={columnas}
        filas={filas}
        titulo="Paso 6 Horarios"
        scrollY={260}
      />
    </div>
  );
}
