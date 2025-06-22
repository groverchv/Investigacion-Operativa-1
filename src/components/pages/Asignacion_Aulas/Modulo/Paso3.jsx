'use client';
import React, { useEffect, useMemo } from 'react';
import Tabla from '../Modal/tabla';


export default function Paso3({
  matriz = [],
  nombresFilas = [],
  nombresColumnas = [],
  umbralFicticio = 1000,
  onResolved
}) {
  const { nuevaMatriz, columnas, filas } = useMemo(() => {
    if (!matriz.length) return { nuevaMatriz: [], columnas: [], filas: [] };

    // Reducción por filas
    const nuevaMatriz = matriz.map(fila => {
      const reales = fila.filter(v => v < umbralFicticio);
      const min = reales.length ? Math.min(...reales) : 0;
      return fila.map(valor =>
        valor < umbralFicticio ? valor - min : umbralFicticio - min
      );
    });

    const size = matriz.length;

    const columnas = [
      {
        title: 'MATERIA / Grupo',
        dataIndex: 'materiaGrupo',
        key: 'materiaGrupo',
        fixed: 'left',
      },
      ...Array.from({ length: size }, (_, j) => {
        const nombre = nombresColumnas[j] || `Aula ${j + 1}`;
        const [aula, piso] = nombre.split('=').map(s => s?.trim());

        return {
          title: j < nombresColumnas.length ? (
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
            <span style={{ color: valor === (umbralFicticio - 0) ? 'red' : 'black' }}>{valor}</span>
          )
        };
      })
    ];

    const filas = nuevaMatriz.map((fila, i) => {
      const isReal = i < nombresFilas.length;
      const filaObj = {
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
        )
      };

      fila.forEach((valor, j) => {
        filaObj[`aula${j + 1}`] = valor;
      });

      return filaObj;
    });

    return { nuevaMatriz, columnas, filas };
  }, [JSON.stringify(matriz), JSON.stringify(nombresFilas), JSON.stringify(nombresColumnas), umbralFicticio]);

  useEffect(() => {
    onResolved?.(nuevaMatriz);
  }, [nuevaMatriz, onResolved]);

  return (
    <Tabla
      columnas={columnas}
      filas={filas}
      titulo="PASO 3: Reducción por Filas"
    />
  );
}
