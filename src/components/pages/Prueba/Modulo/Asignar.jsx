"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Typography } from "antd";
import Tabla from "../Modal/tabla";

const { Title } = Typography;

export default function Asignar({
  matrizPaso1 = [],
  matrizPaso5 = [],
  nombresFilas = [],
  nombresColumnas = [],
  onResolved = () => {},
}) {
  const [asignaciones, setAsignaciones] = useState([]);
  const [asignacionesLocales, setAsignacionesLocales] = useState([]);
  const [prevDatosCompartir, setPrevDatosCompartir] = useState([]);

  useEffect(() => {
    if (!matrizPaso1.length || !matrizPaso5.length) return;

    const size = matrizPaso1.length;
    const locales = Array(size).fill(-1);
    const usadas = new Set();

    // Paso 1: asignar a los grupos que solo tienen una opción válida
    for (let i = 0; i < size; i++) {
      const opcionesValidas = matrizPaso1[i]
        .map((valor, j) => (valor !== 1000 && !usadas.has(j) ? j : -1))
        .filter(j => j !== -1);

      if (opcionesValidas.length === 1) {
        const j = opcionesValidas[0];
        locales[i] = j;
        usadas.add(j);
      }
    }

    // Paso 2: asignar al resto, usando ceros válidos
    for (let i = 0; i < size; i++) {
      if (locales[i] !== -1) continue; // ya asignado

      let asignado = false;
      for (let j = 0; j < matrizPaso5[i].length; j++) {
        const esCero = matrizPaso5[i][j] === 0;
        const capacidad = matrizPaso1[i][j];
        if (esCero && capacidad !== 1000 && !usadas.has(j)) {
          locales[i] = j;
          usadas.add(j);
          asignado = true;
          break;
        }
      }

      // Paso 3: si no se pudo, asignar a primera opción real no usada
      if (!asignado) {
        for (let j = 0; j < matrizPaso1[i].length; j++) {
          const capacidad = matrizPaso1[i][j];
          if (capacidad !== 1000 && !usadas.has(j)) {
            locales[i] = j;
            usadas.add(j);
            break;
          }
        }
      }
    }

    const datosCompartir = locales.map((colIndex, i) => {
      const fila = nombresFilas[i];
      const columna = nombresColumnas[colIndex];
      if (!fila?.materia || !fila?.grupo || !columna) return null;

      const [aula, piso] = columna.split("=").map((s) => s.trim());
      const capacidad = matrizPaso1?.[i]?.[colIndex] ?? "?";
      const estudiantes = parseInt(fila.estudiantes);
      const esForzado = capacidad < estudiantes;

      return {
        grupo: fila.grupo,
        materia: fila.materia,
        estudiantes: fila.estudiantes,
        aula,
        piso,
        capacidad,
        esForzado,
      };
    }).filter(Boolean);

    if (JSON.stringify(prevDatosCompartir) !== JSON.stringify(datosCompartir)) {
      setPrevDatosCompartir(datosCompartir);
      setAsignaciones(
        datosCompartir.map((d) =>
          `Al grupo ${d.grupo} de la materia "${d.materia}" con ${d.estudiantes} estudiantes se le asignó el aula ${d.aula} del ${d.piso} que tiene una capacidad de ${d.capacidad} personas.` +
          (d.esForzado ? " ⚠️ (Asignación forzada, aula más grande disponible)" : "")
        )
      );
      setAsignacionesLocales(locales);
      onResolved(datosCompartir);
    }
  }, [matrizPaso1, matrizPaso5, nombresFilas, nombresColumnas, onResolved, prevDatosCompartir]);

  const { columnas, filas } = useMemo(() => {
    const columnas = [
      {
        title: "Materia / Grupo",
        dataIndex: "materiaGrupo",
        key: "materiaGrupo",
        fixed: "left",
      },
      ...nombresColumnas.map((nombre, j) => {
        const [aula, piso] = (nombre || "").split("=").map((s) => s.trim());
        return {
          title: (
            <div style={{ textAlign: "center" }}>
              <strong>{aula || `Aula ${j + 1}`}</strong>
              <br />
              <span>{piso ? `= ${piso}` : ""}</span>
            </div>
          ),
          dataIndex: `col_${j}`,
          key: `col_${j}`,
          align: "center",
        };
      }),
    ];

    const filas = matrizPaso1.map((fila, i) => {
      const isReal = nombresFilas[i]?.materia && nombresFilas[i]?.grupo;
      const estudiantes = parseInt(nombresFilas[i]?.estudiantes ?? 0);
      const filaObj = {
        key: `fila_${i}`,
        materiaGrupo: isReal ? (
          <div>
            <strong>{nombresFilas[i].materia}</strong>
            <br />
            Grupo {nombresFilas[i].grupo} = {nombresFilas[i].estudiantes}
          </div>
        ) : (
          <div>
            <strong>—</strong>
            <br />
            Grupo ficticio
          </div>
        ),
      };

      fila.forEach((valor, j) => {
        const esAsignado = asignacionesLocales[i] === j;
        const esCero = matrizPaso5[i]?.[j] === 0;
        const esForzado = valor < estudiantes;
        const fondo = esAsignado
          ? esForzado
            ? "#f08c00"
            : "#ffa94d"
          : esCero
          ? "yellow"
          : "transparent";

        filaObj[`col_${j}`] = (
          <div style={{ backgroundColor: fondo, padding: "4px" }}>{valor}</div>
        );
      });

      return filaObj;
    });

    return { columnas, filas };
  }, [
    matrizPaso1,
    matrizPaso5,
    nombresFilas,
    nombresColumnas,
    asignacionesLocales,
  ]);

  return (
    <div style={{ padding: 24 }}>

      <Tabla
        columnas={columnas}
        filas={filas}
        titulo="Matriz de Asignaciones"
        scrollY={500}
      />

      {asignaciones.map((mensaje, index) => (
        <p key={index} style={{ marginTop: 12, fontWeight: "bold" }}>
          ✅ {mensaje}
        </p>
      ))}
    </div>
  );
}
