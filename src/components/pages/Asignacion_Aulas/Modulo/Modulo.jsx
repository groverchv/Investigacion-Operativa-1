'use client';
import React, { useState } from "react";
import CrearModulo from "./CrearModulo";
import GrupoMateria from "./GrupoMateria";
import Horarios from "./Horarios";
import MatrizGeneral from "./MatrizGeneral";
import MatrizReducida from "./MatrizReducida";
import Paso1 from "./Paso1";
import Paso2 from "./Paso2";
import Paso3 from "./Paso3";
import Paso4 from "./Paso4";
import Paso5 from "./Paso5";
import Paso6 from "./Paso6";
import Paso7 from "./Paso7";
import Asignar from "./Asignar";

export default function Modulo() {
  const [horarios, setHorarios] = useState([
    { inicio: "07:00", fin: "09:15" },
    { inicio: "09:15", fin: "11:30" },
    { inicio: "11:30", fin: "13:45" },
    { inicio: "14:00", fin: "16:15" },
    { inicio: "16:15", fin: "18:30" },
    { inicio: "18:30", fin: "20:45" },
  ]);

  const [modulos, setModulos] = useState([
    {
      nombre: "FICCT",
      pisos: [
        {
          nombre: "Piso 5",
          aulas: [
            { nombre: "Aula 15", capacidad: "120" },
            { nombre: "Aula 16", capacidad: "120" },
          ],
        },
        {
          nombre: "Piso 4",
          aulas: [
            { nombre: "Aula 12", capacidad: "60" },
            { nombre: "Aula 13", capacidad: "60" },
            { nombre: "Aula 14", capacidad: "40" },
          ],
        },
        {
          nombre: "Piso 3",
          aulas: [
            { nombre: "Aula 9", capacidad: "60" },
            { nombre: "Aula 10", capacidad: "60" },
            { nombre: "Aula 11", capacidad: "40" },
          ],
        },
        {
          nombre: "Piso 2",
          aulas: [
            { nombre: "Aula 5", capacidad: "45" },
            { nombre: "Aula 6", capacidad: "45" },
            { nombre: "Aula 7", capacidad: "60" },
            { nombre: "Aula 8", capacidad: "30" },
          ],
        },
        {
          nombre: "Piso 1",
          aulas: [
            { nombre: "Aula 1", capacidad: "45" },
            { nombre: "Aula 2", capacidad: "45" },
            { nombre: "Aula 3", capacidad: "60" },
            { nombre: "Aula 4", capacidad: "30" },
          ],
        },
      ],
    },
  ]);

  const [materias, setMaterias] = useState([
    { nombre: "Cálculo I", grupos: [{ nombre: "Grupo 1", estudiantes: "35" }] },
    { nombre: "Física I", grupos: [{ nombre: "Grupo 2", estudiantes: "50" }] },
    {
      nombre: "Introducción a la Ingeniería",
      grupos: [{ nombre: "Grupo 3", estudiantes: "120" }],
    },
    { nombre: "Redes I", grupos: [{ nombre: "Grupo 4", estudiantes: "40" }] },
    {
      nombre: "Álgebra Lineal",
      grupos: [{ nombre: "Grupo 5", estudiantes: "60" }],
    },
  ]);
  const [matrizReducida, setMatrizReducida] = useState([]);
  const [matrizPaso1, setMatrizPaso1] = useState([]);
  const [matrizPaso2, setMatrizPaso2] = useState([]);
  const [matrizPaso3, setMatrizPaso3] = useState([]);
  const [matrizPaso4, setMatrizPaso4] = useState([]);
  const [matrizPaso5, setMatrizPaso5] = useState([]);
  const [matrizPaso6, setMatrizPaso6] = useState([]);
  const [matrizPaso7, setMatrizPaso7] = useState({ matriz: [], cumple: false });

  const [filasCubiertasPaso5, setFilasCubiertasPaso5] = useState([]);
  const [columnasCubiertasPaso5, setColumnasCubiertasPaso5] = useState([]);
  const [filasCubiertasPaso7, setFilasCubiertasPaso7] = useState([]);
  const [columnasCubiertasPaso7, setColumnasCubiertasPaso7] = useState([]);
  const [cumplePaso5, setCumplePaso5] = useState(false);
  const [cumplePaso7, setCumplePaso7] = useState(false);

  const [nombresFilas, setNombresFilas] = useState([]);
  const [nombresColumnas, setNombresColumnas] = useState([]);


  return (
    <div>
      <CrearModulo modulos={modulos} setModulos={setModulos} />
      <GrupoMateria materias={materias} setMaterias={setMaterias} />
      <Horarios horarios={horarios} setHorarios={setHorarios} />
      <MatrizGeneral materias={materias} modulos={modulos} horarios={horarios} onDataReady={() => {}} />
      <MatrizReducida materias={materias} modulos={modulos} onDataReady={setMatrizReducida} />

      {matrizReducida.length > 0 && (
        <Paso1
          matrizReducida={matrizReducida}
          materias={materias}
          modulos={modulos}
          onResolved={(matrizCuadrada, filas, columnas) => {
            setMatrizPaso1(matrizCuadrada);
            setNombresFilas(filas);
            setNombresColumnas(columnas);
          }}
        />
      )}

      {matrizPaso1.length > 0 && (
        <Paso2
          matriz={matrizPaso1}
          nombresFilas={nombresFilas}
          nombresColumnas={nombresColumnas}
          umbralFicticio={1000}
          onResolved={setMatrizPaso2}
        />
      )}

      {matrizPaso2.length > 0 && (
        <Paso3
          matriz={matrizPaso2}
          nombresFilas={nombresFilas}
          nombresColumnas={nombresColumnas}
          umbralFicticio={1000}
          onResolved={setMatrizPaso3}
        />
      )}

      {matrizPaso3.length > 0 && (
        <Paso4
          matriz={matrizPaso3}
          nombresFilas={nombresFilas}
          nombresColumnas={nombresColumnas}
          umbralFicticio={1000}
          onResolved={setMatrizPaso4}
        />
      )}

      {matrizPaso4.length > 0 && (
        <Paso5
          matriz={matrizPaso4}
          nombresFilas={nombresFilas}
          nombresColumnas={nombresColumnas}
          umbralFicticio={1000}
          onResolved={({ matriz, filasCubiertas, columnasCubiertas, cumple }) => {
            setMatrizPaso5(matriz);
            setFilasCubiertasPaso5(filasCubiertas);
            setColumnasCubiertasPaso5(columnasCubiertas);
            setCumplePaso5(cumple);
          }}
        />
      )}

      {matrizPaso5.length > 0 && !cumplePaso5 && (
        <Paso6
          matriz={matrizPaso5}
          filasCubiertas={filasCubiertasPaso5}
          columnasCubiertas={columnasCubiertasPaso5}
          nombresFilas={nombresFilas}
          nombresColumnas={nombresColumnas}
          onResolved={setMatrizPaso6}
        />
      )}

{matrizPaso6.length > 0 && (
  <Paso7
    matriz={matrizPaso6}
    nombresFilas={nombresFilas}
    nombresColumnas={nombresColumnas}
    umbralFicticio={1000}
    onResolved={({ matriz, filasCubiertas, columnasCubiertas, cumple }) => {
      setMatrizPaso7(matriz);
      setFilasCubiertasPaso7(filasCubiertas);
      setColumnasCubiertasPaso7(columnasCubiertas);
      setCumplePaso7(cumple);
    }}
  />
)}


{matrizPaso1.length > 0 && matrizPaso7.length > 0 && (
  <Asignar
    matrizPaso1={matrizPaso1}
    matrizPaso7={matrizPaso7}
    nombresFilas={nombresFilas}
    nombresColumnas={nombresColumnas}
  />
)}



    </div>
  );
}
