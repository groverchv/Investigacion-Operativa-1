import React from 'react';
import { useDatosCompartidos } from './DatosContext';
import Tabla from './Modal/tabla';  // Ajusta el path si es necesario

export default function MatrizGeneral({ horarios }) {
  const { datosCompartidos } = useDatosCompartidos();

  const columnas = [
    {
      title: (
        <div>
          HORARIOS <br />  <br /> MATERIAS
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

  const filas = datosCompartidos.map((item, index) => {
    const fila = {
      key: index + 1,
      materiaGrupo: (
        <div>
          <strong>{item.materia}</strong>
          <br />
          {`${item.aula}, ${item.piso} = ${item.capacidad}`}
        </div>
      ),
    };

    horarios.forEach((_, hIndex) => {
      fila[`H${hIndex + 1}`] = item.estudiantes;
    });

    return fila;
  });

  return (
      <Tabla
        columnas={columnas}
        filas={filas}
        titulo="Matriz General"
      />
  );
}
