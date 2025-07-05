'use client';

import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import Tabla from '../Modal/tabla';

// Estilos aplicados a celdas tachadas y celdas con cero
const styles = `
  .fila-tachada td:not(:first-child),
  .columna-tachada {
    background-color: #39ff14 !important;
  }
  .celda-cero {
    background-color: #39ff14 !important;
  }
`;

/**
 * Paso10 — Aplica iterativamente la lógica del método húngaro
 * hasta que se pueda cubrir todos los ceros con líneas mínimas.
 * Realiza cobertura y reducción, marcando visualmente cada paso.
 */
export default function Paso10({
  matriz = [],
  nombresFilas = [],
  nombresColumnas = [],
  onResolved = () => {}
}) {
  const [iteraciones, setIteraciones] = useState([]);

  useEffect(() => {
    if (!matriz.length) return;

    const filas = matriz.length;
    const columnas = matriz[0].length;
    const sizeMinima = Math.min(filas, columnas); // Condición a cumplir
    let matrizActual = matriz.map(row => [...row]); // Copia profunda
    const historial = [];
    let cumple = false;
    let paso = 1;

    // Marcar como tachadas las filas ficticias
    let filasMarcadas = nombresFilas.map(fila =>
      fila?.materia?.toLowerCase().includes('ficticia')
    );

    let columnasMarcadas = Array(columnas).fill(false);

    while (!cumple && paso <= 20) {
      const celdasCero = matrizActual.map(fila =>
        fila.map(val => val === 0)
      );

      // Paso 5: Marcar columnas que contienen ceros en filas no marcadas
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
        // Primera iteración: marcar columnas donde todas las celdas son cero
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

      // Verificar si se cumple la condición de líneas mínimas
      const totalFilas = filasMarcadas.filter(Boolean).length;
      const totalColumnas = columnasMarcadas.filter(Boolean).length;
      const totalLineas = totalFilas + totalColumnas;
      cumple = totalLineas >= sizeMinima;

      // Guardar esta iteración
      historial.push({
        iteracion: paso,
        matriz: matrizActual.map(f => [...f]),
        filasMarcadas: [...filasMarcadas],
        columnasMarcadas: [...columnasMarcadas],
        celdasCero,
        totalFilas,
        totalColumnas,
        cumple
      });

      if (cumple) {
        onResolved(matrizActual, nombresFilas, nombresColumnas); // Enviar resultado final
        break;
      }

      // Paso 6: reducción por el mínimo en celdas no tachadas
      let minimo = Infinity;
      for (let i = 0; i < filas; i++) {
        if (filasMarcadas[i]) continue;
        for (let j = 0; j < columnas; j++) {
          if (!columnasMarcadas[j]) {
            minimo = Math.min(minimo, matrizActual[i][j]);
          }
        }
      }

      // Aplicar reducción y aumento según el método
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

      {/* Mostrar cada iteración visualmente */}
      {iteraciones.map((iter, index) => {
        // Construcción de columnas de la tabla
        const columnas = [
          {
            title: 'MATERIA / Grupo',
            dataIndex: 'materiaGrupo',
            key: 'materiaGrupo',
            fixed: 'left',
          },
          ...Array.from({ length: iter.matriz[0].length }, (_, j) => {
            const nombre = nombresColumnas[j] || `Horario ${j + 1}`;
            return {
              title: (
                <div style={{ textAlign: 'center' }}>
                  <strong>{nombre?.nombre || nombre}</strong><br />
                  <span>{nombre?.costo ? `Costo: ${nombre.costo}` : ''}</span>
                </div>
              ),
              dataIndex: `col${j}`,
              key: `col${j}`,
              align: 'center',
              // Estilo visual para tachar columnas y resaltar ceros
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

        // Construcción de filas de la tabla
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
