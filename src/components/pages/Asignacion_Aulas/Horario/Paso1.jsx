import React, { useEffect } from 'react';
import Tabla from '../../Prueba/Modal/tabla';
import { useDatosCompartidos } from './DatosContext';

export default function Paso1({ horarios, onResultado }) {
  const { datosCompartidos } = useDatosCompartidos();

  // Generar columnas base
  const columnas = [
    {
      title: (
        <div>
          HORARIOS <br /> <br /> MATERIAS
        </div>
      ),
      dataIndex: 'materiaGrupo',
      key: 'materiaGrupo',
      fixed: 'left',
    },
    ...horarios.map((h, index) => ({
      title: (
        <div>
          H{index + 1} <br /> {h.inicio}–{h.fin}
        </div>
      ),
      dataIndex: `H${index + 1}`,
      key: `H${index + 1}`,
      align: 'center',
    })),
  ];

  let filas = datosCompartidos.map((item, index) => {
    const fila = {
      key: index + 1,
      materiaGrupo: (
        <div>
          <strong>{item.materia}</strong><br />
          {`${item.grupo}, ${item.aula}, ${item.piso} = ${item.capacidad}`}
        </div>
      )
    };

    horarios.forEach((h, hIndex) => {
      const costoAtencion = Number(h.costo) || 0;
      const estudiantes = Number(item.estudiantes) || 0;
      const costoTotal = costoAtencion + estudiantes;
      fila[`H${hIndex + 1}`] = costoTotal;
    });

    return fila;
  });

  const numFilas = filas.length;
  const numCols = horarios.length;

  // Agregar filas ficticias si faltan
  if (numFilas < numCols) {
    const dif = numCols - numFilas;
    for (let i = 0; i < dif; i++) {
      const emptyRow = {
        key: numFilas + i + 1,
        materiaGrupo: (
          <div>
            <strong>Materia Ficticia {i + 1}</strong>
          </div>
        ),
      };
      horarios.forEach((_, hIndex) => {
        emptyRow[`H${hIndex + 1}`] = 0;
      });
      filas.push(emptyRow);
    }
  }

  // Agregar columnas ficticias si faltan
  if (numCols < numFilas) {
    const dif = numFilas - numCols;
    for (let i = 0; i < dif; i++) {
      const colKey = `H${numCols + i + 1}`;
      columnas.push({
        title: (
          <div>
            H{numCols + i + 1} <br /> Horario Ficticio {i + 1}
          </div>
        ),
        dataIndex: colKey,
        key: colKey,
        align: 'center',
      });
      filas.forEach(fila => {
        fila[colKey] = 0;
      });
    }
  }

  // Compartir datos con el padre
  useEffect(() => {
    if (onResultado) {
      onResultado(columnas, filas);
    }
  }, [columnas, filas, onResultado]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Paso 1: Matriz Simétrica</h2>
      <Tabla columnas={columnas} filas={filas} titulo="Matriz Paso 1" />
    </div>
  );
}
