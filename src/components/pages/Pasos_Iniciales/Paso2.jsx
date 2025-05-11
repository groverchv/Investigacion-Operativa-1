import React from "react";

export default function Paso2({ numVars, restricciones }) {
  const renderSub = (n) => {
    const sub = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
    return String(n).split("").map((d) => sub[+d]).join("");
  };

  const artificiales = restricciones.map((r) => r.valor ?? 0);
  const valorZ = artificiales.reduce((sum, val) => sum + val, 0);

  return (
    <div style={{ padding: "1rem", fontSize: "16px" }}>
      <h3 style={{ color: "#0070c0", fontWeight: "bold" }}>
        2. Revisar la Solución Básica Factible Inicial
      </h3>

      <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
        {[...Array(numVars)].map((_, i) => (
          <li key={`x${i + 1}`}><strong>x{renderSub(i + 1)} = 0</strong></li>
        ))}

        {restricciones.map((_, i) => (
          <li key={`e${i + 1}`} style={{ color: i % 2 === 0 ? "red" : "green" }}>
            e{renderSub(i + 1)} = 0
          </li>
        ))}

        {artificiales.map((val, i) => (
          <li key={`a${i + 1}`}><strong>a{renderSub(i + 1)} = {val}</strong></li>
        ))}

        <li>
          Z = {artificiales.map(v => `M·${v}`).join(" + ")} = <strong>{valorZ}M</strong>
        </li>
      </ul>

      <div style={{ marginTop: "1rem", backgroundColor: "#fef6d5", padding: "8px" }}>
        <em>Se resuelve el sistema para las variables básicas</em>
      </div>
    </div>
  );
}
