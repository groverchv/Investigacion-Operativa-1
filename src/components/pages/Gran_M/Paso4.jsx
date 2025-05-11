import React from "react";

// Evaluar expresión tipo "2 - 3M" con M=1
function evaluarExpresionM(valor) {
  if (typeof valor === "number") return valor;
  if (typeof valor === "string") {
    if (/^-?M$/.test(valor)) return valor.startsWith('-') ? -1 : 1;

    const match = valor.match(/^(-?\d+)(\s*[+-]\s*\d+)M$/);
    if (match) {
      const base = parseInt(match[1], 10);
      const m = parseInt(match[2].replace(/\s/g, ""), 10);
      return base + m;
    }

    const soloNumero = valor.match(/^(-?\d+)$/);
    if (soloNumero) return parseInt(soloNumero[1], 10);
  }
  return 0;
}

export default function Paso4({ columnas, r0n, matriz }) {
  const tabla = [r0n, ...matriz];
  const indiceRHS = columnas.length - 1;

  // Evaluar R0 (fila 0) ignorando Z (índice 0) y RHS
  const evaluaciones = r0n.map(evaluarExpresionM);
  const candidatos = evaluaciones.map((v, i) =>
    (i !== 0 && i !== indiceRHS) ? v : Infinity
  );

  const valorMin = Math.min(...candidatos);
  const minIndex = candidatos.indexOf(valorMin);
  const variableEntrante = columnas[minIndex];

  // Calcular fila pivote (usando solo R1...Rn)
  let pivotRow = -1;
  let minRatio = Infinity;
  const razones = [];

  matriz.forEach((fila, i) => {
    const val = fila[minIndex];
    const rhs = fila[fila.length - 1];
    if (val > 0) {
      const ratio = rhs / val;
      razones.push({ fila: i + 1, valor: rhs, divisor: val, ratio });
      if (ratio < minRatio) {
        minRatio = ratio;
        pivotRow = i;
      }
    }
  });

  const filaPivoteVisual = pivotRow + 1;

  return (
    <div style={{ padding: "1rem" }}>
      <h3 style={{ color: "#0070c0" }}>4. B&uacute;squeda del Pivote (con M = 1)</h3>

      <table border={1} cellPadding={4} style={{ borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th style={{ background: "#0056b3", color: "white" }}>#</th>
            {columnas.map((col, idx) => (
              <th key={idx} style={{ background: "#0056b3", color: "white" }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabla.map((fila, fi) => {
            const etiqueta = fi === 0 ? "R0" : `R${fi}`;
            return (
              <tr key={fi}>
                <td><strong>{etiqueta}</strong></td>
                {fila.map((val, i) => {
                  const esPivote = fi === filaPivoteVisual && i === minIndex;
                  const fondo =
                    esPivote ? "#ffcccc" :
                    i === minIndex && fi !== 0 ? "#c8e6c9" :
                    fi === filaPivoteVisual ? "#e0f2f1" : undefined;
                  return (
                    <td key={i} style={{ backgroundColor: fondo }}>{val}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: "1rem", backgroundColor: "#fef6d5", padding: "10px", fontSize: "15px" }}>
        <p><strong>🔹 Evaluación de R0 (con M=1):</strong></p>
        <ul style={{ marginBottom: "8px" }}>
          {columnas.map((col, i) => (
            i !== 0 && i !== indiceRHS ? (
              <li key={i}>{col}: {evaluaciones[i]}</li>
            ) : null
          ))}
        </ul>

        <p><strong>🔹 Variable entrante:</strong> <code>{variableEntrante}</code> (valor más negativo: {valorMin})</p>

        <p><strong>🔹 Cálculo del cociente RHS / coeficiente:</strong></p>
        <ul>
          {razones.map((r, idx) => (
            <li key={idx}>
              Fila {r.fila}: {r.valor} / {r.divisor} = <strong>{r.ratio.toFixed(2)}</strong>
            </li>
          ))}
        </ul>

        <p><strong>🔹 Variable saliente:</strong> Fila {filaPivoteVisual}</p>
        <p><strong>✅ Pivote:</strong> (<strong>{filaPivoteVisual}, {minIndex}</strong>) = <code>{variableEntrante}</code></p>
      </div>
    </div>
  );
}
