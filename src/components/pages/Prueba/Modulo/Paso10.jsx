'use client';
import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import Tabla from '../Modal/tabla';

const styles = `
  .fila-tachada td:not(:first-child),
  .columna-tachada {
    background-color: #39ff14 !important;
  }
  .celda-cero {
    background-color:  #39ff14 !important;
  }
`;

export default function Paso10({ matriz = [], nombresFilas = [], nombresColumnas = [] }) {
  const [iteraciones, setIteraciones] = useState([]);

  useEffect(() => {
    if (!matriz.length) return;

    const filas = matriz.length;
    const columnas = matriz[0].length;
    const sizeMinima = Math.min(filas, columnas);

    let matrizActual = matriz.map(row => [...row]);
    const historial = [];
    let cumple = false;
    let paso = 1;
    let filasMarcadas = Array(filas).fill(false);
    let columnasMarcadas = Array(columnas).fill(false);

    // Primera iteración: marcar filas ficticias (por nombre)
    filasMarcadas = nombresFilas.map(fila => fila?.materia?.toLowerCase().includes('ficticia'));

    while (!cumple && paso <= 20) {
      // Nueva matriz de celdas con ceros
      const celdasCero = matrizActual.map(fila => fila.map(val => val === 0));

      // Nuevas columnas con ceros en filas no marcadas
      if (paso > 1) {
        for (let j = 0; j < columnas; j++) {
          for (let i = 0; i < filas; i++) {
            if (!filasMarcadas[i] && matrizActual[i][j] === 0) {
              columnasMarcadas[j] = true;
              break;
            }
          }
        }
      } else {
        // En la primera iteración: marcar columnas que tengan todos ceros
        for (let j = 0; j < columnas; j++) {
          let allZero = true;
          for (let i = 0; i < filas; i++) {
            if (matrizActual[i][j] !== 0) {
              allZero = false;
              break;
            }
          }
          if (allZero) columnasMarcadas[j] = true;
        }
      }

      const totalFilas = filasMarcadas.filter(Boolean).length;
      const totalColumnas = columnasMarcadas.filter(Boolean).length;
      const totalLineas = totalFilas + totalColumnas;
      cumple = totalLineas >= sizeMinima;

      historial.push({
        iteracion: paso,
        matriz: matrizActual,
        filasMarcadas: [...filasMarcadas],
        columnasMarcadas: [...columnasMarcadas],
        celdasCero,
        totalFilas,
        totalColumnas,
        cumple
      });

      if (cumple) break;

      // Paso 6: reducción
      let minimo = Infinity;
      for (let i = 0; i < filas; i++) {
        if (filasMarcadas[i]) continue;
        for (let j = 0; j < columnas; j++) {
          if (!columnasMarcadas[j]) {
            minimo = Math.min(minimo, matrizActual[i][j]);
          }
        }
      }

      matrizActual = matrizActual.map((fila, i) =>
        fila.map((val, j) => {
          if (!filasMarcadas[i] && !columnasMarcadas[j]) return val - minimo;
          if (filasMarcadas[i] && columnasMarcadas[j]) return val + minimo;
          return val;
        })
      );

      paso++;
    }

    setIteraciones(historial);
  }, [JSON.stringify(matriz)]);

  return (
    <div>
      <style>{styles}</style>
      {iteraciones.map((iter, index) => {
        const columnas = [
          {
            title: 'MATERIA / Grupo',
            dataIndex: 'materiaGrupo',
            key: 'materiaGrupo',
            fixed: 'left',
          },
          ...Array.from({ length: iter.matriz[0].length }, (_, j) => {
            const nombre = nombresColumnas[j] || `Aula ${j + 1}`;
            const [aula, piso] = nombre.split('=')?.map(s => s?.trim()) || [];
            return {
              title: j < nombresColumnas.length ? (
                <div style={{ textAlign: 'center' }}>
                  <strong>{aula}</strong><br /><span>= {piso}</span>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <strong>Ficticia</strong><br /><span>(extra)</span>
                </div>
              ),
              dataIndex: `col${j}`,
              key: `col${j}`,
              align: 'center',
              onCell: (_, i) => {
                const esCero = iter.celdasCero?.[i]?.[j];
                const columnaTachada = iter.columnasMarcadas[j];
                return {
                  className: esCero ? 'celda-cero' : columnaTachada ? 'columna-tachada' : ''
                };
              }
            };
          })
        ];

        const filas = iter.matriz.map((fila, i) => {
          const isReal = i < nombresFilas.length;
          const row = {
            key: i,
            materiaGrupo: isReal
              ? (
                <div>
                  <strong>{nombresFilas[i]?.materia || `Materia ${i + 1}`}</strong><br />
                  Grupo {nombresFilas[i]?.grupo || '?'} = {nombresFilas[i]?.estudiantes || '?'}
                </div>
              ) : <div><strong>—</strong><br />Grupo ficticio</div>,
            className: iter.filasMarcadas[i] ? 'fila-tachada' : ''
          };
          fila.forEach((val, j) => {
            row[`col${j}`] = val;
          });
          return row;
        });

        return (
          <div key={index} style={{ marginBottom: 40 }}>
            <Typography.Title level={5}>Iteración {iter.iteracion}</Typography.Title>
            <Tabla
              columnas={columnas}
              filas={filas}
              titulo=""
              rowClassName={(record) => record.className || ''}
            />
            <p><strong>Filas tachadas:</strong> {iter.totalFilas}</p>
            <p><strong>Columnas tachadas:</strong> {iter.totalColumnas}</p>
            <p><strong>Total de líneas:</strong> {iter.totalFilas + iter.totalColumnas}</p>
            <p><strong>¿Cumple condición?</strong> {iter.cumple ? '✅ Sí' : '❌ No'}</p>
          </div>
        );
      })}
    </div>
  );
}