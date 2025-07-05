"use client";
import React, { useMemo } from "react";
import { Typography } from "antd";
import Tabla from "../Modal/tabla";

const { Title } = Typography;

export default function AsignacionHorario({
  matrizPaso7 = [],         // Matriz de costos original (valores de referencia visuales)
  matrizPaso10 = [],        // Matriz de asignaciones con ceros finales del método húngaro
  nombresFilas = [],        // Información de materias, grupos y estudiantes
  nombresColumnas = [],     // Información de horarios y costos
}) {
  // Determina qué celdas representan asignaciones válidas (donde hay un 0 no usado aún)
  const asignacionesValidas = useMemo(() => {
    const asignadas = [];
    const filasOcupadas = new Set();      // Para no asignar dos veces la misma fila
    const columnasOcupadas = new Set();   // Para no asignar dos veces la misma columna

    for (let i = 0; i < matrizPaso10.length; i++) {
      for (let j = 0; j < matrizPaso10[i].length; j++) {
        const esCero = matrizPaso10[i][j] === 0;
        if (esCero && !filasOcupadas.has(i) && !columnasOcupadas.has(j)) {
          asignadas.push({ i, j });       // Guardamos la asignación
          filasOcupadas.add(i);
          columnasOcupadas.add(j);
        }
      }
    }

    return asignadas;  // Devuelve las asignaciones válidas como pares {i, j}
  }, [matrizPaso10]);

  //  Define las columnas de la tabla visual, usando nombres de horarios y mostrando el costo
  const columnas = useMemo(() => {
    return [
      {
        title: "Materia / Grupo",
        dataIndex: "materiaGrupo",
        key: "materiaGrupo",
        fixed: "left",
      },
      ...nombresColumnas.map((col, j) => ({
        title: (
          <div style={{ textAlign: "center" }}>
            <strong>{col?.nombre || `Horario ${j + 1}`}</strong>
            <br />
            <em>{col?.costo ? `Costo: ${col.costo}` : ""}</em>
          </div>
        ),
        dataIndex: `col_${j}`,
        key: `col_${j}`,
        align: "center",
      })),
    ];
  }, [nombresColumnas]);

  //  Crea las filas para la tabla visual, resaltando las celdas que están asignadas
  const filasPaso7 = useMemo(() => {
    return matrizPaso7.map((fila, i) => {
      const filaObj = {
        key: `fila7_${i}`,
        materiaGrupo: (
          <div>
            <strong>{nombresFilas[i]?.materia || "Materia"}</strong>
            <br />
            Grupo {nombresFilas[i]?.grupo || "?"} ={" "}
            {nombresFilas[i]?.estudiantes || "?"}
          </div>
        ),
      };

      // Recorremos cada valor de la fila para construir las celdas
      fila.forEach((valor, j) => {
        const asignado = asignacionesValidas.some(
          (a) => a.i === i && a.j === j
        );
        filaObj[`col_${j}`] = (
          <div
            style={{
              backgroundColor: asignado ? "orange" : "#ffff66",  // Color distinto si fue asignado
              padding: "4px",
              fontWeight: asignado ? "bold" : "normal",
            }}
          >
            {valor}
          </div>
        );
      });

      return filaObj;
    });
  }, [matrizPaso7, nombresFilas, asignacionesValidas]);

  //  Genera un resumen en formato de texto de las asignaciones válidas, omitiendo las ficticias
  const resumenAsignaciones = useMemo(() => {
    return asignacionesValidas
      .filter(({ i }) => {
        const materia = nombresFilas[i]?.materia?.toLowerCase() || "";
        return !materia.includes("ficticia"); // Se omiten filas ficticias
      })
      .map(({ i, j }) => {
        const materia = nombresFilas[i]?.materia || `Materia ${i + 1}`;
        const grupo = nombresFilas[i]?.grupo || "?";
        const horario = nombresColumnas[j]?.nombre || `Horario ${j + 1}`;
        return `✅ Asignado ${materia} (Grupo ${grupo}) al ${horario}`;
      });
  }, [asignacionesValidas, nombresFilas, nombresColumnas]);

  //  Renderiza la tabla y el resumen de asignaciones debajo
  return (
    <div style={{ padding: 24 }}>
      <Tabla
        columnas={columnas}
        filas={filasPaso7}
        titulo="Asignacion de Horarios"
        scrollY={400}
      />

      <Title level={5}>Asignaciones realizadas:</Title>
      {resumenAsignaciones.length > 0 ? (
        <ul>
          {resumenAsignaciones.map((txt, index) => (
            <li key={index}>{txt}</li>
          ))}
        </ul>
      ) : (
        <p>No se realizaron asignaciones.</p>
      )}
    </div>
  );
}
