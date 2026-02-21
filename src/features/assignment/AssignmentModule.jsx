/**
 * ============================================
 * COMPONENTE: AssignmentModule
 * ============================================
 * Componente principal del sistema de asignacion de aulas.
 * Coordina la gestion de modulos, materias, horarios y
 * ejecuta el metodo hungaro para la asignacion optima.
 * 
 * @description Flujo de trabajo:
 *  1. Configurar modulos y aulas
 *  2. Configurar materias y grupos
 *  3. Ejecutar asignacion de aulas
 *  4. Configurar horarios
 *  5. Ejecutar asignacion de horarios
 *  6. Exportar resultados
 */

"use client";
import React, { useState } from "react";
import { Button, Typography, Card, Divider, Steps, Space } from "antd";
import {
  AppstoreOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

// Componentes de configuracion
import CrearModulo from "./components/building/CrearModulo";
import GrupoMateria from "./components/subjects/GrupoMateria";
import CrearHorario from "./components/schedule/CrearHorario";

// Componentes de matrices
import MatrizGeneral from "./components/matrix/MatrizGeneral";
import MatrizReducida from "./components/matrix/MatrizReducida";

// Componentes de pasos del algoritmo hungaro
import Paso1 from "./components/steps/Paso1";
import Paso2 from "./components/steps/Paso2";
import Paso3 from "./components/steps/Paso3";
import Paso4 from "./components/steps/Paso4";
import Paso5 from "./components/steps/Paso5";
import Paso6 from "./components/steps/Paso6";
import Paso7 from "./components/steps/Paso7";
import Paso8 from "./components/steps/Paso8";
import Paso9 from "./components/steps/Paso9";
import Paso10 from "./components/steps/Paso10";

// Componentes de resultados
import Asignar from "./components/results/Asignar";
import AsignacionHorario from "./components/schedule/AsignacionHorario";
import ExportarResultados from "./components/results/ExportarResultados";

const { Title, Paragraph } = Typography;

export default function AssignmentModule() {
  // Estados de control del flujo
  const [resuelto, setResuelto] = useState(false);
  const [resueltoHorario, setResueltoHorario] = useState(false);

  // Estados para matrices de horarios
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

  // Datos de horarios predeterminados
  const [horarios, setHorarios] = useState([
    { nombre: "Horario 1", inicio: "07:00", fin: "09:15", costo: 50 },
    { nombre: "Horario 2", inicio: "09:15", fin: "11:30", costo: 40 },
    { nombre: "Horario 3", inicio: "11:30", fin: "13:45", costo: 45 },
    { nombre: "Horario 4", inicio: "14:00", fin: "16:15", costo: 45 },
    { nombre: "Horario 5", inicio: "16:15", fin: "18:30", costo: 40 },
    { nombre: "Horario 6", inicio: "18:30", fin: "20:45", costo: 50 },
  ]);

  // Datos de modulos predeterminados (edificio FICCT)
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

  // Datos de materias predeterminados
  const [materias, setMaterias] = useState([
    { nombre: "Calculo I", grupos: [{ nombre: "Grupo 1", estudiantes: "35" }] },
    { nombre: "Fisica I", grupos: [{ nombre: "Grupo 2", estudiantes: "50" }] },
    {
      nombre: "Introduccion a la Ingenieria",
      grupos: [{ nombre: "Grupo 3", estudiantes: "120" }],
    },
    { nombre: "Redes I", grupos: [{ nombre: "Grupo 4", estudiantes: "40" }] },
    {
      nombre: "Algebra Lineal",
      grupos: [{ nombre: "Grupo 5", estudiantes: "60" }],
    },
  ]);

  // Estados para matrices de aulas
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

  // Determinar el paso actual
  const getCurrentStep = () => {
    if (resueltoHorario) return 3;
    if (resuelto) return 2;
    return 0;
  };

  return (
    <div style={{ padding: '0 8px', maxWidth: '100%' }}>
      {/* Indicador de progreso */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
        }}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <Steps
          current={getCurrentStep()}
          size="small"
          items={[
            {
              title: 'Configuracion',
              icon: <AppstoreOutlined />,
            },
            {
              title: 'Asignacion Aulas',
              icon: <CheckCircleOutlined />,
            },
            {
              title: 'Horarios',
              icon: <ScheduleOutlined />,
            },
            {
              title: 'Exportar',
              icon: <FileTextOutlined />,
            },
          ]}
          responsive
        />
      </Card>

      {/* Seccion de configuracion */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
        }}
      >
        <Title level={4} style={{ color: '#1e293b', marginBottom: 16 }}>
          <AppstoreOutlined style={{ marginRight: 8, color: '#2563eb' }} />
          Configuracion Inicial
        </Title>
        <Paragraph style={{ color: '#64748b', marginBottom: 24 }}>
          Configure los modulos (edificios), aulas, materias y grupos antes de ejecutar 
          el proceso de asignacion.
        </Paragraph>

        <CrearModulo modulos={modulos} setModulos={setModulos} />
        <GrupoMateria materias={materias} setMaterias={setMaterias} />
      </Card>

      {/* Boton para resolver distribucion de aulas */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: '8px',
          border: '1px solid #2563eb',
          backgroundColor: '#f0f9ff',
        }}
        bodyStyle={{ padding: '20px 24px' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={5} style={{ color: '#1e3a5f', margin: 0 }}>
            <PlayCircleOutlined style={{ marginRight: 8 }} />
            Ejecutar Asignacion de Aulas
          </Title>
          <Paragraph style={{ color: '#475569', margin: '8px 0 16px 0' }}>
            El sistema aplicara el metodo hungaro para encontrar la asignacion optima.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<CheckCircleOutlined />}
            onClick={() => setResuelto(true)}
            disabled={resuelto}
            style={{ minWidth: 250 }}
          >
            {resuelto ? 'Asignacion Completada' : 'Resolver Distribucion de Aulas'}
          </Button>
        </Space>
      </Card>

      {/* Resultados de asignacion de aulas */}
      {resuelto && (
        <Card
          style={{
            marginBottom: 24,
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <Title level={4} style={{ color: '#1e293b', marginBottom: 16 }}>
            <CheckCircleOutlined style={{ marginRight: 8, color: '#22c55e' }} />
            Proceso de Asignacion - Metodo Hungaro
          </Title>

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

          {/* Seccion de horarios */}
          <Divider style={{ margin: '32px 0' }} />

          <Title level={4} style={{ color: '#1e293b', marginBottom: 16, marginTop: 24 }}>
            <ScheduleOutlined style={{ marginRight: 8, color: '#2563eb' }} />
            Asignacion de Horarios
          </Title>

          <CrearHorario horarios={horarios} setHorarios={setHorarios} />

          {/* Boton para resolver horarios */}
          <Card
            style={{
              marginTop: 24,
              borderRadius: '8px',
              border: '1px solid #2563eb',
              backgroundColor: '#f0f9ff',
            }}
            bodyStyle={{ padding: '20px 24px' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Title level={5} style={{ color: '#1e3a5f', margin: 0 }}>
                <PlayCircleOutlined style={{ marginRight: 8 }} />
                Ejecutar Asignacion de Horarios
              </Title>
              <Paragraph style={{ color: '#475569', margin: '8px 0 16px 0' }}>
                Distribuya los grupos en los bloques horarios configurados.
              </Paragraph>
              <Button
                type="primary"
                size="large"
                icon={<ScheduleOutlined />}
                onClick={() => setResueltoHorario(true)}
                disabled={resueltoHorario}
                style={{ minWidth: 250 }}
              >
                {resueltoHorario ? 'Horarios Asignados' : 'Resolver Asignacion de Horarios'}
              </Button>
            </Space>
          </Card>

          {/* Resultados de asignacion de horarios */}
          {resueltoHorario && (
            <div style={{ marginTop: 24 }}>
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
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
