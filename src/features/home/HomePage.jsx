/**
 * ============================================
 * COMPONENTE: Inicio
 * ============================================
 * Pagina principal de bienvenida del sistema.
 * Muestra informacion general sobre el proposito de la aplicacion.
 * 
 * @description Pantalla de inicio con:
 *  - Mensaje de bienvenida
 *  - Descripcion del sistema
 *  - Tarjetas informativas de funcionalidades
 */

import React from 'react';
import { Typography, Card, Row, Col } from 'antd';
import {
  AppstoreOutlined,
  TeamOutlined,
  ScheduleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

/**
 * Funcionalidades principales del sistema
 */
const funcionalidades = [
  {
    icon: <AppstoreOutlined style={{ fontSize: '32px', color: '#2563eb' }} />,
    titulo: 'Gestion de Aulas',
    descripcion: 'Administre modulos, pisos y aulas con sus respectivas capacidades de forma intuitiva.',
  },
  {
    icon: <TeamOutlined style={{ fontSize: '32px', color: '#2563eb' }} />,
    titulo: 'Materias y Grupos',
    descripcion: 'Organice las materias y sus grupos de estudiantes para una asignacion eficiente.',
  },
  {
    icon: <ScheduleOutlined style={{ fontSize: '32px', color: '#2563eb' }} />,
    titulo: 'Horarios Flexibles',
    descripcion: 'Configure bloques horarios con costos personalizados para optimizar la distribucion.',
  },
  {
    icon: <FileTextOutlined style={{ fontSize: '32px', color: '#2563eb' }} />,
    titulo: 'Exportacion PDF',
    descripcion: 'Genere reportes profesionales con los resultados de las asignaciones realizadas.',
  },
];

/**
 * Componente Inicio
 * @returns {JSX.Element} Pagina de bienvenida
 */
export default function Inicio() {
  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {/* Seccion de bienvenida */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '48px',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        borderRadius: '12px',
        border: '1px solid #bae6fd',
      }}>
        <Title 
          level={1} 
          style={{ 
            color: '#1e3a5f',
            marginBottom: '16px',
            fontWeight: 700,
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          }}
        >
          Sistema de Asignacion de Aulas
        </Title>
        <Paragraph style={{ 
          fontSize: '18px', 
          color: '#475569',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: 1.7,
        }}>
          Optimice la distribucion de espacios academicos utilizando el metodo hungaro 
          para encontrar la asignacion optima entre grupos de estudiantes y aulas disponibles.
        </Paragraph>
      </div>

      {/* Tarjetas de funcionalidades */}
      <div style={{ marginBottom: '32px' }}>
        <Title 
          level={3} 
          style={{ 
            textAlign: 'center', 
            marginBottom: '32px',
            color: '#1e293b',
          }}
        >
          Funcionalidades Principales
        </Title>
        
        <Row gutter={[24, 24]} justify="center">
          {funcionalidades.map((func, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                hoverable
                style={{
                  height: '100%',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center',
                }}
                bodyStyle={{ padding: '28px 20px' }}
              >
                <div style={{ marginBottom: '16px' }}>
                  {func.icon}
                </div>
                <Title level={5} style={{ marginBottom: '12px', color: '#1e293b' }}>
                  {func.titulo}
                </Title>
                <Paragraph style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
                  {func.descripcion}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Seccion de instrucciones rapidas */}
      <Card
        style={{
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          background: '#fefce8',
        }}
      >
        <Title level={4} style={{ color: '#854d0e', marginBottom: '16px' }}>
          Para Comenzar
        </Title>
        <ol style={{ 
          paddingLeft: '20px', 
          color: '#713f12',
          lineHeight: 2,
          margin: 0,
        }}>
          <li>Navegue a la seccion <strong>Asignacion de Aulas</strong> en el menu lateral.</li>
          <li>Configure los modulos, pisos y aulas de su institucion.</li>
          <li>Agregue las materias y grupos con la cantidad de estudiantes.</li>
          <li>Ejecute el proceso de asignacion para obtener la distribucion optima.</li>
          <li>Opcionalmente, configure horarios y exporte los resultados en PDF.</li>
        </ol>
      </Card>
    </div>
  );
}
