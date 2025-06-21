"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Typography } from "antd";
import Tabla from "./Modal/tabla";

const { Title } = Typography;

export default function Asignar({
  matrizPaso1 = [],
  matrizPaso7 = [],
  nombresFilas = [],
  nombresColumnas = [],
  onResolved = () => {}, // Prop para enviar los datos al padre
}) {
  const [asignaciones, setAsignaciones] = useState([]);
  const [asignacionesLocales, setAsignacionesLocales] = useState([]);
  const [prevDatosCompartir, setPrevDatosCompartir] = useState([]);

  useEffect(() => {
    if (!matrizPaso1.length || !matrizPaso7.length) return;

    const size = matrizPaso1.length;
    const locales = Array(size).fill(-1);
    const usadas = new Set();

    for (let i = 0; i < size; i++) {
      let asignado = false;
      for (let j = 0; j < matrizPaso7[i].length; j++) {
        if (matrizPaso7[i][j] === 0 && !usadas.has(j)) {
          locales[i] = j;
          usadas.add(j);
          asignado = true;
          break;
        }
      }
      if (!asignado) {
        for (let j = 0; j < matrizPaso7[i].length; j++) {
          if (!usadas.has(j)) {
            locales[i] = j;
            usadas.add(j);
            break;
          }
        }
      }
    }

    const datosCompartir = locales
      .map((colIndex, i) => {
        const fila = nombresFilas[i];
        const columna = nombresColumnas[colIndex];
        if (!fila?.materia || !fila?.grupo || !columna) return null;
        const [aula, piso] = columna.split("=").map((s) => s.trim());
        const capacidad = matrizPaso1?.[i]?.[colIndex] ?? "?";

        return {
          grupo: fila.grupo,
          materia: fila.materia,
          estudiantes: fila.estudiantes,
          aula: aula,
          piso: piso,
          capacidad: capacidad,
        };
      })
      .filter(Boolean);

    // Evitar llamar onResolved si los datos no cambiaron
    if (JSON.stringify(prevDatosCompartir) !== JSON.stringify(datosCompartir)) {
      setPrevDatosCompartir(datosCompartir);
      setAsignaciones(
        datosCompartir.map(
          (d) =>
            `Al grupo ${d.grupo} de la materia "${d.materia}" con ${d.estudiantes} estudiantes se le asignó el aula ${d.aula} del ${d.piso} que tiene una capacidad de ${d.capacidad} personas.`
        )
      );
      setAsignacionesLocales(locales);
      onResolved(datosCompartir);
    }
  }, [matrizPaso1, matrizPaso7, nombresFilas, nombresColumnas, onResolved, prevDatosCompartir]);

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
        const esCero = matrizPaso7[i]?.[j] === 0;
        const fondo = esAsignado
          ? "#ffa94d"
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
    matrizPaso7,
    nombresFilas,
    nombresColumnas,
    asignacionesLocales,
  ]);

  return (
    <div style={{ padding: 24 }}>
      <Title level={4}>📙 Matriz del Paso 1 (asignaciones y ceros)</Title>

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
