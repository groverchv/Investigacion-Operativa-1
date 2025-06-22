'use client';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import Tabla from '../Modal/tabla';


export default function Paso1({ matrizReducida = [], materias = [], modulos = [], onResolved }) {
  const prevMatriz = useRef([]);

  const { columnas, filas, matrizFinal, nombresFilas, nombresColumnas } = useMemo(() => {
    const numFilas = matrizReducida.length;
    const numCols = matrizReducida[0]?.length || 0;
    const size = Math.max(numFilas, numCols);

    const nombresFilas = materias.flatMap(materia =>
      materia.grupos.map(grupo => ({
        materia: materia.nombre,
        grupo: grupo.nombre.replace('Grupo ', ''),
        estudiantes: grupo.estudiantes
      }))
    );

    const nombresColumnas = modulos.flatMap(mod =>
      mod.pisos
        .sort((a, b) => parseInt(a.nombre.replace('Piso ', '')) - parseInt(b.nombre.replace('Piso ', '')))
        .flatMap(piso =>
          piso.aulas.map(aula =>
            `A${aula.nombre.replace('Aula ', '')} = ${piso.nombre}`
          )
        )
    );

    const columnasBase = Array.from({ length: size }, (_, j) => {
      const isReal = j < numCols;
      const nombre = nombresColumnas[j] || `Aula ${j + 1}`;
      const [aula, piso] = nombre.split('=').map(s => s?.trim());

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
      nombresColumnas
    };
  }, [JSON.stringify(matrizReducida), JSON.stringify(materias), JSON.stringify(modulos)]);

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
