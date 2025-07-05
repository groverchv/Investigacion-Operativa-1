"use client";
import React, { useState } from "react";
import CrearModulo from "./CrearModulo";
import GrupoMateria from "./GrupoMateria";
import MatrizGeneral from "./MatrizGeneral";
import MatrizReducida from "./MatrizReducida";
import Paso1 from "./Paso1";
import Paso2 from "./Paso2";
import Paso3 from "./Paso3";
import Paso4 from "./Paso4";
import Paso5 from "./Paso5";
import Asignar from "./Asignar";
import { Button, Typography } from "antd";
import CrearHorario from "./CrearHorario";
import Paso6 from "./Paso6";
import Paso7 from "./Paso7";
import Paso8 from "./Paso8";
import Paso9 from "./Paso9";
import Paso10 from "./Paso10";
import AsignacionHorario from "./AsignacionHorario";
import ExportarResultados from "./ExportarResultados";

export default function Modulo() {
  const [resuelto, setResuelto] = useState(false);
  const [resueltoHorario, setResueltoHorario] = useState(false);
  const [matrizPaso9, setMatrizPaso9] = useState([]);
  const [matrizPaso10, setMatrizPaso10] = useState([]);
  const [nombreHorario, setNombreHorario] = useState([]);
  const [matrizPaso6, setMatrizPaso6] = useState([]);
  const [filasPaso6, setFilasPaso6] = useState([]);
  const [filasPaso7, setFilasPaso7] = useState([]);
  const [filasPaso8, setFilasPaso8] = useState([]);
  const [filasPaso9, setFilasPaso9] = useState([]);
  const [columnasPaso7, setColumnasPaso7] = useState([]);
  const [columnasPaso8, setColumnasPaso8] = useState([]);
  const [columnasPaso9, setColumnasPaso9] = useState([]);
  const [filasPaso10, setFilasPaso10] = useState([]);
  const [columnasPaso10, setColumnasPaso10] = useState([]);
  const [horarios, setHorarios] = useState([

  ]);

  const [modulos, setModulos] = useState([
   
  ]);

  const [materias, setMaterias] = useState([
  
  ]);

  const [matrizReducida, setMatrizReducida] = useState([]);
  const [matrizPaso1, setMatrizPaso1] = useState([]);
  const [matrizPaso2, setMatrizPaso2] = useState([]);
  const [matrizPaso3, setMatrizPaso3] = useState([]);
  const [matrizPaso4, setMatrizPaso4] = useState([]);
  const [matrizPaso5, setMatrizPaso5] = useState([]);
  const [matrizPaso8, setMatrizPaso8] = useState([]);
  const [nombresFilas, setNombresFilas] = useState([]);
  const [nombresColumnas, setNombresColumnas] = useState([]);
  const [matrizPaso7, setMatrizPaso7] = useState([]);

  return (
    <div style={{ padding: 24 }}>
      <CrearModulo modulos={modulos} setModulos={setModulos} />
      <GrupoMateria materias={materias} setMaterias={setMaterias} />

      <div style={{ margin: "16px 0" }}>
        <Button type="primary" onClick={() => setResuelto(true)}>
          Resolver distribución de aulas
        </Button>
      </div>

      {resuelto && (
        <>
          <MatrizGeneral
            materias={materias}
            modulos={modulos}
            onDataReady={() => {}}
          />
          <MatrizReducida
            materias={materias}
            modulos={modulos}
            onDataReady={setMatrizReducida}
          />
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
              onResolved={setMatrizPaso5}
            />
          )}
          {matrizPaso1.length > 0 && matrizPaso5.length > 0 && (
            <Asignar
              matrizPaso1={matrizPaso1}
              matrizPaso5={matrizPaso5}
              nombresFilas={nombresFilas}
              nombresColumnas={nombresColumnas}
            />
          )}

          <CrearHorario horarios={horarios} setHorarios={setHorarios} />

          <div style={{ margin: "16px 0" }}>
            <Button type="primary" onClick={() => setResueltoHorario(true)}>
              Resolver asignación de horarios
            </Button>
          </div>

          {resueltoHorario && (
            <>
              <Paso6
                horarios={horarios}
                nombresFilas={nombresFilas}
                setNombreHorario={setNombreHorario}
                setMatrizPaso6={setMatrizPaso6}
                setFilasPaso6={setFilasPaso6}
              />
              <Paso7
                matriz={matrizPaso6}
                nombresFilas={filasPaso6}
                nombresColumnas={nombreHorario}
                umbralFicticio={1000}
                setMatrizPaso7={setMatrizPaso7}
                setFilasPaso7={setFilasPaso7}
                setColumnasPaso7={setColumnasPaso7}
              />
              <Paso8
                matriz={matrizPaso7}
                nombresFilas={filasPaso7}
                nombresColumnas={columnasPaso7}
                umbralFicticio={1000}
                setMatrizPaso8={setMatrizPaso8}
                setFilasPaso8={setFilasPaso8}
                setColumnasPaso8={setColumnasPaso8}
              />
              <Paso9
                matriz={matrizPaso8}
                nombresFilas={filasPaso8}
                nombresColumnas={columnasPaso8}
                setMatrizPaso9={setMatrizPaso9}
                setFilasPaso9={setFilasPaso9}
                setColumnasPaso9={setColumnasPaso9}
              />
              <Paso10
                matriz={matrizPaso9}
                nombresFilas={filasPaso9}
                nombresColumnas={columnasPaso9}
                onResolved={(nuevaMatriz, nuevasFilas, nuevasColumnas) => {
                  setMatrizPaso10(nuevaMatriz);
                  setFilasPaso10(nuevasFilas);
                  setColumnasPaso10(nuevasColumnas);
                }}
              />
              <AsignacionHorario
                matrizPaso7={matrizPaso7}
                matrizPaso10={matrizPaso10}
                nombresFilas={filasPaso10}
                nombresColumnas={columnasPaso10}
              />

              <ExportarResultados
                modulos={modulos}
                materias={materias}
                horarios={horarios}
                matrizPaso1={matrizPaso1}
                matrizPaso5={matrizPaso5}
                matrizPaso7={matrizPaso7}
                matrizPaso10={matrizPaso10}
                nombresFilas={nombresFilas}
                nombresColumnas={nombresColumnas}
                filasPaso10={filasPaso10}
                columnasPaso10={columnasPaso10}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
