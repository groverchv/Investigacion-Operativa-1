'use client'
import React, { useState } from 'react';
import Paso0 from './Paso0';
import Paso1 from './Paso1';
import Paso2 from './Paso2';
import Paso3 from './Paso3'; // 👈 Asegúrate de importar el Paso3

export default function Asignacion() {
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [dataPaso1, setDataPaso1] = useState([]);
  const [dataPaso2, setDataPaso2] = useState([]);
  const [mostrarPaso1, setMostrarPaso1] = useState(false);

  const handlePaso0Listo = (cols, data) => {
    setColumns(cols);
    setDataSource(data);
    setMostrarPaso1(true);
  };

  return (
    <div style={{ padding: 24 }}>
      <Paso0 onListo={handlePaso0Listo} />

      {mostrarPaso1 && (
        <div style={{ marginTop: 48 }}>
          <Paso1 columns={columns} dataSource={dataSource} onResolved={setDataPaso1} />

          {dataPaso1.length > 0 && (
            <Paso2 columns={columns} dataSource={dataPaso1} onResolved={setDataPaso2} />
          )}

          {dataPaso2.length > 0 && (
            <Paso3 columns={columns} dataSource={dataPaso2} />
          )}
        </div>
      )}
    </div>
  );
}
