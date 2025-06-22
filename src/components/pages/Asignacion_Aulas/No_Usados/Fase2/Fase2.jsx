'use client';
import React, { useState } from 'react';
import { Button } from 'antd';
import Paso1 from './Paso1';
import Paso2 from './Paso2';

export default function Fase2({ columns = [], dataSource = [], onCompletado }) {
  const [lineas, setLineas] = useState(null);
  const [solucionFactible, setSolucionFactible] = useState(null); // true, false o null

  const handlePaso1Resuelto = (datosLineas) => {
    setLineas(datosLineas);
  };

  const handlePaso2Verificado = (esFactible) => {
    setSolucionFactible(esFactible);
  };

  const avanzarAFase3 = () => {
    if (typeof onCompletado === 'function' && lineas) {
      onCompletado({
        filasTachadas: lineas.filasTachadas,
        columnasTachadas: lineas.columnasTachadas,
        esSolucionFactible: solucionFactible,
      });
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Fase 2: Cubrimiento de ceros y verificación de solución</h2>

      <Paso1
        columns={columns}
        dataSource={dataSource}
        onResolved={handlePaso1Resuelto}
      />

      {lineas && (
        <div style={{ marginTop: 48 }}>
          <Paso2
            filasTachadas={lineas.filasTachadas}
            columnasTachadas={lineas.columnasTachadas}
            totalFilas={dataSource.length}
            totalColumnas={columns.length}
            dataSource={dataSource}
            columns={columns}
            onResolved={handlePaso2Verificado}
          />
        </div>
      )}

      {lineas && (
        <div style={{ marginTop: 24 }}>
          <Button type="primary" onClick={avanzarAFase3}>
            Continuar a Fase 3
          </Button>
        </div>
      )}
    </div>
  );
}
