/**
 * ============================================
 * COMPONENTE: Asignar
 * ============================================
 * Calcula y muestra la asignacion final de grupos a aulas.
 * Utiliza las matrices procesadas por el metodo hungaro.
 * 
 * @param {Array} matrizPaso1 - Matriz original de capacidades
 * @param {Array} matrizPaso5 - Matriz reducida con ceros
 * @param {Array} nombresFilas - Informacion de materias y grupos
 * @param {Array} nombresColumnas - Informacion de aulas
 * @param {Function} onResolved - Callback con los resultados
 */

"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Typography, Card } from "antd";
import { CheckCircleOutlined, WarningOutlined } from "@ant-design/icons";
import Tabla from '../../../../components/common/TablaModal';

const { Title } = Typography;

export default function Asignar({
  matrizPaso1 = [],         
  matrizPaso5 = [],         
  nombresFilas = [],        
  nombresColumnas = [],    
  onResolved = () => {},    
}) {
  // Estados para controlar las asignaciones
  const [asignaciones, setAsignaciones] = useState([]);
  const [asignacionesLocales, setAsignacionesLocales] = useState([]);
  const [prevDatosCompartir, setPrevDatosCompartir] = useState([]);

  // Efecto que calcula las asignaciones de grupos a aulas
  useEffect(() => {
    if (!matrizPaso1.length || !matrizPaso5.length) return;

    const size = matrizPaso1.length;
    const locales = Array(size).fill(-1);  // -1 indica que aún no está asignado
    const usadas = new Set();              // Para marcar aulas ya asignadas

    // Paso 1: asignar automaticamente a los grupos con una sola opcion valida
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

    // Paso 2: asignar a los restantes, buscando ceros validos en matrizPaso5
    for (let i = 0; i < size; i++) {
      if (locales[i] !== -1) continue;

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

      // Paso 3: si aun no se pudo asignar, asignar a la primera aula disponible real
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

    // Transformar las asignaciones en objetos detallados
    const datosCompartir = locales.map((colIndex, i) => {
      const fila = nombresFilas[i];
      const columna = nombresColumnas[colIndex];
      if (!fila?.materia || !fila?.grupo || !columna) return null;

      const [aula, piso] = columna.split("=").map((s) => s.trim());
      const capacidad = matrizPaso1?.[i]?.[colIndex] ?? "?";
      const estudiantes = parseInt(fila.estudiantes);
      const esForzado = capacidad < estudiantes; // Indica si fue asignación forzada

      return {
        grupo: fila.grupo,
        materia: fila.materia,
        estudiantes: fila.estudiantes,
        aula,
        piso,
        capacidad,
        esForzado,
      };
    }).filter(Boolean); // Elimina nulos

    // Si los datos cambiaron, actualizamos estados y notificamos
    if (JSON.stringify(prevDatosCompartir) !== JSON.stringify(datosCompartir)) {
      setPrevDatosCompartir(datosCompartir);
      setAsignaciones(
        datosCompartir.map((d) => ({
          texto: `Al grupo ${d.grupo} de ${d.materia} con ${d.estudiantes} estudiantes se le asigno el aula ${d.aula} del ${d.piso} con capacidad de ${d.capacidad} personas.`,
          esForzado: d.esForzado
        }))
      );
      setAsignacionesLocales(locales);
      onResolved(datosCompartir); // Se envía el resultado al componente padre
    }
  }, [matrizPaso1, matrizPaso5, nombresFilas, nombresColumnas, onResolved, prevDatosCompartir]);

  // Preparar las columnas y filas para mostrar la tabla con resaltado de asignaciones
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

      // Agrega cada celda de la fila con color segun asignacion
      fila.forEach((valor, j) => {
        const esAsignado = asignacionesLocales[i] === j;
        const esCero = matrizPaso5[i]?.[j] === 0;
        const esForzado = valor < estudiantes;

        // Colores profesionales para diferentes estados
        const fondo = esAsignado
          ? esForzado
            ? "#fbbf24"    // Amarillo fuerte para asignacion forzada
            : "#fed7aa"    // Naranja suave para asignacion normal
          : esCero
          ? "#fef08a"      // Amarillo claro para ceros validos
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

  // Renderizar la tabla y los mensajes de asignacion
  return (
    <div style={{ padding: 24 }}>
      <Tabla
        columnas={columnas}
        filas={filas}
        titulo="Matriz de Asignaciones"
        scrollY={500}
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
          Resumen de Asignaciones
        </Title>
        {asignaciones.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 16px',
              marginBottom: '8px',
              backgroundColor: item.esForzado ? '#fef3c7' : '#f0fdf4',
              borderRadius: '6px',
              borderLeft: `4px solid ${item.esForzado ? '#f59e0b' : '#22c55e'}`,
            }}
          >
            {item.esForzado ? (
              <WarningOutlined style={{ color: '#f59e0b', fontSize: '16px', marginTop: '2px' }} />
            ) : (
              <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '16px', marginTop: '2px' }} />
            )}
            <span style={{ color: '#374151' }}>
              {item.texto}
              {item.esForzado && (
                <span style={{ color: '#d97706', fontWeight: 500 }}>
                  {' '}(Asignacion forzada - aula de mayor capacidad disponible)
                </span>
              )}
            </span>
          </div>
        ))}
      </Card>
    </div>
  );
}
