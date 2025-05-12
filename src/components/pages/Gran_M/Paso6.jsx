import React from "react";
import Paso4 from "./Paso4";
import Paso5 from "./Paso5";

export default function Paso6({ columnas, r0n, matriz, numVars }) {
  if (!columnas || !Array.isArray(r0n) || !Array.isArray(matriz)) {
    return (
      <div style={{ padding: "1rem", color: "red" }}>
        ⚠ Error: Faltan datos para continuar con el paso 6.
      </div>
    );
  }

  // Evaluar fila nueva R0 para encontrar si hay valores negativos (M = 1)
  const negativos = r0n
    .slice(1, -1)
    .map((val) => {
      if (typeof val === "number") return val;
      if (typeof val === "string") {
        if (val.includes("-")) return -1;
      }
      return 0;
    });

  const minValor = Math.min(...negativos);
  const colPivoteIndex = negativos.indexOf(minValor) + 1;

  if (minValor >= 0) {
    return (
      <div style={{ padding: "1rem", background: "#e8f5e9", color: "#2e7d32" }}>
        ✅ El algoritmo ha terminado. No hay valores negativos en nuevoR0.
      </div>
    );
  }

  // Calcular fila pivote (igual que en paso 4)
  let filaPivoteVisual = -1;
  let menorCociente = Infinity;

  matriz.forEach((fila, index) => {
    const divisor = fila[colPivoteIndex];
    const rhs = fila[fila.length - 1];
    if (divisor > 0) {
      const cociente = rhs / divisor;
      if (cociente < menorCociente) {
        menorCociente = cociente;
        filaPivoteVisual = index + 1; // +1 porque nuevoR0 está al inicio
      }
    }
  });

  if (filaPivoteVisual === -1) {
    return (
      <div style={{ padding: "1rem", color: "red" }}>
        ❌ No se encontró fila pivote válida. El algoritmo no puede continuar.
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ paddingLeft: "1rem", color: "#0070c0" }}>6. Iteración del Método</h3>
      <Paso4
        columnas={columnas}
        r0n={r0n}
        matriz={matriz}
        numVars={numVars}
        onSeleccionPivote={() => {}} // ya no es editable
      />
      <Paso5
        columnas={columnas}
        r0n={r0n}
        matriz={matriz}
        filaPivoteVisual={filaPivoteVisual}
        colPivoteIndex={colPivoteIndex}
      />
    </div>
  );
}
