import React, { useEffect } from "react";

function calcularRenglonCeroNuevo(r0, matriz, restricciones) {
  return r0.map((val, idx) => {
    let sumaM = 0;
    restricciones.forEach((_, i) => {
      const coef = matriz[i][idx];
      sumaM += typeof coef === "number" ? coef : 0;
    });

    console.log(`R0[${idx}] = ${val} + (-${sumaM}M)`);

    if (idx === 0) return -1;

    if (idx === r0.length - 1) {
      if (sumaM === 0) return 0;
      if (sumaM === 1) return "-M";
      if (sumaM === -1) return "M";
      return `${-sumaM}M`;
    }

    if (typeof val === "number") {
      const total = val - sumaM;
      if (sumaM === 0) return val;
      if (val === 0 && sumaM === 1) return "-M";
      if (val === 0 && sumaM === -1) return "M";
      if (val === 0) return `${-sumaM}M`;
      return `${val} - ${sumaM}M`;
    }

    if (val === "M") {
      const restante = 1 - sumaM;
      if (restante === 0) return "0";
      if (restante === 1) return "M";
      if (restante === -1) return "-M";
      return `${restante}M`;
    }

    return val;
  });
}

export default function Paso3({ numVars, restricciones, objetivo, onResultado }) {
  const renderSub = (n) => {
    const sub = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
    return String(n).split("").map((d) => sub[+d] || "").join("");
  };

  const totalVars = numVars + restricciones.length * 2;
  const columnas = [
    "Z",
    ...Array.from({ length: numVars }, (_, i) => `x${renderSub(i + 1)}`),
    ...Array.from({ length: restricciones.length }, (_, i) => `e${renderSub(i + 1)}`),
    ...Array.from({ length: restricciones.length }, (_, i) => `a${renderSub(i + 1)}`),
    "RHS"
  ];

  const r0 = [-1];
  for (let i = 0; i < numVars; i++) r0.push(objetivo[i] ?? 0);
  for (let i = 0; i < restricciones.length; i++) r0.push(0);
  for (let i = 0; i < restricciones.length; i++) r0.push("M");
  r0.push(0);

  const matriz = restricciones.map((r, i) => {
    const fila = Array(totalVars + 2).fill(0);
    fila[0] = 0;

    const coefX = [...(r.coef || [])];
    while (coefX.length < numVars) coefX.push(0);

    coefX.forEach((val, j) => {
      fila[1 + j] = val;
    });

    for (let j = 0; j < restricciones.length; j++) {
      fila[1 + numVars + j] = j === i ? -1 : 0;
      fila[1 + numVars + restricciones.length + j] = j === i ? 1 : 0;
    }

    fila[1 + totalVars] = r.valor ?? 0;
    return fila;
  });

  const r0n = calcularRenglonCeroNuevo(r0, matriz, restricciones);

  useEffect(() => {
    if (typeof onResultado === "function") {
      onResultado({ columnas, r0n, matriz });
    }
  }, [columnas, r0n, matriz, onResultado]);

  return (
    <div style={{ padding: "1rem" }}>
      <h3 style={{ color: "#0070c0" }}>3. Rengl&oacute;n Cero (Z')</h3>

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
          <tr style={{ background: "#dde7f0" }}>
            <td><strong>R0</strong></td>
            {r0.map((val, i) => (
              <td key={i}>{val}</td>
            ))}
          </tr>
          {matriz.map((fila, fi) => (
            <tr key={fi}>
              <td><strong>R{fi + 1}</strong></td>
              {fila.map((val, i) => (
                <td key={i} style={{ color: i === 1 + numVars + restricciones.length + fi ? "purple" : "black" }}>{val}</td>
              ))}
            </tr>
          ))}
          <tr style={{ background: "#d9f0d2" }}>
            <td><strong>nuevoR0</strong></td>
            {r0n.map((val, i) => (
              <td key={i}>{val}</td>
            ))}
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "1rem", backgroundColor: "#fef6d5", padding: "8px", fontStyle: "italic" }}>
        (R0 nuevo) = (R0 original) + (−M × R<sub>1</sub>) + (−M × R<sub>2</sub>)
      </div>
    </div>
  );
}
