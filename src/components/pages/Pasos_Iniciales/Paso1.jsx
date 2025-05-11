import React from "react";

export default function Paso1({ tipo, numVars, objetivo, restricciones }) {
  const renderSub = (n) => {
    const sub = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
    return String(n).split("").map((d) => sub[+d] || "").join("");
  };

  const renderFuncionObjetivo = () => {
    const terms = [];

    for (let i = 0; i < numVars; i++) {
      terms.push(`${objetivo[i] ?? 0}x${renderSub(i + 1)}`);
    }

    for (let i = 0; i < restricciones.length; i++) {
      terms.push(`0e${renderSub(i + 1)}`);
    }

    for (let i = 0; i < restricciones.length; i++) {
      terms.push(`M·a${renderSub(i + 1)}`);
    }

    return terms.join(" + ");
  };

  const renderRestricciones = () => {
    return restricciones.map((res, i) => {
      const partes = [];

      const coef = [...(res.coef || [])];
      while (coef.length < numVars) coef.push(0);

      coef.forEach((c, j) => {
        partes.push(`${c ?? 0}x${renderSub(j + 1)}`);
      });

      for (let j = 0; j < restricciones.length; j++) {
        if (i === j) {
          partes.push(`-e${renderSub(j + 1)}`);
        } else {
          partes.push(`0e${renderSub(j + 1)}`);
        }
      }

      for (let j = 0; j < restricciones.length; j++) {
        if (i === j) {
          partes.push(`a${renderSub(j + 1)}`);
        } else {
          partes.push(`0a${renderSub(j + 1)}`);
        }
      }

      return (
        <p key={i} style={{ fontFamily: "monospace", margin: "4px 0" }}>
          {partes.join(" + ")} = {res.valor ?? 0}
        </p>
      );
    });
  };

  return (
    <div style={{ padding: "1rem", fontSize: "16px" }}>
      <h3 style={{ color: "#0070c0", fontWeight: "bold" }}>
        1. Formular el problema en su formato estandarizado:
      </h3>

      <p>
        <strong style={{ color: "purple" }}>Función objetivo con penalización:</strong>
      </p>

      <p style={{ fontFamily: "monospace", marginBottom: "1rem" }}>
        <strong>Z = </strong>{renderFuncionObjetivo()}
      </p>

      <p><strong>Restricciones:</strong></p>
      {renderRestricciones()}
    </div>
  );
}
