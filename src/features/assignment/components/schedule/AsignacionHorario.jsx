/**
 * ============================================
 * COMPONENTE: AsignacionHorario
 * ============================================
 * Muestra la asignacion final de grupos a horarios.
 * Utiliza las matrices procesadas del metodo hungaro.
 * 
 * @param {Array} matrizPaso7 - Matriz de costos original
 * @param {Array} matrizPaso10 - Matriz con asignaciones finales
 * @param {Array} nombresFilas - Informacion de grupos
 * @param {Array} nombresColumnas - Informacion de horarios
 */

"use client";
import React, { useMemo } from "react";
import { Typography, Card, List } from "antd";
import { CheckCircleOutlined, ScheduleOutlined } from "@ant-design/icons";
import Tabla from '../../../../components/common/TablaModal';

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

  //  Define las columnas de la tabla visual
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

  //  Crea las filas para la tabla visual
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
              backgroundColor: asignado ? "#fed7aa" : "#fef08a",
              padding: "4px",
              fontWeight: asignado ? "bold" : "normal",
              borderRadius: asignado ? "4px" : "0",
            }}
          >
            {valor}
          </div>
        );
      });

      return filaObj;
    });
  }, [matrizPaso7, nombresFilas, asignacionesValidas]);

  //  Genera un resumen de las asignaciones validas
  const resumenAsignaciones = useMemo(() => {
    return asignacionesValidas
      .filter(({ i }) => {
        const materia = nombresFilas[i]?.materia?.toLowerCase() || "";
        return !materia.includes("ficticia");
      })
      .map(({ i, j }) => {
        const materia = nombresFilas[i]?.materia || `Materia ${i + 1}`;
        const grupo = nombresFilas[i]?.grupo || "?";
        const horario = nombresColumnas[j]?.nombre || `Horario ${j + 1}`;
        return `${materia} (Grupo ${grupo}) asignado a ${horario}`;
      });
  }, [asignacionesValidas, nombresFilas, nombresColumnas]);

  //  Renderiza la tabla y el resumen de asignaciones
  return (
    <div style={{ padding: 24 }}>
      <Tabla
        columnas={columnas}
        filas={filasPaso7}
        titulo="Asignacion de Horarios"
        scrollY={400}
      />

      {/* Resumen de asignaciones */}
      <Card
        style={{
          marginTop: 24,
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
        }}
        bodyStyle={{ padding: '16px' }}
      >
        <Title level={5} style={{ marginBottom: 16, color: '#1e293b' }}>
          <ScheduleOutlined style={{ marginRight: 8, color: '#2563eb' }} />
          Asignaciones de Horarios Realizadas
        </Title>
        {resumenAsignaciones.length > 0 ? (
          <List
            dataSource={resumenAsignaciones}
            renderItem={(item, index) => (
              <List.Item
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  borderLeft: '4px solid #22c55e',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircleOutlined style={{ color: '#22c55e' }} />
                  <span style={{ color: '#374151' }}>{item}</span>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <p style={{ color: '#64748b' }}>No se realizaron asignaciones de horarios.</p>
        )}
      </Card>
    </div>
  );
}
