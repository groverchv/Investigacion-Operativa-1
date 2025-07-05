"use client";
import React, { useEffect } from "react";
import Tabla from "../Modal/tabla";
import { Typography } from "antd";

export default function Paso7({
  matriz = [],
  nombresFilas = [],
  nombresColumnas = [],
  umbralFicticio = 1000,
  setMatrizPaso7,
  setFilasPaso7,
  setColumnasPaso7,
}) {
  useEffect(() => {
    if (!matriz.length) return;

    const numFilas = matriz.length;
    const numColumnas = matriz[0]?.length || 0;

    let nuevaMatriz = matriz.map((f) => [...f]);
    let nuevasFilas = [...nombresFilas];
    let nuevasColumnas = [...nombresColumnas];

    if (numFilas < numColumnas) {
      const diferencia = numColumnas - numFilas;
    
      for (let i = 0; i < diferencia; i++) {
        nuevaMatriz.push(Array(numColumnas).fill(0));
        nuevasFilas.push({
          materia: "Materia Ficticia",
          grupo: `Ficticio ${i + 1}`,
          estudiantes: 0,
        });
      }
    } else if (numColumnas < numFilas) {
      const diferencia = numFilas - numColumnas;

      nuevaMatriz = nuevaMatriz.map((fila) => [
        ...fila,
        ...Array(diferencia).fill(umbralFicticio),
      ]);
      for (let j = 0; j < diferencia; j++) {
        nuevasColumnas.push({
          nombre: `Horario Ficticio ${j + 1}`,
          costo: umbralFicticio,
        });
      }
    }

    // Guardar datos exportados
    setMatrizPaso7?.(nuevaMatriz);
    setFilasPaso7?.(nuevasFilas);
    setColumnasPaso7?.(nuevasColumnas);
  }, [matriz, nombresFilas, nombresColumnas]);

  const columnasTabla = [
    {
      title: "Materia / Grupo",
      dataIndex: "grupo",
      key: "grupo",
      render: (_, record) => (
        <div style={{ whiteSpace: "pre-line" }}>
          <strong>{record.materia}</strong>
          <br />
          Grupo {record.grupo} = {record.estudiantes}
        </div>
      ),
    },
    ...nombresColumnas.map((col, idx) => ({
      title: (
        <div style={{ textAlign: "center" }}>
          <strong>{col.nombre || `Horario ${idx + 1}`}</strong>
          <br />
          <span style={{ fontSize: 12 }}>
            Costo: {col.costo !== undefined ? col.costo : "No definido"}
          </span>
        </div>
      ),
      dataIndex: `col${idx}`,
      key: `col${idx}`,
      align: "center",
    })),
  ];

  const filasTabla = nombresFilas.map((fila, i) => {
    const obj = {
      key: `fila-${i}`,
      materia: fila.materia || "Materia Ficticia",
      grupo: fila.grupo || `Ficticio`,
      estudiantes: fila.estudiantes ?? 0,
    };
    matriz[i]?.forEach((val, j) => {
      obj[`col${j}`] = val;
    });
    return obj;
  });

  return (
    <div style={{ marginTop: 32 }}>
      <Typography.Title level={4}>
        Paso 7 — Matriz Simétrica con Ficticios
      </Typography.Title>
      <Tabla
        columnas={columnasTabla}
        filas={filasTabla}
        titulo="Matriz Simétrica con Ficticios"
        scrollY={260}
      />
    </div>
  );
}
