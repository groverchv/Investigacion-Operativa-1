'use client';
import React, { useState } from 'react';
import CrearHorario from './CrearHorario';
import MatrizGeneral from './MatrizGeneral';

import Paso2 from './Paso2';
import Paso3 from './Paso3';
import Paso4 from './Paso4';
import Paso1 from './paso1';

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
  const [filasPaso4, setFilasPaso4] = useState([])

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
        onResultado={setFilasPaso4}
      />
    </>
  );
}
