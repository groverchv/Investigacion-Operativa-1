'use client'; // Directiva para usar en entornos como Next.js App Router con rendering en el cliente

import React, { useEffect } from 'react';
import Tabla from '../Modal/tabla';

/**
 * Componente que genera una tabla de posibles asignaciones entre grupos y aulas disponibles,
 * basándose en la capacidad de las aulas y la cantidad de estudiantes por grupo.
 */
export default function MatrizGeneral({ materias, modulos, onDataReady }) {
  /**
   * Aplanamos todos los módulos → pisos → aulas y generamos una lista de aulas disponibles
   * con su piso, nombre y capacidad numérica.
   */
  const aulasDisponibles = modulos
    .flatMap(modulo =>
      modulo.pisos
        // Ordenamos los pisos por número (Piso 1, Piso 2, etc.)
        .sort((a, b) =>
          parseInt(a.nombre.replace('Piso ', '')) -
          parseInt(b.nombre.replace('Piso ', ''))
        )
        // Por cada piso, obtenemos sus aulas con información completa
        .flatMap(piso =>
          piso.aulas.map(aula => ({
            piso: piso.nombre,
            nombre: aula.nombre,
            capacidad: parseInt(aula.capacidad),
          }))
        )
    );

  /**
   * Por cada grupo de cada materia, construimos una fila con:
   * - Materia, Grupo, Nº de estudiantes
   * - Lista de aulas compatibles (por capacidad)
   * - Lista de pisos y capacidades disponibles
   */
  const filas = materias.flatMap((materia, idx) =>
    materia.grupos.map((grupo, i) => {
      const estudiantes = parseInt(grupo.estudiantes);

      // Filtramos aulas que tienen capacidad suficiente
      let aulasCompatibles = aulasDisponibles.filter(
        a => a.capacidad >= estudiantes
      );

      // Si no hay aulas suficientemente grandes, asignamos la más grande disponible
      if (aulasCompatibles.length === 0 && aulasDisponibles.length > 0) {
        const aulaMasGrande = aulasDisponibles.reduce((max, aula) =>
          aula.capacidad > max.capacidad ? aula : max
        );
        aulasCompatibles = [aulaMasGrande];
      }

      // Extraemos pisos sin repetir y ordenados
      const pisos = [...new Set(
        aulasCompatibles.map(a => a.piso.replace('Piso ', ''))
      )].sort((a, b) => parseInt(a) - parseInt(b));

      // Extraemos nombres de aulas (solo número), y capacidades
      const aulas = aulasCompatibles.map(a => a.nombre.replace('Aula ', ''));
      const capacidades = aulasCompatibles.map(a => a.capacidad);

      return {
        key: `${idx}-${i}`, // clave única para la tabla
        materia: materia.nombre,
        grupo: grupo.nombre,
        estudiantes: grupo.estudiantes,
        piso: pisos.join(', '),
        aula: aulas.join(', '),
        capacidad: capacidades.join(', '),
      };
    })
  );

  /**
   * Cuando las filas estén listas, las pasamos al componente padre (si lo solicita)
   */
  useEffect(() => {
    if (onDataReady) {
      onDataReady(filas);
    }
  }, [filas, onDataReady]);

  // Definimos las columnas de la tabla
  const columnas = [
    { title: 'MATERIA', dataIndex: 'materia', key: 'materia' },
    { title: 'Grupo', dataIndex: 'grupo', key: 'grupo' },
    { title: 'Estudiantes', dataIndex: 'estudiantes', key: 'estudiantes' },
    { title: 'Piso', dataIndex: 'piso', key: 'piso' },
    { title: 'Aula', dataIndex: 'aula', key: 'aula' },
    { title: 'Capacidad', dataIndex: 'capacidad', key: 'capacidad' },
  ];

  // Renderizamos el componente Tabla con los datos generados
  return (
    <Tabla
      columnas={columnas}
      filas={filas}
      titulo="MATRIZ GENERAL - POSIBLES ASIGNACIONES"
    />
  );
}
