import React, { useState } from "react";
import Paso0 from "../Pasos_Iniciales/Paso0";
import Paso1 from "../Pasos_Iniciales/Paso1";
import Paso2 from "../Pasos_Iniciales/Paso2"; // asegúrate que el archivo exista

export default function Dos_Fases() {
  const [tipo, setTipo] = useState("min");
  const [numVars, setNumVars] = useState(2);
  const [objetivo, setObjetivo] = useState(Array(2).fill(null));
  const [restricciones, setRestricciones] = useState([
    { coef: Array(2).fill(null), signo: "≥", valor: null },
    { coef: Array(2).fill(null), signo: "≥", valor: null },
  ]);

  const [mostrarPaso1, setMostrarPaso1] = useState(false);

  return (
    <div>
      <Paso0
        tipo={tipo}
        setTipo={setTipo}
        numVars={numVars}
        setNumVars={setNumVars}
        objetivo={objetivo}
        setObjetivo={setObjetivo}
        restricciones={restricciones}
        setRestricciones={setRestricciones}
        onResolver={() => setMostrarPaso1(true)}
      />

      {mostrarPaso1 && (
        <>
          <Paso1
            tipo={tipo}
            numVars={numVars}
            objetivo={objetivo}
            restricciones={restricciones}
          />
          <Paso2
            numVars={numVars}
            restricciones={restricciones}
          />
        </>
      )}
    </div>
  );
}
