'use client';

import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import Tabla from '../../../../components/common/TablaModal';

// Estilos para tachar visualmente filas y columnas en la tabla
const styles = `
  .fila-tachada td:not(:first-child),
  .columna-tachada {
    background-color: #39ff14 !important;
  }
  .celda {
    position: relative;
  }
`;

/**
 * Función auxiliar que identifica qué columnas tienen ceros no tachados (no cubiertos por filas).
 * Ignora ceros ficticios mayores al umbral.
 */
function columnasConCerosNoTachados(matriz, filasCubiertas, umbralFicticio = 1000) {
  const columnasCubiertas = Array(matriz[0]?.length || 0).fill(false);
  for (let j = 0; j < matriz[0]?.length; j++) {
    for (let i = 0; i < matriz.length; i++) {
      if (!filasCubiertas[i] && matriz[i][j] === 0 && matriz[i][j] < umbralFicticio) {
        columnasCubiertas[j] = true;
        break;
      }
    }
  }
  return columnasCubiertas;
}

/**
 * Función auxiliar que marca filas que contienen ceros no cubiertos por ficticias ya tachadas.
 * Se usa cuando ya se tacharon algunas columnas ficticias.
 */
function filasConCerosIgnorandoFicticiasTachadas(matriz, columnasCubiertas, nombresColumnas, umbralFicticio = 1000) {
  const filasCubiertas = Array(matriz.length).fill(false);
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      const valor = matriz[i][j];
      const esFicticia = j >= nombresColumnas.length;
      const ficticiaTachada = esFicticia && columnasCubiertas[j];

      if (valor === 0 && !ficticiaTachada) {
        filasCubiertas[i] = true;
        break;
      }
    }
  }
  return filasCubiertas;
}

/**
 * Componente Paso5:
 * Aplica el Paso 5 y Paso 6 del método húngaro para cubrir ceros con líneas mínimas
 * y realizar reducciones iterativas hasta cumplir la condición.
 */
