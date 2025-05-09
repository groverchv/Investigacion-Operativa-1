import React, { useState } from 'react';
import { Button, InputNumber, Select, Table, Typography, Form, Space, Divider } from 'antd';

const { Title, Paragraph } = Typography;
const { Option } = Select;

export default function Gran_M() {
  const [numVars, setNumVars] = useState(2);
  const [numRestricciones, setNumRestricciones] = useState(2);
  const [zCoeffs, setZCoeffs] = useState([]);
  const [restricciones, setRestricciones] = useState([]);

  const [tabla, setTabla] = useState(null);

  const handleZChange = (value, index) => {
    const copia = [...zCoeffs];
    copia[index] = value;
    setZCoeffs(copia);
  };

  const handleRestriccionChange = (rowIndex, colIndex, value) => {
    const copia = [...restricciones];
    if (!copia[rowIndex]) copia[rowIndex] = Array(numVars + 2).fill(0); // +2 = operador y resultado
    copia[rowIndex][colIndex] = value;
    setRestricciones(copia);
  };

  const generarTablaInicial = () => {
    const vars = Array.from({ length: numVars }, (_, i) => `x${i + 1}`);
    const data = [];

    restricciones.forEach((r, idx) => {
      const fila = {};
      fila.key = idx;
      vars.forEach((v, i) => (fila[v] = r[i]));
      fila['operador'] = r[numVars];
      fila['valor'] = r[numVars + 1];
      data.push(fila);
    });

    setTabla({ columnas: vars, data });
  };

  return (
    <div style={{ padding: 24 }}>
      <Title>Método de la Gran M - Entrada Dinámica</Title>
      <Paragraph>Ingrese su problema de programación lineal:</Paragraph>

      <Space direction="vertical">
        <Space>
          <label>Número de variables:</label>
          <InputNumber min={1} value={numVars} onChange={setNumVars} />
          <label>Número de restricciones:</label>
          <InputNumber min={1} value={numRestricciones} onChange={setNumRestricciones} />
        </Space>

        <Divider>Función Objetivo (Max Z)</Divider>
        <Form layout="inline">
          {Array.from({ length: numVars }, (_, i) => (
            <Form.Item key={i} label={`x${i + 1}`}>
              <InputNumber onChange={(val) => handleZChange(val, i)} />
            </Form.Item>
          ))}
        </Form>

        <Divider>Restricciones</Divider>
        {Array.from({ length: numRestricciones }, (_, ri) => (
          <Form layout="inline" key={ri} style={{ marginBottom: 8 }}>
            {Array.from({ length: numVars }, (_, vi) => (
              <Form.Item key={vi} label={`x${vi + 1}`}>
                <InputNumber onChange={(val) => handleRestriccionChange(ri, vi, val)} />
              </Form.Item>
            ))}
            <Form.Item>
              <Select defaultValue="≤" style={{ width: 60 }} onChange={(val) => handleRestriccionChange(ri, numVars, val)}>
                <Option value="≤">≤</Option>
                <Option value="=">=</Option>
                <Option value="≥">≥</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <InputNumber placeholder="Resultado" onChange={(val) => handleRestriccionChange(ri, numVars + 1, val)} />
            </Form.Item>
          </Form>
        ))}

        <Button type="primary" onClick={generarTablaInicial}>
          Generar tabla inicial
        </Button>
      </Space>

      {tabla && (
        <>
          <Divider>Tabla Estándar Inicial</Divider>
          <Table
            columns={[
              ...tabla.columnas.map((x) => ({ title: x, dataIndex: x, key: x })),
              { title: 'Operador', dataIndex: 'operador', key: 'operador' },
              { title: 'Resultado', dataIndex: 'valor', key: 'valor' },
            ]}
            dataSource={tabla.data}
            bordered
            pagination={false}
          />
        </>
      )}
    </div>
  );
}
