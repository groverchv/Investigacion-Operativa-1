'use client';
import React, { useMemo, useEffect } from 'react';
import { Table, Typography } from 'antd';

export default function Paso6({
  matriz,
  filasCubiertas = [],
  columnasCubiertas = [],
  nombresFilas = [],
  nombresColumnas = [],
  onResolved
}) {
  const styles = `
    .celda-verde {
      background-color: #39ff14 !important;
    }
    .celda-roja {
      background-color: #ff4d4f !important;
    }
    .celda-amarilla {
      background-color: #ffd666 !important;
    }
  `;

  const { matrizAjustada, minimo, tipoCambio } = useMemo(() => {
    if (!matriz || matriz.length === 0) return { matrizAjustada: [], minimo: null, tipoCambio: [] };

    const size = matriz.length;
    let minimo = Infinity;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (!filasCubiertas[i] && !columnasCubiertas[j]) {
          minimo = Math.min(minimo, matriz[i][j]);
        }
      }
    }

    const tipoCambio = Array(size).fill(null).map(() => Array(size).fill('igual'));
    const matrizAjustada = matriz.map((fila, i) =>
      fila.map((val, j) => {
        if (!filasCubiertas[i] && !columnasCubiertas[j]) {
          tipoCambio[i][j] = 'restado';
          return val - minimo;
        } else if (filasCubiertas[i] && columnasCubiertas[j]) {
          tipoCambio[i][j] = 'sumado';
          return val + minimo;
        } else {
          tipoCambio[i][j] = 'igual';
          return val;
        }
      })
    );

    return { matrizAjustada, minimo, tipoCambio };
  }, [matriz, filasCubiertas, columnasCubiertas]);

  useEffect(() => {
    if (matrizAjustada.length > 0 && onResolved) {
      onResolved(matrizAjustada);
    }
  }, [matrizAjustada, onResolved]);

  const columnas = matrizAjustada.length > 0
    ? [
        {
          title: 'MATERIA / Grupo',
          dataIndex: 'materiaGrupo',
          key: 'materiaGrupo',
          fixed: 'left',
        },
        ...matrizAjustada[0].map((_, j) => ({
          title: nombresColumnas[j]
            ? (
              <div style={{ textAlign: 'center' }}>
                <strong>{nombresColumnas[j].split('=')[0].trim()}</strong><br />
                <span>= {nombresColumnas[j].split('=')[1]?.trim()}</span>
              </div>
            )
            : `Col ${j + 1}`,
          dataIndex: `col${j}`,
          key: `col${j}`,
          align: 'center',
          onCell: (_, i) => {
            const tipo = tipoCambio[i][j];
            if (tipo === 'sumado') return { className: 'celda-roja' };
            if (tipo === 'restado') return { className: 'celda-amarilla' };
            if (tipo === 'igual') return { className: 'celda-verde' };
            return {};
          }
        }))
      ]
    : [];

  const data = matrizAjustada.map((fila, i) => {
    const isReal = i < nombresFilas.length;
    const row = {
      key: i,
      materiaGrupo: isReal
        ? (
            <div>
              <strong>{nombresFilas[i]?.materia || `Materia ${i + 1}`}</strong><br />
              Grupo {nombresFilas[i]?.grupo || '?'} = {nombresFilas[i]?.estudiantes || '?'}
            </div>
          )
        : <div><strong>—</strong><br />Grupo ficticio</div>
    };

    fila.forEach((val, j) => {
      row[`col${j}`] = val;
    });

    return row;
  });

  return (
    <div style={{ marginTop: 40 }}>
      <style>{styles}</style>
      <Typography.Title level={4}>PASO 6: Hallar más ceros</Typography.Title>
      <p>
        El menor número encontrado en las celdas no cubiertas es <strong>{minimo}</strong>.
        <br />
        <span style={{ backgroundColor: '#ffd666', padding: '2px 4px' }}>🟨 Amarillo</span>: se restó el mínimo.<br />
        <span style={{ backgroundColor: '#ff4d4f', padding: '2px 4px' }}>🟥 Rojo</span>: se sumó el mínimo.<br />
        <span style={{ backgroundColor: '#39ff14', padding: '2px 4px' }}>🟩 Verde</span>: valor no cambió.
      </p>

      <Table
        columns={columnas}
        dataSource={data}
        bordered
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}
