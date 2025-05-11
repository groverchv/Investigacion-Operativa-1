import React from "react";

// Convierte valores tipo "3 - 4M" a número evaluando M = 1
function evaluar(valor) {
  if (typeof valor === "number") return valor;
  if (typeof valor === "string") {
    if (/^-?M$/.test(valor)) return valor.startsWith('-') ? -1 : 1;

    const match = valor.match(/^(-?\d+)\s*([+-])\s*(\d+)M$/);
    if (match) {
      const base = parseInt(match[1]);
      const signo = match[2] === '+' ? 1 : -1;
      const coef = parseInt(match[3]);
      return base + signo * coef;
    }

    const soloNum = valor.match(/^(-?\d+)$/);
    if (soloNum) return parseInt(soloNum[1], 10);
  }
  return 0;
}

// Redondear para presentación
function redondear(val) {
  return Math.abs(val) < 1e-10 ? 0 : Number(val.toFixed(4));
}

export default function Paso5({ columnas, r0n, matriz, filaPivoteVisual, colPivoteIndex }) {
  const tabla = [r0n, ...matriz];
  const nuevaTabla = [];

  const filaPivote = tabla[filaPivoteVisual];
  const valorPivote = evaluar(filaPivote[colPivoteIndex]);

  if (valorPivote === 0) {
    return (
      <div style={{ color: "red", padding: "1rem" }}>
        ⚠ Error: El valor del pivote es 0. No se puede dividir por 0.
      </div>
    );
  }

  // Paso 1: normalizar la fila pivote
  const filaNormalizada = filaPivote.map(val => redondear(evaluar(val) / valorPivote));
  nuevaTabla[filaPivoteVisual] = filaNormalizada;

  // Paso 2: ajustar las otras filas para hacer 0 en la columna pivote
  tabla.forEach((fila, fi) => {
    if (fi === filaPivoteVisual) return;

    const factor = evaluar(fila[colPivoteIndex]);
    const nuevaFila = fila.map((val, i) => {
      const original = evaluar(val);
      const ajuste = factor * filaNormalizada[i];
      return redondear(original - ajuste);
    });

    nuevaTabla[fi] = nuevaFila;
  });

  return (
    <div style={{ padding: "1rem" }}>
      <h3 style={{ color: "#0070c0" }}>5. Operación de Pivoteo</h3>

      <table border={1} cellPadding={5} style={{ borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th style={{ backgroundColor: "#0056b3", color: "white" }}>#</th>
            {columnas.map((col, idx) => (
              <th key={idx} style={{ backgroundColor: "#0056b3", color: "white" }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {nuevaTabla.map((fila, fi) => {
            const etiqueta = fi === 0 ? "nuevoR0" : `R${fi}`;
            return (
              <tr key={fi}>
                <td><strong>{etiqueta}</strong></td>
                {fila.map((val, i) => (
                  <td key={i} style={{
                    backgroundColor:
                      i === colPivoteIndex && fi === filaPivoteVisual
                        ? "#ffcccc"
                        : undefined
                  }}>
                    {val}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: "1rem", backgroundColor: "#fef6d5", padding: "10px", fontSize: "15px" }}>
        <p><strong>🔁 Se ha normalizado</strong> la fila {filaPivoteVisual} dividiendo por el valor del pivote.</p>
        <p><strong>➖ Se han restado</strong> múltiplos de esa fila en todas las demás filas para hacer ceros en la columna <strong>{columnas[colPivoteIndex]}</strong>.</p>
      </div>
    </div>
  );
}
