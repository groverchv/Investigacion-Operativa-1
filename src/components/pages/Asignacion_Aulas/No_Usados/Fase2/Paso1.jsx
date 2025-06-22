'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Table, Modal, Button } from 'antd';
import { ExpandOutlined } from '@ant-design/icons';

const styles = ``;

function encontrarAsignaciones(ceros) {
  const n = ceros.length;
  const asignaciones = Array(n).fill(-1);

  function puedeAsignar(i, visitado, asignado) {
    for (let j = 0; j < n; j++) {
      if (ceros[i][j] && !visitado[j]) {
        visitado[j] = true;
        if (asignado[j] === -1 || puedeAsignar(asignado[j], visitado, asignado)) {
          asignado[j] = i;
          return true;
        }
      }
    }
    return false;
  }

  const asignado = Array(n).fill(-1);
  for (let i = 0; i < n; i++) {
    const visitado = Array(n).fill(false);
    puedeAsignar(i, visitado, asignado);
  }

  asignado.forEach((fila, col) => {
    if (fila !== -1) asignaciones[fila] = col;
  });

  return asignaciones;
}

export default function Paso5({
  matriz = [],
  nombresFilas = [],
  nombresColumnas = [],
  umbralFicticio = 1000,
  onResolved
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const { matrizFinal, columnas, filas } = useMemo(() => {
    const size = matriz.length;
    if (size === 0) return { matrizFinal: [], columnas: [], filas: [] };

    const ceros = matriz.map(fila => fila.map(val => val === 0 && val < umbralFicticio ? 1 : 0));
    const asignaciones = encontrarAsignaciones(ceros);

    const marcadasFilas = Array(size).fill(false);
    const marcadasColumnas = Array(size).fill(false);

    for (let i = 0; i < size; i++) {
      if (asignaciones[i] === -1) marcadasFilas[i] = true;
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
            <div className="text-center">
              <strong>{aula}</strong><br />
              <span>= {piso}</span>
            </div>
          ) : (
            <div className="text-center">
              <strong>Ficticia</strong><br />
              <span>(extra)</span>
            </div>
          ),
          dataIndex: `aula${j + 1}`,
          key: `aula${j + 1}`,
          align: 'center',
          onCell: (_record, rowIndex) => {
            const intersecta = filasCubiertas[rowIndex] && columnasCubiertas[j];
            return {
              className: columnasCubiertas[j]
                ? `relative after:absolute after:top-0 after:left-1/2 after:-translate-x-1/2 after:h-full after:w-[2px] after:bg-red-600 ${intersecta ? 'before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[6px] before:h-[2px] before:bg-red-600' : ''}`
                : '',
            };
          },
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
        className: filasCubiertas[i]
          ? 'relative after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-full after:h-[2px] after:bg-red-600'
          : '',
      };

      fila.forEach((valor, j) => {
        filaObj[`aula${j + 1}`] = (
          <div className={`celda ${valor >= umbralFicticio ? 'text-red-500' : ''}`}>
            {valor}
          </div>
        );
      });

      return filaObj;
    });

    return { matrizFinal: matriz, columnas, filas };
  }, [JSON.stringify(matriz), JSON.stringify(nombresFilas), JSON.stringify(nombresColumnas), umbralFicticio]);

  useEffect(() => {
    onResolved?.(matrizFinal);
  }, [matrizFinal, onResolved]);

  return (
    <div className="mt-10">
      <style>{styles}</style>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">PASO 5: Cubrir ceros con líneas</h2>
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
