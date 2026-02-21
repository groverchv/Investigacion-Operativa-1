'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Tabla from '../../../../components/common/TablaModal';

export default function Paso2({
  matriz = [],
  nombresFilas = [],
  nombresColumnas = [],
  umbralFicticio = 1000,
  onResolved
}) {
  const [valorMaximo, setValorMaximo] = useState(null);

  const { nuevaMatriz, columnas, filas } = useMemo(() => {
    if (!matriz.length) return { nuevaMatriz: [], columnas: [], filas: [] };

    // Paso 1: Encontrar el valor máximo real de toda la matriz
    let max = Number.MIN_SAFE_INTEGER;
    matriz.forEach(fila =>
      fila.forEach(valor => {
        if (valor < umbralFicticio && valor > max) max = valor;
      })
    );

    setValorMaximo(max);

    // Paso 2: Crear la nueva matriz restando el valor máximo
    const nuevaMatriz = matriz.map(fila =>
      fila.map(valor =>
        valor < umbralFicticio ? max - valor : umbralFicticio - max
      )
    );

    const size = matriz.length;

    // Paso 3: Definir columnas, incluyendo separación dinámica de nombre y piso
    const columnas = [
      {
        title: 'MATERIA / Grupo',
        dataIndex: 'materiaGrupo',
        key: 'materiaGrupo',
        fixed: 'left',
      },
      ...Array.from({ length: size }, (_, j) => {
        const nombre = nombresColumnas[j] || `Aula ${j + 1}`;
        const [aula, piso] = (nombre.includes('=') ? nombre.split('=') : [nombre, '']).map(s => s.trim());

        return {
          title: j < nombresColumnas.length ? (
            <div style={{ textAlign: 'center' }}>
              <strong>{aula}</strong><br />
              <span>= {piso || '¿?'}</span>
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
            <span style={{ color: valor === (umbralFicticio - max) ? 'red' : 'black' }}>{valor}</span>
          )
        };
      })
    ];

    // Paso 4: Construir cada fila para la tabla
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

  // Paso 5: Notificar al componente padre cuando la matriz se calcule
  useEffect(() => {
    onResolved?.(nuevaMatriz);
  }, [nuevaMatriz, onResolved]);

  // Paso 6: Renderizar tabla
  return (
    <Tabla
      columnas={columnas}
      filas={filas}
      titulo={`PASO 2: Restar al valor máximo${valorMaximo !== null ? ` (${valorMaximo})` : ''}`}
    />
  );
}
