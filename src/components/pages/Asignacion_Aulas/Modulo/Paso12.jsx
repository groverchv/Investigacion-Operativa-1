'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Table, Modal, Button } from 'antd';
import { ExpandOutlined } from '@ant-design/icons';

const styles = `
  .fila-tachada td:not(:first-child) {
    background-color: #39ff14 !important;
  }

  .columna-tachada {
    background-color: #39ff14 !important;
  }

  .celda {
    position: relative;
  }
`;

function encontrarAsignaciones(ceros) {
  const n = ceros.length;
  const asignado = Array(n).fill(-1); // asignado[col] = fila que la usa
  const asignaciones = Array(n).fill(-1); // asignaciones[fila] = columna asignada

  function dfs(fila, visitado) {
    for (let col = 0; col < n; col++) {
      if (ceros[fila][col] && !visitado[col]) {
        visitado[col] = true;
        if (asignado[col] === -1 || dfs(asignado[col], visitado)) {
          asignado[col] = fila;
          asignaciones[fila] = col;
          return true;
        }
      }
    }
    return false;
  }

  for (let fila = 0; fila < n; fila++) {
    const visitado = Array(n).fill(false);
    dfs(fila, visitado);
  }

  return asignaciones;
}

export default function Paso12({ matriz = [], nombresFilas = [], nombresColumnas = [], umbralFicticio = 1000, onResolved }) {
  const [modalVisible, setModalVisible] = useState(false);

  const {
    matrizFinal,
    columnas,
    filas,
    filasCubiertas,
    columnasCubiertas,
    totalFilasTachadas,
    totalColumnasTachadas,
    totalLineas,
    cumple
  } = useMemo(() => {
    const size = matriz.length;
    if (size === 0) {
      return {
        matrizFinal: [], columnas: [], filas: [], filasCubiertas: [], columnasCubiertas: [],
        totalFilasTachadas: 0, totalColumnasTachadas: 0, totalLineas: 0, cumple: false
      };
    }

    const ceros = matriz.map(fila => fila.map(val => val === 0 && val < umbralFicticio ? 1 : 0));
    const asignaciones = encontrarAsignaciones(ceros);

    const marcadasFilas = Array(size).fill(false);
    const marcadasColumnas = Array(size).fill(false);

    // Fila no asignada → marcar fila
    for (let i = 0; i < size; i++) {
      if (asignaciones[i] === -1) {
        marcadasFilas[i] = true;
      }
    }

    let cambio;
    do {
      cambio = false;
      for (let i = 0; i < size; i++) {
        if (marcadasFilas[i]) {
          for (let j = 0; j < size; j++) {
            if (ceros[i][j] && !marcadasColumnas[j]) {
              marcadasColumnas[j] = true;
              cambio = true;
            }
          }
        }
      }

      for (let j = 0; j < size; j++) {
        if (marcadasColumnas[j]) {
          for (let i = 0; i < size; i++) {
            if (asignaciones[i] === j && !marcadasFilas[i]) {
              marcadasFilas[i] = true;
              cambio = true;
            }
          }
        }
      }
    } while (cambio);

    const filasCubiertas = marcadasFilas.map(v => !v);
    const columnasCubiertas = marcadasColumnas;

    const totalFilasTachadas = filasCubiertas.filter(Boolean).length;
    const totalColumnasTachadas = columnasCubiertas.filter(Boolean).length;
    const totalLineas = totalFilasTachadas + totalColumnasTachadas;
    const cumple = totalLineas === size;

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
          onCell: () => ({ className: columnasCubiertas[j] ? 'columna-tachada' : '' })
        };
      })
    ];

    const filas = matriz.map((fila, i) => {
      const isReal = i < nombresFilas.length;
      const filaObj = {
        key: `fila_${i}`,
        materiaGrupo: isReal ? (
          <div>
            <strong>{nombresFilas[i]?.materia || `Materia ${i + 1}`}</strong><br />
            Grupo {nombresFilas[i]?.grupo || '?'} = {nombresFilas[i]?.estudiantes || '?'}
          </div>
        ) : (
          <div><strong>—</strong><br />Grupo ficticio</div>
        ),
        className: filasCubiertas[i] ? 'fila-tachada' : ''
      };

      fila.forEach((valor, j) => {
        const isFicticio = valor >= umbralFicticio;
        filaObj[`aula${j + 1}`] = (
          <div className={`celda ${isFicticio ? 'ficticio' : ''}`}>{valor}</div>
        );
      });

      return filaObj;
    });

    return {
      matrizFinal: matriz,
      columnas,
      filas,
      filasCubiertas,
      columnasCubiertas,
      totalFilasTachadas,
      totalColumnasTachadas,
      totalLineas,
      cumple
    };
  }, [JSON.stringify(matriz), JSON.stringify(nombresFilas), JSON.stringify(nombresColumnas), umbralFicticio]);

  useEffect(() => {
    onResolved?.({
      matriz: matrizFinal,
      filasCubiertas,
      columnasCubiertas,
      cumple
    });
  }, [matrizFinal, filasCubiertas, columnasCubiertas, cumple, onResolved]);

  return (
    <div style={{ marginTop: 40 }}>
      <style>{styles}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>PASO 5: Cubrir ceros con líneas</h2>
        <Button icon={<ExpandOutlined />} onClick={() => setModalVisible(true)}>
          Ver completo
        </Button>
      </div>

      <Table
        columns={columnas}
        dataSource={filas}
        bordered
        pagination={false}
        rowKey="key"
        scroll={{ x: 'max-content' }}
        rowClassName={(record) => record.className || ''}
      />

      <div style={{ marginTop: 20 }}>
        <p><strong>Total de filas tachadas:</strong> {totalFilasTachadas}</p>
        <p><strong>Total de columnas tachadas:</strong> {totalColumnasTachadas}</p>
        <p><strong>Total de líneas usadas:</strong> {totalLineas}</p>
        <p>
          <strong>Resultado:</strong>{' '}
          {cumple ? (
            <span style={{ color: 'green', fontWeight: 'bold' }}>
              ✅ Cumple: podemos empezar a realizar asignaciones.
            </span>
          ) : (
            <span style={{ color: 'red', fontWeight: 'bold' }}>
              ❌ No cumple: se deben encontrar más ceros.
            </span>
          )}
        </p>
      </div>

      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        title="Paso 5 - Vista ampliada"
      >
        <Table
          columns={columnas}
          dataSource={filas}
          bordered
          pagination={false}
          rowKey="key"
          scroll={{ x: 'max-content' }}
          rowClassName={(record) => record.className || ''}
        />
      </Modal>
    </div>
  );
}