export default function Paso5({
  matriz = [],
  nombresFilas = [],
  nombresColumnas = [],
  umbralFicticio = 1000,
  onResolved
}) {
  const [iteraciones, setIteraciones] = useState([]);

  useEffect(() => {
    const sizeFilas = matriz.length;
    const sizeColumnas = matriz[0]?.length || 0;
    const sizeMinima = Math.min(sizeFilas, sizeColumnas);
    if (sizeFilas === 0 || sizeColumnas === 0) return;

    const historial = [];
    let matrizActual = matriz.map(fila => [...fila]); // copia profunda
    let cumple = false;
    let iteracion = 1;

    // Ciclo principal de iteración entre Paso 5 y Paso 6
    while (!cumple && iteracion <= 20) {
      // Fila cubierta por defecto si es ficticia
      const filasBase = Array(sizeFilas)
        .fill(false)
        .map((_, i) => i >= nombresFilas.length);

      // Paso 5: cubrir columnas con ceros
      const columnasCubiertas = columnasConCerosNoTachados(matrizActual, filasBase, umbralFicticio);

      // ¿Se tacharon ficticias?
      const ficticiasTachadas = columnasCubiertas
        .slice(nombresColumnas.length)
        .some(c => c);

      // Si se tacharon ficticias, usar otra estrategia para cubrir filas
      const filasCubiertas = ficticiasTachadas
        ? filasConCerosIgnorandoFicticiasTachadas(matrizActual, columnasCubiertas, nombresColumnas, umbralFicticio)
        : filasBase;

      const totalFilas = filasCubiertas.filter(Boolean).length;
      const totalColumnas = columnasCubiertas.filter(Boolean).length;
      const totalLineas = totalFilas + totalColumnas;

      cumple = totalLineas >= sizeMinima;

      // Guardamos la iteración del Paso 5
      historial.push({
        tipo: 'paso5',
        iteracion,
        matriz: matrizActual,
        filasCubiertas,
        columnasCubiertas,
        cumple,
        totalFilas,
        totalColumnas
      });

      if (cumple) break;

      // Paso 6: reducción por el valor mínimo de celdas no tachadas
      let minimo = Infinity;
      for (let i = 0; i < sizeFilas; i++) {
        for (let j = 0; j < sizeColumnas; j++) {
          if (!filasCubiertas[i] && !columnasCubiertas[j]) {
            minimo = Math.min(minimo, matrizActual[i][j]);
          }
        }
      }

      // Aplicamos el valor mínimo a la matriz según la lógica del paso 6
      const nuevaMatriz = matrizActual.map((fila, i) =>
        fila.map((val, j) => {
          if (!filasCubiertas[i] && !columnasCubiertas[j]) {
            return val - minimo;
          } else if (filasCubiertas[i] && columnasCubiertas[j]) {
            return val + minimo;
          } else {
            return val;
          }
        })
      );

      // Guardamos la iteración del Paso 6
      historial.push({
        tipo: 'paso6',
        iteracion,
        minimo,
        matriz: nuevaMatriz,
        filasCubiertas,
        columnasCubiertas
      });

      matrizActual = nuevaMatriz;
      iteracion++;
    }

    setIteraciones(historial);
    onResolved?.(matrizActual); // Devolvemos la matriz final al padre
  }, [JSON.stringify(matriz), JSON.stringify(nombresFilas), JSON.stringify(nombresColumnas), umbralFicticio]);

  return (
    <div>
      <style>{styles}</style>

      {iteraciones.map((iter, index) => {
        // Definición de columnas dinámicas para la tabla
        const columnas = [
          {
            title: 'MATERIA / Grupo',
            dataIndex: 'materiaGrupo',
            key: 'materiaGrupo',
            fixed: 'left',
          },
          ...Array.from({ length: iter.matriz[0].length }, (_, j) => {
            const nombre = nombresColumnas[j] || `Aula ${j + 1}`;
            const [aula, piso] = nombre.split('=').map(s => s?.trim());
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
                return iter.tipo === 'paso5' && iter.columnasCubiertas[j]
                  ? { className: 'columna-tachada' }
                  : {};
              }
            };
          })
        ];

        // Filas de la tabla con estilo aplicado según si la fila fue tachada
        const filas = iter.matriz.map((fila, i) => {
          const isReal = i < nombresFilas.length;
          const row = {
            key: i,
            materiaGrupo: isReal ? (
              <div>
                <strong>{nombresFilas[i]?.materia || `Materia ${i + 1}`}</strong><br />
                Grupo {nombresFilas[i]?.grupo || '?'} = {nombresFilas[i]?.estudiantes || '?'}
              </div>
            ) : (
              <div><strong>—</strong><br />Grupo ficticio</div>
            ),
            className: iter.filasCubiertas[i] ? 'fila-tachada' : ''
          };
          fila.forEach((val, j) => {
            row[`col${j}`] = <div className="celda">{val}</div>;
          });
          return row;
        });

        return (
          <div key={index} style={{ marginBottom: 40 }}>
            <Typography.Title level={4}>
              {`Iteración ${iter.iteracion} - ${iter.tipo === 'paso5' ? 'Paso 5' : 'Paso 6'}`}
            </Typography.Title>

            <Tabla
              columnas={columnas}
              filas={filas}
              titulo=""
              rowClassName={(record) => record.className || ''}
            />

            {/* Descripción visual al final de cada iteración */}
            {iter.tipo === 'paso5' && (
              <div style={{ marginTop: 10 }}>
                <p><strong>Filas tachadas:</strong> {iter.totalFilas}</p>
                <p><strong>Columnas tachadas:</strong> {iter.totalColumnas}</p>
                <p><strong>Total de líneas:</strong> {iter.totalFilas + iter.totalColumnas}</p>
                <p><strong>¿Cumple condición?</strong>{' '}
                  {iter.cumple
                    ? <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Sí, se pueden hacer asignaciones</span>
                    : <span style={{ color: 'red', fontWeight: 'bold' }}>❌ No, aplicar paso 6</span>
                  }
                </p>
              </div>
            )}

            {iter.tipo === 'paso6' && (
              <p>Mínimo restado/sumado: <strong>{iter.minimo}</strong></p>
            )}
          </div>
        );
      })}
    </div>
  );
}
