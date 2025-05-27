'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Table, Typography } from 'antd';

const { Text } = Typography;

export default function Paso3({ dataSource = [], columns = [], onResolved }) {
  const [filasTachadas, setFilasTachadas] = useState([]);
  const [columnasTachadas, setColumnasTachadas] = useState([]);
  const [alreadySent, setAlreadySent] = useState(false);
  const [tablaHeight, setTablaHeight] = useState(0);
  const tablaRef = useRef(null);
  const thRefs = useRef({});

  const getColCenter = (key) => {
    const cell = thRefs.current[key];
    if (!cell || !tablaRef.current) return 0;
    const rect = cell.getBoundingClientRect();
    const tablaRect = tablaRef.current.getBoundingClientRect();
    return rect.left - tablaRect.left + rect.width / 2;
  };

  useEffect(() => {
    const actualizarAltura = () => {
      if (tablaRef.current) {
        setTablaHeight(tablaRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', actualizarAltura);
    actualizarAltura();

    return () => window.removeEventListener('resize', actualizarAltura);
  }, [dataSource, columns]);

  useEffect(() => {
    if (alreadySent) return;

    const filas = dataSource.length;
    const cols = columns.map(c => c.key);

    const ceros = [];
    dataSource.forEach((fila, filaIdx) => {
      cols.forEach(col => {
        if (fila[col] === 0) {
          ceros.push({ fila: filaIdx, col });
        }
      });
    });

    const conteoFilas = new Array(filas).fill(0);
    const conteoColumnas = {};
    cols.forEach(col => (conteoColumnas[col] = 0));

    ceros.forEach(({ fila, col }) => {
      conteoFilas[fila]++;
      conteoColumnas[col]++;
    });

    const filasMarcadas = [];
    const columnasMarcadas = [];
    const cubiertos = new Set();

    while (cubiertos.size < ceros.length) {
      const filaMaxIdx = conteoFilas.findIndex(
        val => val === Math.max(...conteoFilas)
      );

      const [colMax, colCeros] = Object.entries(conteoColumnas).reduce(
        (a, b) => (b[1] > a[1] ? b : a),
        ['', -1]
      );

      const filaCeros = conteoFilas[filaMaxIdx];

      if (filaCeros >= colCeros) {
        filasMarcadas.push(filaMaxIdx);
        ceros.forEach(({ fila, col }) => {
          if (fila === filaMaxIdx) cubiertos.add(`${fila}-${col}`);
        });
        conteoFilas[filaMaxIdx] = 0;
        cols.forEach(col => {
          if (dataSource[filaMaxIdx][col] === 0) conteoColumnas[col]--;
        });
      } else {
        columnasMarcadas.push(colMax);
        ceros.forEach(({ fila, col }) => {
          if (col === colMax) cubiertos.add(`${fila}-${col}`);
        });
        conteoColumnas[colMax] = 0;
        conteoFilas.forEach((_, fIdx) => {
          if (dataSource[fIdx][colMax] === 0) conteoFilas[fIdx]--;
        });
      }
    }

    setFilasTachadas(filasMarcadas);
    setColumnasTachadas(columnasMarcadas);

    if (typeof onResolved === 'function') {
      onResolved({
        filasTachadas: filasMarcadas,
        columnasTachadas: columnasMarcadas,
      });
      setAlreadySent(true);
    }
  }, [dataSource, columns, alreadySent, onResolved]);

  const dynamicColumns = [
    {
      title: '',
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
      render: (val) => {
        const isZero = val === 0;
        return (
          <div
            style={{
              backgroundColor: isZero ? '#fef3c7' : 'transparent',
              textAlign: 'center',
              fontWeight: isZero ? 'bold' : 'normal',
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
            width: 100%;
            overflow-x: auto;
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

      <h2>Paso 3: Cubrir ceros automáticamente</h2>
      <p>Se cubren los ceros con la menor cantidad de líneas posibles (horizontal/vertical).</p>

      <div className="tabla-con-lineas" ref={tablaRef}>
        <Table
          dataSource={dataSource}
          columns={dynamicColumns}
          pagination={false}
          bordered
          rowKey="key"
          style={{ minWidth: 600 }}
        />

        {filasTachadas.map(idx => (
          <div
            key={`fila-${idx}`}
            className="linea-horizontal"
            style={{
              top: 56 + idx * 54 + 27 - 1,
            }}
          />
        ))}

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
    </div>
  );
}
