'use client';
import React from 'react';
import { Typography, Alert } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function Paso2({
  filasTachadas = [],
  columnasTachadas = [],
  totalFilas = 0,
  totalColumnas = 0
}) {
  const totalLineas = filasTachadas.length + columnasTachadas.length;
  const n = Math.min(totalFilas, totalColumnas);

  const esSolucionFactible = totalLineas === n;

  // Aplicar +1 para mostrar como "Fila 1", "Columna 2", etc.
  const filasLegibles = filasTachadas.map(i => `Fila ${i + 1}`);
  const columnasLegibles = columnasTachadas.map(i => `Columna ${i + 1}`);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Paso 4: Verificar si la solución es factible</Title>
      <Paragraph>
        Se suman las líneas horizontales y verticales trazadas. Si este número es igual a{' '}
        <Text strong>n = min(filas, columnas)</Text>, entonces es posible hacer la asignación óptima.
      </Paragraph>

      <div style={{ marginBottom: 16 }}>
        <Text>Filas cubiertas: </Text><Text code>{JSON.stringify(filasLegibles)}</Text><br />
        <Text>Columnas cubiertas: </Text><Text code>{JSON.stringify(columnasLegibles)}</Text><br />
        <Text>Total de líneas: </Text><Text code>{totalLineas}</Text><br />
        <Text>n = </Text><Text code>{n}</Text>
      </div>

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
