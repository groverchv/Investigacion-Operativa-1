'use client';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import Tabla from '../Modal/tabla';

// Paso1: genera una matriz cuadrada a partir de la matriz reducida
// incluyendo filas o columnas ficticias si es necesario
// también genera los nombres reales de las aulas para las columnas
export default function Paso1({ matrizReducida = [], materias = [], modulos = [], onResolved }) {
  const prevMatriz = useRef([]);

  // useMemo para construir columnas, filas y matriz cuadrada simétrica
  const { columnas, filas, matrizFinal, nombresFilas, nombresColumnas } = useMemo(() => {
    const numFilas = matrizReducida.length;
    const numCols = matrizReducida[0]?.length || 0;
    const size = Math.max(numFilas, numCols); // tamaño cuadrado mínimo

    // nombres de materias y grupos para las filas reales
    const nombresFilas = materias.flatMap(materia =>
      materia.grupos.map(grupo => ({
        materia: materia.nombre,
        grupo: grupo.nombre.replace('Grupo ', ''),
        estudiantes: grupo.estudiantes
      }))
    );

    // ordena las aulas por piso y conserva su nombre real
    const aulasOrdenadas = modulos.flatMap(mod =>
      mod.pisos
        .sort((a, b) => parseInt(a.nombre.replace('Piso ', '')) - parseInt(b.nombre.replace('Piso ', '')))
        .flatMap(piso =>
          piso.aulas.map(aula => ({
            nombre: aula.nombre,
            piso: piso.nombre
          }))
        )
    );

    // columnas de la tabla: aulas reales y ficticias si faltan
    const columnasBase = Array.from({ length: size }, (_, j) => {
      const isReal = j < numCols;
      const aula = aulasOrdenadas[j]?.nombre || `Aula ${j + 1}`;
      const piso = aulasOrdenadas[j]?.piso || '—';

      return {
        title: isReal ? (
          <div style={{ textAlign: 'center' }}>
            <strong>{aula}</strong><br />
            <span>= {piso}</span>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <strong>Ficticia</strong><br />
            <span>(extra)</span>
          </div>
        ),
        dataIndex: `aula${j + 1}`,
        key: `aula${j + 1}`,
        align: 'center',
        render: (valor) => (
          <span style={{ color: valor === 1000 ? 'red' : 'black' }}>{valor}</span>
        ),
      };
    });

    // filas de la tabla: grupos reales y ficticios si faltan
    const filasBase = Array.from({ length: size }, (_, i) => {
      const isReal = i < numFilas;
      const fila = {
        key: `fila_${i}`,
        materiaGrupo: isReal ? (
          <div>
            <strong>{nombresFilas[i]?.materia || `Materia ${i + 1}`}</strong><br />
            Grupo {nombresFilas[i]?.grupo || '?'} = {nombresFilas[i]?.estudiantes || '?'}
          </div>
        ) : (
          <div>
            <strong>—</strong><br />
            Grupo ficticio
          </div>
        ),
      };

      for (let j = 0; j < size; j++) {
        fila[`aula${j + 1}`] = matrizReducida[i]?.[j] ?? 0;
      }

      return fila;
    });

    // construye la matriz cuadrada final para pasos siguientes
    const nuevaMatriz = filasBase.map(fila =>
      columnasBase.map(col => fila[col.dataIndex])
    );

    return {
      columnas: [
        {
          title: 'MATERIA / Grupo',
          dataIndex: 'materiaGrupo',
          key: 'materiaGrupo',
          fixed: 'left',
        },
        ...columnasBase
      ],
      filas: filasBase,
      matrizFinal: nuevaMatriz,
      nombresFilas,
      nombresColumnas: aulasOrdenadas.map(a => `${a.nombre} = ${a.piso}`)
    };
  }, [JSON.stringify(matrizReducida), JSON.stringify(materias), JSON.stringify(modulos)]);

  // notifica al componente padre si la matriz cambia
  useEffect(() => {
    const nuevaMatrizStr = JSON.stringify(matrizFinal);
    if (prevMatriz.current !== nuevaMatrizStr) {
      prevMatriz.current = nuevaMatrizStr;
      onResolved?.(matrizFinal, nombresFilas, nombresColumnas);
    }
  }, [matrizFinal, nombresFilas, nombresColumnas, onResolved]);

  return (
    <Tabla
      columnas={columnas}
      filas={filas}
      titulo="PASO 1: MATRIZ SIMÉTRICA (con Ficticios)"
    />
  );
}
