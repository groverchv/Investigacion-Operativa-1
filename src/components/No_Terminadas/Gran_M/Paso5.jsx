import React from "react";

// Evaluar valor numérico (para normalizar)
function evaluar(valor) {
  if (typeof valor === "number") return valor;
  if (typeof valor === "string") {
    if (/^-?M$/.test(valor)) return valor.startsWith('-') ? -1 : 1;
    const match = valor.match(/^(-?\d+)\s*([+-])\s*(\d+)M$/);
    if (match) {
      const base = parseFloat(match[1]);
      const signo = match[2] === "+" ? 1 : -1;
      const mCoef = parseFloat(match[3]);
      return base + signo * mCoef;
    }
    const soloM = valor.match(/^(-?\d+)M$/);
    if (soloM) return parseFloat(soloM[1]);
    const soloNum = valor.match(/^(-?\d+)$/);
    if (soloNum) return parseFloat(soloNum[1]);
  }
  return 0;
}

// Operaciones simbólicas
function operarSimbolico(a, b, p) {
  if (a === "M") a = "1M";
  if (p === "M") p = "1M";

  if (typeof a === "number") a = `${a}`;
  if (typeof b === "number") b = `${b}`;
  if (typeof p === "number") p = `${p}`;

  const parseTerminos = (expr) => {
    const coef = { const: 0, M: 0 };
    const partes = expr.split(/(?=[+-])/g).map((p) => p.trim());

    for (let parte of partes) {
      if (parte.includes("M")) {
        const mPart = parte.replace("M", "");
        coef.M += parseFloat(mPart || "1");
      } else {
        coef.const += parseFloat(parte);
      }
    }
    return coef;
  };

  const A = parseTerminos(a);
  const B = parseTerminos(b);
  const P = parseTerminos(p);

  const resConst = A.const - B.const * P.const;
  const resM = A.M - B.const * P.M - B.M * P.const;

  let resultado = "";
  if (Math.abs(resConst) > 1e-8) resultado += Number(resConst.toFixed(2));
  if (Math.abs(resM) > 1e-8) {
    const coefM = Math.abs(resM) === 1 ? "M" : `${Number(Math.abs(resM).toFixed(2))}M`;
    resultado += resM >= 0 && resultado ? ` + ${coefM}` : resM < 0 ? ` - ${coefM}` : coefM;
  }

  return resultado || "0";
}

export default function Paso5({ columnas, r0n, matriz, filaPivoteVisual, colPivoteIndex }) {
  const tabla = [r0n, ...matriz];
  const nuevaTabla = [];

  const filaPivote = tabla[filaPivoteVisual];
  const valorPivoteEval = evaluar(filaPivote[colPivoteIndex]);

  if (valorPivoteEval === 0 || isNaN(valorPivoteEval)) {
    return (
      <div style={{ color: "red", padding: "1rem" }}>
        ⚠ Error: El valor del pivote es 0 o inválido.
      </div>
    );
  }

  // Normalizar la fila del pivote
  const filaNormalizada = filaPivote.map((val) => {
    const evaluado = evaluar(val);
    const resultado = evaluado / valorPivoteEval;
    return Math.abs(resultado % 1) < 1e-6 ? parseInt(resultado) : parseFloat(resultado.toFixed(2));
  });
  nuevaTabla[filaPivoteVisual] = filaNormalizada;

  // Otras filas ajustadas
  tabla.forEach((fila, fi) => {
    if (fi === filaPivoteVisual) return;
    const factor = evaluar(fila[colPivoteIndex]);

    const nuevaFila = fila.map((val, i) => {
      const valorNuevo = operarSimbolico(val, factor, filaNormalizada[i]);
      return i === colPivoteIndex ? "0" : valorNuevo; // convertir columna pivote en 0
    });

    nuevaTabla[fi] = nuevaFila;
  });

  return (
    <div style={{ padding: "1rem" }}>
      <h3 style={{ color: "#0070c0" }}>Primera Iteración</h3>

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
            let etiqueta = "";
            if (fi === 0) etiqueta = "nuevoR0";
            else if (fi === filaPivoteVisual) etiqueta = columnas[colPivoteIndex];
            else etiqueta = `R${fi}`;

            return (
              <tr key={fi}>
                <td><strong>{etiqueta}</strong></td>
                {fila.map((val, i) => (
                  <td
                    key={i}
                    style={{
                      backgroundColor: i === colPivoteIndex && fi === filaPivoteVisual ? "#ffcccc" : undefined
                    }}
                  >
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
