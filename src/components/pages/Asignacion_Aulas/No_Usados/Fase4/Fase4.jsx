'use client';
import React, { useState } from 'react';
import Paso1 from './Paso1';
import Paso2 from './Paso2';

export default function Fase4({ dataSource = [], columns = [] }) {
  const [asignaciones, setAsignaciones] = useState([]);
  const [costoTotal, setCostoTotal] = useState(0);

  const handlePaso1Resuelto = (asignacionesFinales, costo) => {
    setAsignaciones(asignacionesFinales);
    setCostoTotal(costo);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Fase 4: Asignación Final</h2>

      <Paso1
        dataSource={dataSource}
        columns={columns}
        onResolved={handlePaso1Resuelto}
      />

      {asignaciones.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <Paso2
            dataSource={dataSource}
            columns={columns}
            asignaciones={asignaciones}
          />

          <div style={{ marginTop: 24 }}>
            <strong>Costo total mínimo:</strong>{' '}
            <span style={{ fontWeight: 'bold', color: '#1677ff' }}>
              {costoTotal.toLocaleString()} euros
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
