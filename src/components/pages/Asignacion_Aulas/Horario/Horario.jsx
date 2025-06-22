"use client";
import React, { useState } from "react";
import CrearHorario from "./CrearHorario";
import MatrizGeneral from "./MatrizGeneral";
import Paso1 from "./paso1";
import Paso2 from "./Paso2";
import Paso3 from "./Paso3";
import Paso4 from "./Paso4";
import Paso5 from "./Paso5";
import Paso6 from "./Paso6";
import Paso7 from "./Paso7";
import Paso8 from "./Paso8";
import Asignar from "./Asignar";

export default function Horario() {
  const [horarios, setHorarios] = useState([
    { inicio: "07:00", fin: "09:15", costo: 50 },
    { inicio: "09:15", fin: "11:30", costo: 40 },
    { inicio: "11:30", fin: "13:45", costo: 45 },
    { inicio: "14:00", fin: "16:15", costo: 45 },
    { inicio: "16:15", fin: "18:30", costo: 40 },
    { inicio: "18:30", fin: "20:45", costo: 50 },
  ]);

  const [columnasPaso1, setColumnasPaso1] = useState([]);
  const [filasPaso1, setFilasPaso1] = useState([]);
  const [filasPaso2, setFilasPaso2] = useState([]);
  const [filasPaso3, setFilasPaso3] = useState([]);
  const [filasPaso4, setFilasPaso4] = useState([]);
  const [filasPaso5, setFilasPaso5] = useState([]);
  const [filasPaso6, setFilasPaso6] = useState([]);
  const [filasPaso7, setFilasPaso7] = useState([]);
  const [filasPaso8, setFilasPaso8] = useState([]);

  const [filasConLineaPaso4, setFilasConLineaPaso4] = useState([]);
  const [columnasConLineaPaso4, setColumnasConLineaPaso4] = useState([]);
  const [filasConLineaPaso6, setFilasConLineaPaso6] = useState([]);
  const [columnasConLineaPaso6, setColumnasConLineaPaso6] = useState([]);
  const [filasConLineaPaso8, setFilasConLineaPaso8] = useState([]);
  const [columnasConLineaPaso8, setColumnasConLineaPaso8] = useState([]);

  return (
    <>
      <CrearHorario horarios={horarios} setHorarios={setHorarios} />
      <MatrizGeneral horarios={horarios} />

      <Paso1
        horarios={horarios}
        onResultado={(columnas, filas) => {
          setColumnasPaso1(columnas);
          setFilasPaso1(filas);
        }}
      />

      <Paso2
        columnasPaso1={columnasPaso1}
        filasPaso1={filasPaso1}
        onResultado={setFilasPaso2}
      />

      <Paso3
        columnasPaso2={columnasPaso1}
        filasPaso2={filasPaso2}
        onResultado={setFilasPaso3}
      />

      <Paso4
        columnasPaso3={columnasPaso1}
        filasPaso3={filasPaso3}
        onResultado={({ filas, filasConLinea, columnasConLinea }) => {
          setFilasPaso4(filas);
          setFilasConLineaPaso4(filasConLinea);
          setColumnasConLineaPaso4(columnasConLinea);
        }}
      />

      <Paso5
        columnasPaso4={columnasPaso1}
        filasPaso4={filasPaso4}
        filasConLinea={filasConLineaPaso4}
        columnasConLinea={columnasConLineaPaso4}
        onResultado={setFilasPaso5}
      />

      <Paso6
        columnas={columnasPaso1}
        filas={filasPaso5}
        onResultado={({ filas, filasConLinea, columnasConLinea }) => {
          setFilasPaso6(filas);
          setFilasConLineaPaso6(filasConLinea);
          setColumnasConLineaPaso6(columnasConLinea);
        }}
      />

      <Paso7
        columnasPaso6={columnasPaso1}
        filasPaso6={filasPaso6}
        filasConLinea={filasConLineaPaso6}
        columnasConLinea={columnasConLineaPaso6}
        onResultado={setFilasPaso7}
      />

      <Paso8
        columnas={columnasPaso1}
        filas={filasPaso7}
        onResultado={({ filas, filasConLinea, columnasConLinea }) => {
          setFilasPaso8(filas);
          setFilasConLineaPaso8(filasConLinea);
          setColumnasConLineaPaso8(columnasConLinea);
        }}
      />

      <Asignar
        columnas={columnasPaso1}
        filasPaso1={filasPaso1}
        filasPaso8={filasPaso8}
        horarios={horarios}
      />
    </>
  );
}
