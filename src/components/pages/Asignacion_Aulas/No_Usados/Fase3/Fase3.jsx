"use client";
import React, { useState } from "react";
import { Button } from "antd";
import Paso1 from "./Paso1";
import Paso2 from "./Paso2";
import Paso3 from "./Paso3";
import Paso4 from "./Paso4";

export default function Fase3({
  dataSource = [],
  columns = [],
  filasTachadas = [],
  columnasTachadas = [],
  onCompletado,
}) {
  const [matrizReducida, setMatrizReducida] = useState(null);
  const [lineas, setLineas] = useState(null);
  const [esFactible, setEsFactible] = useState(null); // ✅ para controlar si se debe continuar

  const handlePaso2Resuelto = (nuevaMatriz) => {
    setMatrizReducida(nuevaMatriz);
  };

  const handlePaso3Resuelto = (datosLineas) => {
    setLineas(datosLineas);
  };

  const handlePaso4Verificado = (esSolucionFactible) => {
    setEsFactible(esSolucionFactible);

    if (typeof onCompletado === "function") {
      onCompletado({
        matrizReducida,
        filasTachadas: lineas.filasTachadas,
        columnasTachadas: lineas.columnasTachadas,
        esSolucionFactible: esSolucionFactible, // ✅ paso clave
      });
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Fase 3: Nueva reducción de la matriz</h2>

      <Paso1
        dataSource={dataSource}
        columns={columns}
        filasTachadas={filasTachadas}
        columnasTachadas={columnasTachadas}
      />

      <div style={{ marginTop: 48 }}>
        <Paso2
          dataSource={dataSource}
          columns={columns}
          filasTachadas={filasTachadas}
          columnasTachadas={columnasTachadas}
          onResolved={handlePaso2Resuelto}
        />
      </div>

      {matrizReducida && (
        <div style={{ marginTop: 48 }}>
          <Paso3
            dataSource={matrizReducida}
            columns={columns}
            onResolved={handlePaso3Resuelto}
          />
        </div>
      )}

      {lineas && (
        <div style={{ marginTop: 48 }}>
          <Paso4
            filasTachadas={lineas.filasTachadas}
            columnasTachadas={lineas.columnasTachadas}
            totalFilas={matrizReducida.length}
            totalColumnas={columns.length}
            dataSource={matrizReducida}
            columns={columns}
            onResolved={handlePaso4Verificado} // ✅ se pasa hacia arriba
          />
        </div>
      )}

      
      <div style={{ marginTop: 24 }}>
        <Button type="primary" onClick={() => handlePaso4Verificado(false)}>
          Continuar a Fase 4
        </Button>
      </div>
    </div>
  );
}
