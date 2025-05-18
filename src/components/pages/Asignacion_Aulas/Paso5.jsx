'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Table, Typography } from 'antd';

const { Text } = Typography;

export default function Paso5({ dataSource = [], columns = [], filasTachadas = [], columnasTachadas = [] }) {
  const tablaRef = useRef(null);
  const thRefs = useRef({});
  const [tablaHeight, setTablaHeight] = useState(0);
  const [posMin, setPosMin] = useState({ fila: null, col: null });

  const horarioKeys = columns.map(col => col.key);

  useEffect(() => {
    if (tablaRef.current) {
      setTablaHeight(tablaRef.current.clientHeight);
    }

    let minVal = Infinity;
    let minPos = { fila: null, col: null };

    dataSource.forEach((fila, i) => {
      horarioKeys.forEach((k) => {
        const cubierto = filasTachadas.includes(i) || columnasTachadas.includes(k);
        if (!cubierto && fila[k] < minVal) {
          minVal = fila[k];
          minPos = { fila: i, col: k };
        }
      });
    });

    setPosMin(minPos);
  }, [dataSource, columns, filasTachadas, columnasTachadas]);

  const getColCenter = (key) => {
    const cell = thRefs.current[key];
    if (!cell || !tablaRef.current) return 0;
    const rect = cell.getBoundingClientRect();
    const tablaRect = tablaRef.current.getBoundingClientRect();
    return rect.left - tablaRect.left + rect.width / 2;
  };

  const dynamicColumns = [
    {
      title: 'Grupo',
      dataIndex: 'grupo',
      key: 'grupo',
    },
    ...columns.map(col => ({
      title: (
        <div ref={(el) => { thRefs.current[col.key] = el; }}>
          {col.title}
        </div>
      ),
      dataIndex: col.key,
      key: col.key,
      render: (val, _, rowIdx) => {
        const isZero = val === 0;
        const isMin = posMin.fila === rowIdx && posMin.col === col.key;
        return (
          <div
            style={{
              backgroundColor: isMin ? '#bbf7d0' : isZero ? '#fef3c7' : 'transparent',
              fontWeight: isMin || isZero ? 'bold' : 'normal',
              textAlign: 'center',
            }}
          >
            {val}
          </div>
        );
      },
    })),
  ];

  return (
    <div style={{ padding: 24 }}>
      <style>
        {`
          .tabla-con-lineas {
            position: relative;
            display: inline-block;
          }

          .linea-horizontal {
            position: absolute;
            height: 2px;
            background-color: red;
            left: 0;
            right: 0;
            z-index: 2;
            pointer-events: none;
          }

          .linea-vertical {
            position: absolute;
            width: 2px;
            background-color: red;
            z-index: 1;
            pointer-events: none;
          }
        `}
      </style>

      <h2>Paso 5: Marcar el menor valor no cubierto</h2>
      <p>Se marca en verde el menor valor no cubierto por ninguna línea. Esta matriz es idéntica a la del paso anterior.</p>

      <div className="tabla-con-lineas" ref={tablaRef}>
        <Table
          dataSource={dataSource}
          columns={dynamicColumns}
          pagination={false}
          bordered
          rowKey="key"
        />

        {/* Líneas horizontales */}
        {filasTachadas.map(idx => (
          <div
            key={`fila-${idx}`}
            className="linea-horizontal"
            style={{
              top: 56 + idx * 54 + 27 - 1,
            }}
          />
        ))}

        {/* Líneas verticales */}
        {columnasTachadas.map((key) => (
          <div
            key={`col-${key}`}
            className="linea-vertical"
            style={{
              left: getColCenter(key),
              top: 0,
              height: tablaHeight,
            }}
          />
        ))}
      </div>

      {posMin.fila !== null && (
        <Text>
          Mínimo no cubierto: <Text code>{dataSource[posMin.fila][posMin.col]}</Text> en fila <Text code>{posMin.fila + 1}</Text>, columna <Text code>{posMin.col}</Text>
        </Text>
      )}
    </div>
  );
}
