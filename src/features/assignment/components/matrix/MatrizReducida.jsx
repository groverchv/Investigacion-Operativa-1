'use client'; // Directiva usada en Next.js App Router para indicar que este componente se ejecuta en el cliente

import React, { useEffect, useMemo } from 'react';
import Tabla from '../../../../components/common/TablaModal';

/**
 * Componente que genera la **matriz reducida** para asignación de grupos a aulas,
 * según si una aula tiene suficiente capacidad para un grupo determinado.
 * Si no es compatible, se asigna un valor "penalizador" de 1000.
 */
export default function MatrizReducida({ materias, modulos, onDataReady }) {
  /**
   * Aulas disponibles con sus capacidades y ubicación.
   * Se calcula una sola vez usando `useMemo` para optimizar rendimiento.
   */
  const aulas = useMemo(() => {
    return modulos
      .flatMap(mod =>
        mod.pisos
          // Ordenamos los pisos numéricamente (Piso 1, Piso 2...)
          .sort((a, b) =>
            parseInt(a.nombre.replace('Piso ', '')) -
            parseInt(b.nombre.replace('Piso ', ''))
          )
          // Aplanamos todas las aulas de todos los pisos
          .flatMap(piso =>
            piso.aulas.map(a => ({
              nombre: a.nombre,
              piso: piso.nombre.replace('Piso ', ''),
              capacidad: parseInt(a.capacidad),
            }))
          )
      );
  }, [modulos]);

  /**
   * Columnas de la tabla:
   * La primera columna muestra la materia/grupo,
   * y las siguientes corresponden a cada aula.
   * Las celdas con valor 1000 se muestran en rojo (incompatibles).
   */
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
          <strong>{aula.nombre}</strong><br />
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

  /**
   * Filas de la matriz: una por cada grupo.
   * Cada celda indica si esa aula puede albergar ese grupo:
   *  - Si es compatible → se muestra la capacidad.
   *  - Si no → se coloca 1000.
   * Si no hay aulas compatibles, se marca solo el aula más grande.
   */
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

        const hayCompatibles = aulas.some(a => a.capacidad >= estudiantes);

        if (hayCompatibles) {
          // Para cada aula: si tiene capacidad suficiente, se pone su capacidad. Si no, 1000.
          aulas.forEach((aula, idx) => {
            row[`col${idx}`] = aula.capacidad >= estudiantes ? aula.capacidad : 1000;
          });
        } else {
          // No hay compatibles: se asigna solo el aula más grande
          const indexMayor = aulas.reduce((maxIdx, aula, idx) =>
            aula.capacidad > aulas[maxIdx].capacidad ? idx : maxIdx
          , 0);

          aulas.forEach((_, idx) => {
            row[`col${idx}`] = idx === indexMayor ? aulas[indexMayor].capacidad : 1000;
          });
        }

        return row;
      })
    );
  }, [materias, aulas]);

  /**
   * Extrae solo los valores numéricos (capacidades o 1000) para construir la matriz pura.
   * Esta matriz se envía al componente padre para procesar la lógica de asignación.
   */
  const matrizNumerica = useMemo(() =>
    filas.map(row =>
      aulas.map((_, idx) => row[`col${idx}`])
    ),
    [filas, aulas]
  );

  /**
   * Cuando se calcula la matriz numérica, se pasa al padre usando el callback `onDataReady`.
   */
  useEffect(() => {
    if (onDataReady) {
      onDataReady(matrizNumerica);
    }
  }, [onDataReady, matrizNumerica]);

  /**
   * Renderiza una tabla con materias/grupos vs aulas, destacando compatibilidades.
   */
  return (
    <Tabla
      columnas={columnas}
      filas={filas}
      titulo="Matriz Reducida"
    />
  );
}
