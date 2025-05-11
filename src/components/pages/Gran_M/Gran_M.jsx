import React, { useState } from "react";
import Paso0 from "../Pasos_Iniciales/Paso0";
import Paso1 from "../Pasos_Iniciales/Paso1";
import Paso2 from "../Pasos_Iniciales/Paso2";
import Paso3 from "./Paso3";
import Paso4 from "./Paso4";
import Paso5 from "./Paso5";

export default function Gran_M() {
  const [tipo, setTipo] = useState("min");
  const [numVars, setNumVars] = useState(2);
  const [objetivo, setObjetivo] = useState(Array(2).fill(null));
  const [restricciones, setRestricciones] = useState([
    { coef: Array(2).fill(null), signo: "≥", valor: null },
    { coef: Array(2).fill(null), signo: "≥", valor: null },
  ]);

  const [mostrarPaso1, setMostrarPaso1] = useState(false);
  const [datosPaso3, setDatosPaso3] = useState(null); // contiene columnas, r0n y matriz
  const [datosPaso4, setDatosPaso4] = useState(null); // contiene fila y columna pivote

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
          <Paso3
            numVars={numVars}
            restricciones={restricciones}
            objetivo={objetivo}
            onResultado={setDatosPaso3} // captura columnas, r0n y matriz
          />
          {datosPaso3 && (
            <Paso4
              columnas={datosPaso3.columnas}
              r0n={datosPaso3.r0n}
              matriz={datosPaso3.matriz}
              numVars={numVars}
              onSeleccionPivote={({ fila, columna }) => setDatosPaso4({ fila, columna })}
            />
          )}
          {datosPaso3 && datosPaso4 && (
            <Paso5
              columnas={datosPaso3.columnas}
              r0n={datosPaso3.r0n}
              matriz={datosPaso3.matriz}
              filaPivoteVisual={datosPaso4.fila}
              colPivoteIndex={datosPaso4.columna}
            />
          )}
        </>
      )}
    </div>
  );
}
