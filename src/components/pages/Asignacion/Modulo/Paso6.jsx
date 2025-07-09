'use client';

import React, { useEffect } from 'react';
import { Typography } from 'antd';
import Tabla from '../Modal/tabla';

/**
 * Componente Paso6:
 * Calcula el costo total por asignar a cada grupo un horario específico.
 * El costo se obtiene sumando la cantidad de estudiantes del grupo + el costo base del horario.
 * Luego, se construye una matriz de costos que se envía al componente padre.
 */
export default function Paso6({
  nombresFilas = [],       // Lista de grupos (nombre materia, grupo, cantidad estudiantes)
  horarios = [],           // Lista de horarios disponibles (con nombre y costo)
  setNombreHorario,        // Setter para nombres de columnas/horarios en el padre
  setMatrizPaso6,          // Setter para la matriz de costos resultante
  setFilasPaso6,           // Setter para las filas de grupos utilizadas
}) {
  // Validación: si no hay datos, no renderiza nada
  if (!nombresFilas.length || !horarios.length) return null;

  // Definición de columnas para la tabla, la primera es el grupo, el resto los horarios
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

  /**
   * Construcción de filas visibles en la tabla:
   * Cada fila representa un grupo y muestra el costo total por horario.
   */
  const filas = nombresFilas.map((fila, i) => {
    const nuevaFila = {
      key: `grupo-${i}`,
      materia: fila.materia,
      grupoNumero: fila.grupo?.match(/\d+/)?.[0] || '-', // Extrae número de grupo
      estudiantes: Number(fila.estudiantes),
    };

    // Por cada horario, se calcula costo total = estudiantes + costo del horario
    horarios.forEach((h, j) => {
      const suma = Number(h.costo) + nuevaFila.estudiantes;
      nuevaFila[`col${j}`] = suma;
    });

    return nuevaFila;
  });

  /**
   * Construcción de la matriz de costos pura (solo valores numéricos).
   * Esta se usa para cálculos posteriores como el método de asignación.
   */
  const matrizCostos = nombresFilas.map((fila) =>
    horarios.map((h) => Number(h.costo) + Number(fila.estudiantes))
  );

  /**
   * useEffect para enviar los datos generados al componente padre.
   * Se envían:
   * - Los nombres de los horarios
   * - La matriz de costos completa
   * - Las filas de los grupos
   */
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
        {/* Puedes colocar un título adicional si lo deseas */}
      </Typography.Title>

      {/* Renderiza la tabla con columnas dinámicas por horario */}
      <Tabla
        columnas={columnas}
        filas={filas}
        titulo="Paso 6 Horarios"
        scrollY={260}
      />
    </div>
  );
}
