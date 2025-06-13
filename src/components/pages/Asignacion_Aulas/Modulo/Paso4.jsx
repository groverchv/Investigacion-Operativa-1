'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Table, Modal, Button } from 'antd';
import { ExpandOutlined } from '@ant-design/icons';

export default function Paso4({
  matriz = [],
  nombresFilas = [],
  nombresColumnas = [],
  umbralFicticio = 1000,
  onResolved
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const { nuevaMatriz, columnas, filas } = useMemo(() => {
    if (!matriz.length) return { nuevaMatriz: [], columnas: [], filas: [] };

    const size = matriz.length;

    // Transponer la matriz para operar sobre columnas
    const transpuesta = matriz[0].map((_, j) => matriz.map(fila => fila[j]));

    // Reducción por columna (restando el mínimo incluso al valor ficticio)
    const columnasReducidas = transpuesta.map(col => {
      const reales = col.filter(v => v < umbralFicticio);
      const min = reales.length ? Math.min(...reales) : 0;
      return col.map(valor =>
        valor < umbralFicticio ? valor - min : umbralFicticio - min
      );
    });

    // Volver a transponer
    const nuevaMatriz = columnasReducidas[0].map((_, i) =>
      columnasReducidas.map(col => col[i])
    );

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
          <div><strong>—</strong><br />Grupo ficticio</div>
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
    <div style={{ marginTop: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>PASO 4: Reducción por Columnas</h2>
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
      />

      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        title="Paso 4 - Vista ampliada"
      >
        <Table
          columns={columnas}
          dataSource={filas}
          bordered
          pagination={false}
          scroll={{ x: 'max-content' }}
          rowKey="key"
        />
      </Modal>
    </div>
  );
}
