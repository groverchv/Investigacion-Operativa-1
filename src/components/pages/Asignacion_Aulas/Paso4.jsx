'use client';
import React from 'react';
import { Typography, Alert } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function Paso4({ filasTachadas = [], columnasTachadas = [], totalFilas = 0, totalColumnas = 0 }) {
  const totalLineas = filasTachadas.length + columnasTachadas.length;
  const n = Math.min(totalFilas, totalColumnas); // caso matriz cuadrada o rectangular

  const esSolucionFactible = totalLineas === n;

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Paso 4: Verificar si la solución es factible</Title>
      <Paragraph>
        Se suman las líneas horizontales y verticales trazadas. Si este número es igual a{' '}
        <Text strong>n = min(filas, columnas)</Text>, entonces es posible hacer la asignación óptima.
      </Paragraph>

      <Paragraph>
        <Text>Filas tachadas: </Text><Text code>{JSON.stringify(filasTachadas)}</Text><br />
        <Text>Columnas tachadas: </Text><Text code>{JSON.stringify(columnasTachadas)}</Text><br />
        <Text>Total de líneas: </Text><Text code>{totalLineas}</Text><br />
        <Text>n = </Text><Text code>{n}</Text>
      </Paragraph>

      {esSolucionFactible ? (
        <Alert
          message="✅ Se puede realizar una asignación óptima."
          type="success"
          showIcon
        />
      ) : (
        <Alert
          message="❌ Aún no es posible hacer una asignación completa. Se debe realizar una reducción adicional."
          type="warning"
          showIcon
        />
      )}
    </div>
  );
}
