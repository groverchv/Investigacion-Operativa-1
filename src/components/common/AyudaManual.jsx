/**
 * ============================================
 * COMPONENTE: AyudaManual
 * ============================================
 * Modal de ayuda que explica el funcionamiento del software
 * de asignacion de aulas y horarios.
 * 
 * @description Proporciona documentacion interactiva sobre:
 *  - Gestion de modulos y aulas
 *  - Gestion de materias y grupos
 *  - Proceso de asignacion automatica
 *  - Configuracion de horarios
 *  - Exportacion de resultados
 * 
 * @usage Importar y renderizar en cualquier componente padre.
 *        El boton de ayuda abrira el modal con las instrucciones.
 */

import React, { useState } from 'react';
import { Modal, Button, Collapse, Typography, Divider } from 'antd';
import {
  QuestionCircleOutlined,
  HomeOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ScheduleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

/**
 * Componente principal de Ayuda
 * @param {Object} props - Propiedades del componente
 * @param {string} props.buttonType - Tipo de boton (link, primary, default)
 * @param {string} props.buttonText - Texto del boton
 * @returns {JSX.Element} Boton con modal de ayuda
 */
export default function AyudaManual({ 
  buttonType = 'default', 
  buttonText = 'Manual de Usuario' 
}) {
  const [visible, setVisible] = useState(false);

  /**
   * Abre el modal de ayuda
   */
  const mostrarAyuda = () => setVisible(true);

  /**
   * Cierra el modal de ayuda
   */
  const cerrarAyuda = () => setVisible(false);

  /**
   * Secciones de ayuda del sistema
   */
  const seccionesAyuda = [
    {
      key: '1',
      icon: <AppstoreOutlined />,
      titulo: 'Gestion de Modulos y Aulas',
      contenido: [
        {
          paso: 1,
          texto: 'Haga clic en "Crear Modulo" para agregar un nuevo edificio o bloque.'
        },
        {
          paso: 2,
          texto: 'Dentro de cada modulo, agregue pisos usando el boton "Agregar Piso".'
        },
        {
          paso: 3,
          texto: 'Para cada piso, agregue aulas especificando nombre y capacidad maxima de estudiantes.'
        },
        {
          paso: 4,
          texto: 'Puede editar o eliminar modulos, pisos y aulas en cualquier momento haciendo clic sobre ellos.'
        }
      ]
    },
    {
      key: '2',
      icon: <TeamOutlined />,
      titulo: 'Gestion de Materias y Grupos',
      contenido: [
        {
          paso: 1,
          texto: 'Haga clic en "Crear Materia" para agregar una nueva asignatura.'
        },
        {
          paso: 2,
          texto: 'Dentro de cada materia, agregue grupos especificando el numero de estudiantes.'
        },
        {
          paso: 3,
          texto: 'El sistema calculara automaticamente las aulas compatibles segun la capacidad.'
        },
        {
          paso: 4,
          texto: 'Asegurese de que cada grupo tenga asignado el numero correcto de estudiantes.'
        }
      ]
    },
    {
      key: '3',
      icon: <CheckCircleOutlined />,
      titulo: 'Proceso de Asignacion de Aulas',
      contenido: [
        {
          paso: 1,
          texto: 'Una vez configurados los modulos y materias, haga clic en "Resolver distribucion de aulas".'
        },
        {
          paso: 2,
          texto: 'El sistema generara la Matriz General mostrando todas las posibles asignaciones.'
        },
        {
          paso: 3,
          texto: 'Se aplicara el metodo hungaro para encontrar la asignacion optima.'
        },
        {
          paso: 4,
          texto: 'Los pasos intermedios (reduccion por filas, columnas, cobertura) se mostraran secuencialmente.'
        },
        {
          paso: 5,
          texto: 'La asignacion final mostrara cada grupo con su aula correspondiente.'
        }
      ]
    },
    {
      key: '4',
      icon: <ScheduleOutlined />,
      titulo: 'Configuracion de Horarios',
      contenido: [
        {
          paso: 1,
          texto: 'En la seccion de horarios, defina los bloques horarios disponibles.'
        },
        {
          paso: 2,
          texto: 'Especifique hora de inicio, hora de fin y costo de cada bloque.'
        },
        {
          paso: 3,
          texto: 'El costo puede representar preferencia o demanda del horario.'
        },
        {
          paso: 4,
          texto: 'Haga clic en "Resolver asignacion de horarios" para distribuir los grupos.'
        }
      ]
    },
    {
      key: '5',
      icon: <FileTextOutlined />,
      titulo: 'Exportacion de Resultados',
      contenido: [
        {
          paso: 1,
          texto: 'Una vez completada la asignacion, puede exportar los resultados a PDF.'
        },
        {
          paso: 2,
          texto: 'El PDF incluira: modulos, materias, asignaciones de aulas y horarios.'
        },
        {
          paso: 3,
          texto: 'Haga clic en "Exportar PDF" para descargar el documento.'
        }
      ]
    }
  ];

  return (
    <>
      {/* Boton para abrir el modal de ayuda */}
      <Button 
        type={buttonType}
        icon={<QuestionCircleOutlined />}
        onClick={mostrarAyuda}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px' 
        }}
      >
        {buttonText}
      </Button>

      {/* Modal de ayuda */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <QuestionCircleOutlined style={{ color: '#2563eb', fontSize: '20px' }} />
            <span>Manual de Usuario - Sistema de Asignacion</span>
          </div>
        }
        open={visible}
        onCancel={cerrarAyuda}
        footer={[
          <Button key="close" type="primary" onClick={cerrarAyuda}>
            Entendido
          </Button>
        ]}
        width={700}
        style={{ top: 20 }}
      >
        {/* Introduccion */}
        <div style={{ marginBottom: '24px' }}>
          <Paragraph style={{ fontSize: '14px', color: '#475569' }}>
            Bienvenido al Sistema de Asignacion de Aulas y Horarios. Este software 
            utiliza el <strong>metodo hungaro</strong> (algoritmo de Kuhn-Munkres) para 
            encontrar la asignacion optima entre grupos de estudiantes y aulas disponibles.
          </Paragraph>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* Secciones de ayuda */}
        <Collapse 
          accordion 
          bordered={false}
          style={{ background: '#f8fafc' }}
        >
          {seccionesAyuda.map((seccion) => (
            <Panel
              key={seccion.key}
              header={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#2563eb', fontSize: '16px' }}>
                    {seccion.icon}
                  </span>
                  <span style={{ fontWeight: 600 }}>{seccion.titulo}</span>
                </div>
              }
            >
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {seccion.contenido.map((item, index) => (
                  <li 
                    key={index}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      padding: '10px 0',
                      borderBottom: index < seccion.contenido.length - 1 ? '1px solid #e2e8f0' : 'none'
                    }}
                  >
                    <span 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        minWidth: '24px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        borderRadius: '50%',
                        fontSize: '12px',
                        fontWeight: 600,
                        marginRight: '12px',
                        marginTop: '2px'
                      }}
                    >
                      {item.paso}
                    </span>
                    <span style={{ color: '#475569' }}>{item.texto}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </Collapse>

        <Divider style={{ margin: '16px 0' }} />

        {/* Consejos adicionales */}
        <div style={{ 
          backgroundColor: '#f0f9ff', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #bae6fd'
        }}>
          <Title level={5} style={{ color: '#0369a1', marginBottom: '12px' }}>
            <SettingOutlined /> Consejos Utiles
          </Title>
          <ul style={{ paddingLeft: '20px', margin: 0, color: '#475569' }}>
            <li style={{ marginBottom: '8px' }}>
              Verifique que las capacidades de las aulas sean suficientes para los grupos mas grandes.
            </li>
            <li style={{ marginBottom: '8px' }}>
              El sistema asignara automaticamente el aula mas grande disponible si no hay opciones compatibles.
            </li>
            <li style={{ marginBottom: '8px' }}>
              Las celdas resaltadas en amarillo indican asignaciones con ceros (optimas).
            </li>
            <li>
              Las filas/columnas en verde indican elementos cubiertos durante el proceso de optimizacion.
            </li>
          </ul>
        </div>
      </Modal>
    </>
  );
}
