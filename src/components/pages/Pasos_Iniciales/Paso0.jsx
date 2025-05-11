import React from "react";
import { InputNumber, Select } from "antd";

const { Option } = Select;

export default function Paso0({
  tipo, setTipo,
  numVars, setNumVars,
  objetivo, setObjetivo,
  restricciones, setRestricciones,
  onResolver
}) {
  const selectStyleTVR = {
    width: 120,
    height: 24,
    fontSize: "12px",
  };

  const selectStyle = {
    width: 50,
    height: 24,
    fontSize: "12px",
  };

  const handleTipoChange = (value) => setTipo(value);

  const handleNumVarsChange = (value) => {
    setNumVars(value);
    setObjetivo(Array(value).fill(null));
    setRestricciones((prev) =>
      prev.map((r) => ({
        ...r,
        coef: Array(value).fill(null),
      }))
    );
  };

  const handleNumRestriccionesChange = (value) => {
    const nuevas = Array.from({ length: value }, () => ({
      coef: Array(numVars).fill(null),
      signo: "≥",
      valor: null,
    }));
    setRestricciones(nuevas);
  };

  const handleCambioObjetivo = (index, value) => {
    const nuevo = [...objetivo];
    nuevo[index] = value;
    setObjetivo(nuevo);
  };

  const handleCambioRestriccion = (resIndex, varIndex, value) => {
    const nuevas = [...restricciones];
    nuevas[resIndex].coef[varIndex] = value;
    setRestricciones(nuevas);
  };

  const handleCambioSignoOVlr = (index, field, value) => {
    const nuevas = [...restricciones];
    nuevas[index][field] = value;
    setRestricciones(nuevas);
  };

  const inputDynamicStyle = (val) => {
    const length = String(val ?? "").length;
    const width = Math.max(28, length * 8 + 12);
    return {
      width,
      height: 24,
      padding: 0,
      fontSize: "12px",
      textAlign: "center",
    };
  };

  const renderSubindice = (n) => {
    const sub = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
    return String(n)
      .split("")
      .map((d) => sub[+d] || "")
      .join("");
  };

  return (
    <div style={{ padding: "1rem", fontSize: "14px" }}>
      {/* Controles */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
        <span>Tipo:</span>
        <Select value={tipo} onChange={handleTipoChange} style={selectStyleTVR} size="small">
          <Option value="min">Minimizar</Option>
          <Option value="max">Maximizar</Option>
        </Select>

        <span>Variables:</span>
        <Select value={numVars} onChange={handleNumVarsChange} style={selectStyleTVR} size="small">
          {Array.from({ length: 10 }, (_, i) => (
            <Option key={i + 1} value={i + 1}>{i + 1}</Option>
          ))}
        </Select>

        <span>Restricciones:</span>
        <Select value={restricciones.length} onChange={handleNumRestriccionesChange} style={selectStyleTVR} size="small">
          {Array.from({ length: 10 }, (_, i) => (
            <Option key={i + 1} value={i + 1}>{i + 1}</Option>
          ))}
        </Select>
      </div>

      {/* Función objetivo */}
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        <strong>{tipo === "min" ? "Min Z =" : "Max Z ="}</strong>
        {objetivo.map((val, i) => (
          <React.Fragment key={i}>
            <InputNumber
              value={val}
              onChange={(value) => handleCambioObjetivo(i, value)}
              style={inputDynamicStyle(val)}
              size="small"
              controls={false}
            />
            <span>x{renderSubindice(i + 1)}{i < objetivo.length - 1 ? " +" : ""}</span>
          </React.Fragment>
        ))}
      </div>

      {/* Restricciones */}
      <div style={{ marginTop: "1rem" }}>
        <strong>Restricciones:</strong>
        {restricciones.map((r, resIndex) => (
          <div key={resIndex} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
            {r.coef.map((val, i) => (
              <React.Fragment key={i}>
                <InputNumber
                  value={val}
                  onChange={(value) => handleCambioRestriccion(resIndex, i, value)}
                  style={inputDynamicStyle(val)}
                  size="small"
                  controls={false}
                />
                <span>x{renderSubindice(i + 1)}{i < r.coef.length - 1 ? " +" : ""}</span>
              </React.Fragment>
            ))}
            <Select
              value={r.signo}
              onChange={(value) => handleCambioSignoOVlr(resIndex, "signo", value)}
              style={selectStyle}
              size="small"
            >
              <Option value="≤">≤</Option>
              <Option value="=">=</Option>
              <Option value="≥">≥</Option>
            </Select>
            <InputNumber
              value={r.valor}
              onChange={(value) => handleCambioSignoOVlr(resIndex, "valor", value)}
              style={inputDynamicStyle(r.valor)}
              size="small"
              controls={false}
            />
          </div>
        ))}
      </div>

      {/* Condición final */}
      <div style={{ marginTop: "1rem", fontStyle: "italic" }}>
        {Array.from({ length: numVars }, (_, i) => `x${renderSubindice(i + 1)}`).join(", ")} ≥ 0
      </div>

      {/* Botón Resolver */}
      <div style={{ marginTop: "1.5rem" }}>
        <button
          onClick={onResolver}
          style={{
            backgroundColor: "#0070c0",
            color: "white",
            border: "none",
            padding: "6px 16px",
            fontSize: "14px",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Resolver
        </button>
      </div>
    </div>
  );
}
