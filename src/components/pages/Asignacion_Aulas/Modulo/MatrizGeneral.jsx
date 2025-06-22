'use client';
import React, { useEffect } from 'react';
import Tabla from '../Modal/tabla';


export default function MatrizGeneral({ materias, modulos, onDataReady }) {
  const aulasDisponibles = modulos
    .flatMap(modulo =>
      modulo.pisos
        .sort((a, b) => parseInt(a.nombre.replace('Piso ', '')) - parseInt(b.nombre.replace('Piso ', '')))
        .flatMap(piso =>
          piso.aulas.map(aula => ({
            piso: piso.nombre,
            nombre: aula.nombre,
            capacidad: parseInt(aula.capacidad),
          }))
        )
    );

  const filas = materias.flatMap((materia, idx) =>
    materia.grupos.map((grupo, i) => {
      const estudiantes = parseInt(grupo.estudiantes);
      const aulasCompatibles = aulasDisponibles.filter(a => a.capacidad >= estudiantes);
      const pisos = [...new Set(aulasCompatibles.map(a => a.piso.replace('Piso ', '')))];
      const aulas = aulasCompatibles.map(a => a.nombre.replace('Aula ', ''));
      const capacidades = aulasCompatibles.map(a => a.capacidad);

      return {
        key: `${idx}-${i}`,
        materia: materia.nombre,
        grupo: grupo.nombre,
        estudiantes: grupo.estudiantes,
        piso: pisos.join(', '),
        aula: aulas.join(', '),
        capacidad: capacidades.join(', '),
      };
    })
  );

  useEffect(() => {
    if (onDataReady) {
      onDataReady(filas);
    }
  }, [filas, onDataReady]);

  const columnas = [
    { title: 'MATERIA', dataIndex: 'materia', key: 'materia' },
    { title: 'Grupo', dataIndex: 'grupo', key: 'grupo' },
    { title: 'Estudiantes', dataIndex: 'estudiantes', key: 'estudiantes' },
    { title: 'Piso', dataIndex: 'piso', key: 'piso' },
    { title: 'Aula', dataIndex: 'aula', key: 'aula' },
    { title: 'Capacidad', dataIndex: 'capacidad', key: 'capacidad' },
  ];

  return (
    <Tabla
      columnas={columnas}
      filas={filas}
      titulo="MATRIZ GENERAL - POSIBLES ASIGNACIONES"
    />
  );
}
