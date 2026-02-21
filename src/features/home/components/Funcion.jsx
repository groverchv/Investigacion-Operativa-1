/**
 * ============================================
 * COMPONENTE: Funcion
 * ============================================
 * Componente informativo sobre la funcion del sistema.
 * 
 * @description Explica el proposito y funcionamiento 
 *              del algoritmo de asignacion utilizado.
 */

import React from 'react';
import { Typography, Card, Steps } from 'antd';
import {
  CalculatorOutlined,
  TableOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

/**
 * Pasos del metodo hungaro
 */
const pasosMetodo = [
  {
    title: 'Matriz de Costos',
    description: 'Se construye la matriz de compatibilidad entre grupos y aulas.',
  },
  {
    title: 'Reduccion por Filas',
    description: 'Se resta el valor minimo de cada fila a todos sus elementos.',
  },
  {
    title: 'Reduccion por Columnas',
    description: 'Se resta el valor minimo de cada columna a todos sus elementos.',
  },
  {
    title: 'Cobertura de Ceros',
    description: 'Se trazan lineas minimas para cubrir todos los ceros.',
  },
  {
    title: 'Asignacion Optima',
    description: 'Se determinan las asignaciones basadas en los ceros independientes.',
  },
];

/**
 * Componente Funcion
 * @returns {JSX.Element} Informacion sobre el metodo de asignacion
 */
export default function Funcion() {
  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <Card
        style={{
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <CalculatorOutlined style={{ fontSize: '48px', color: '#2563eb' }} />
          <Title level={2} style={{ color: '#1e293b', marginTop: '16px' }}>
            Metodo Hungaro de Asignacion
          </Title>
          <Paragraph style={{ fontSize: '16px', color: '#64748b' }}>
            Algoritmo de optimizacion para resolver problemas de asignacion
          </Paragraph>
        </div>

        <Paragraph style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8 }}>
          El <strong>metodo hungaro</strong> (tambien conocido como algoritmo de Kuhn-Munkres) 
          es un algoritmo de optimizacion combinatoria que resuelve el problema de asignacion 
          en tiempo polinomico. Este sistema lo utiliza para encontrar la asignacion optima 
          entre grupos de estudiantes y aulas disponibles, minimizando el desperdicio de 
          capacidad y garantizando que cada grupo tenga un aula compatible.
        </Paragraph>

        <Title level={4} style={{ marginTop: '32px', marginBottom: '20px', color: '#1e293b' }}>
          Pasos del Algoritmo
        </Title>

        <Steps
          direction="vertical"
          current={-1}
          items={pasosMetodo.map((paso) => ({
            title: <span style={{ fontWeight: 600 }}>{paso.title}</span>,
            description: <span style={{ color: '#64748b' }}>{paso.description}</span>,
            status: 'process',
          }))}
        />
      </Card>
    </div>
  );
}
