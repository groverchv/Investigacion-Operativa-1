'use client';
import React, { useState } from 'react';
import Paso1 from './Paso1';
import Paso2 from './Paso2';
import { Button } from 'antd';

export default function Fase0({ onCompletado }) {
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [mostrarPaso2, setMostrarPaso2] = useState(false);

  const handlePaso1Listo = (cols, data) => {
    setColumns(cols);
    setDataSource(data);
    setMostrarPaso2(true);
  };

  const avanzarAFase1 = () => {
    if (onCompletado) {
      onCompletado(columns, dataSource);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Fase 0: Carga de Costos de Asignación</h2>

      <Paso1 onListo={handlePaso1Listo} />

      {mostrarPaso2 && (
        <div style={{ marginTop: 48 }}>
          <Paso2
            columns={columns}
            dataSource={dataSource}
            onResolved={(colsCorregidas, datosCorregidos) => {
              setColumns(colsCorregidas);
              setDataSource(datosCorregidos);
            }}
          />

          <div style={{ marginTop: 24 }}>
            <Button type="primary" onClick={avanzarAFase1}>
              Continuar a Fase 1
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
