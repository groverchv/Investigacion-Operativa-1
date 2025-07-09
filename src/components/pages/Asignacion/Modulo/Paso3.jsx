'use client';
import React, { useEffect, useMemo } from 'react';
import Tabla from '../Modal/tabla';

// Componente Paso3: realiza el paso de reducción por filas en el método húngaro.
export default function Paso3({
  matriz = [],               // Matriz original de costos o pesos
  nombresFilas = [],         // Lista de nombres de las filas (materia/grupo)
  nombresColumnas = [],      // Lista de nombres de las columnas (aulas/pisos)
  umbralFicticio = 1000,     // Valor que representa las celdas "ficticias" o inválidas
  onResolved                 // Callback que recibe la nueva matriz resultante
}) {

  const { nuevaMatriz, columnas, filas } = useMemo(() => {
    if (!matriz.length) return { nuevaMatriz: [], columnas: [], filas: [] };

    // Obtener mínimo real por fila
    const minimos = matriz.map(fila => {
      const reales = fila.filter(v => v < umbralFicticio);
      return reales.length ? Math.min(...reales) : 0;
    });

    // Crear nueva matriz restando el mínimo por fila
    const nuevaMatriz = matriz.map((fila, i) =>
      fila.map(valor =>
        valor < umbralFicticio ? valor - minimos[i] : umbralFicticio - minimos[i]
      )
    );

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
      }),
      {
        // Título de la columna final (reducción por fila) en azul
        title: (
          <div style={{ textAlign: 'center', color: '#1890ff' }}>
            <strong>Reducción</strong><br />
            por fila
          </div>
        ),
        dataIndex: 'minimoRestado',
        key: 'minimoRestado',
        align: 'center',
        render: (valor) => (
          <strong style={{ color: '#1890ff' }}>{valor}</strong>
        )
      }
    ];

    // Construcción de filas para la tabla
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
        ),
        minimoRestado: minimos[i]
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
