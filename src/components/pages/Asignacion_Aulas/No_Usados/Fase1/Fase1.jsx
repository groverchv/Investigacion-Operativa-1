"use client";
import React, { useState } from "react";
import { Button } from "antd";
import Paso1 from "./Paso1";
import Paso2 from "./Paso2";

export default function Fase1({ columns = [], dataSource = [], onCompletado }) {
  const [matrizPaso1, setMatrizPaso1] = useState([]);
  const [matrizPaso2, setMatrizPaso2] = useState([]);

  const handlePaso1Resuelto = (nuevaMatriz) => {
    setMatrizPaso1(nuevaMatriz);
  };

  const handlePaso2Resuelto = (matrizFinal) => {
    setMatrizPaso2(matrizFinal);
    // ✅ Ya no llamamos aquí, lo haremos solo desde el botón
  };

  const avanzarAFase2 = () => {
    if (typeof onCompletado === "function" && matrizPaso2.length > 0) {
      onCompletado(columns, matrizPaso2);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Fase 1: Reducción de la matriz</h2>

      <Paso1
        columns={columns}
        dataSource={dataSource}
        onResolved={handlePaso1Resuelto}
      />

      {matrizPaso1.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <Paso2
            columns={columns}
            dataSource={matrizPaso1}
            onResolved={handlePaso2Resuelto}
          />
        </div>
      )}

      {matrizPaso2.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Button type="primary" onClick={avanzarAFase2}>
            Continuar a Fase 2
          </Button>
        </div>
      )}
    </div>
  );
}
