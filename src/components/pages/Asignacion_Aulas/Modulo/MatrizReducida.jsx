'use client';
import React, { useEffect, useMemo } from 'react';
import Tabla from '../Modal/tabla';


export default function MatrizReducida({ materias, modulos, onDataReady }) {
  // Aulas ordenadas por piso
  const aulas = useMemo(() => {
    return modulos
      .flatMap(mod =>
        mod.pisos
          .sort((a, b) => parseInt(a.nombre.replace('Piso ', '')) - parseInt(b.nombre.replace('Piso ', '')))
          .flatMap(piso =>
            piso.aulas.map(a => ({
              nombre: a.nombre.replace('Aula ', ''),
              piso: piso.nombre.replace('Piso ', ''),
              capacidad: parseInt(a.capacidad),
            }))
          )
      );
  }, [modulos]);

  // Columnas para la tabla
  const columnas = useMemo(() => [
    {
      title: 'MATERIA / Grupo',
      dataIndex: 'materiaGrupo',
      key: 'materiaGrupo',
      fixed: 'left',
    },
    ...aulas.map((aula, idx) => ({
      title: (
        <div style={{ textAlign: 'center' }}>
          <strong>A{idx + 1}</strong><br />
          <span>= Piso {aula.piso}</span>
        </div>
      ),
      dataIndex: `col${idx}`,
      key: `col${idx}`,
      align: 'center',
      render: (valor) => (
        <span style={{ color: valor === 1000 ? 'red' : 'black' }}>{valor}</span>
      )
    }))
  ], [aulas]);

  // Filas con datos por grupo
  const filas = useMemo(() => {
    return materias.flatMap((materia) =>
      materia.grupos.map((grupo) => {
        const estudiantes = parseInt(grupo.estudiantes);
        const row = {
          key: `${materia.nombre}-${grupo.nombre}`,
          materiaGrupo: (
            <div>
              <strong>{materia.nombre}</strong><br />
              {grupo.nombre} = {estudiantes}
            </div>
          )
        };
        aulas.forEach((aula, idx) => {
          row[`col${idx}`] = aula.capacidad >= estudiantes ? aula.capacidad : 1000;
        });
        return row;
      })
    );
  }, [materias, aulas]);

  // Matriz pura para pasos posteriores
  const matrizNumerica = useMemo(() =>
    filas.map(row => aulas.map((_, idx) => row[`col${idx}`])),
    [filas, aulas]
  );

  useEffect(() => {
    if (onDataReady) {
      onDataReady(matrizNumerica);
    }
  }, [onDataReady, matrizNumerica]);

  return (
    <Tabla
      columnas={columnas}
      filas={filas}
      titulo="Matriz Reducida"
    />
  );
}
