'use client'
import React, { useState } from 'react';
import {
  Table,
  InputNumber,
  Typography,
  Button,
  Space,
  Input,
  Select
} from 'antd';
import 'antd/dist/reset.css';

const { Text } = Typography;
const { Option } = Select;

export default function Paso0({ onListo }) {
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [tablaVisible, setTablaVisible] = useState(false);
  const [nombreTabla, setNombreTabla] = useState('');
  const [editingCol, setEditingCol] = useState(null);
  const [editingRow, setEditingRow] = useState(null);

  const handleChange = (value, rowIndex, field) => {
    const newData = [...dataSource];
    newData[rowIndex][field] = value;
    setDataSource(newData);
  };

  const getTextWidth = (text, font = '14px Arial') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    return context.measureText(text).width + 20;
  };

  const inputDynamicStyle = (val) => {
    const width = getTextWidth(String(val ?? ''));
    return {
      display: 'inline-block',
      minWidth: 45,
      width,
      height: 32,
      padding: '0 4px',
      fontSize: '14px',
      textAlign: 'center',
      borderRadius: '6px',
      outline: 'none',
      boxShadow: 'none',
    };
  };

  const renderInput = (field) => (_, record, index) => (
    <InputNumber
      min={0}
      value={record[field]}
      onChange={(value) => handleChange(value, index, field)}
      controls={false}
      style={inputDynamicStyle(record[field])}
    />
  );

  const handleEditColName = (colKey, newName) => {
    setColumns(prev =>
      prev.map(col =>
        col.key === colKey ? { ...col, title: newName } : col
      )
    );
    setEditingCol(null);
  };

  const handleEditRowName = (rowKey, newName) => {
    setDataSource(prev =>
      prev.map(row =>
        row.key === rowKey ? { ...row, grupo: newName } : row
      )
    );
    setEditingRow(null);
  };

  const tableColumns = [
    {
      title: 'Grupo',
      dataIndex: 'grupo',
      key: 'grupo',
      render: (text, record) =>
        editingRow === record.key ? (
          <Input
            autoFocus
            defaultValue={text}
            onBlur={(e) => handleEditRowName(record.key, e.target.value)}
            onPressEnter={(e) => handleEditRowName(record.key, e.target.value)}
            size="small"
          />
        ) : (
          <Text
            strong
            onDoubleClick={() => setEditingRow(record.key)}
            style={{ cursor: 'pointer' }}
          >
            {text}
          </Text>
        ),
    },
    ...columns.map((col) => ({
      title:
        editingCol === col.key ? (
          <Input
            autoFocus
            defaultValue={col.title}
            onBlur={(e) => handleEditColName(col.key, e.target.value)}
            onPressEnter={(e) => handleEditColName(col.key, e.target.value)}
            size="small"
          />
        ) : (
          <Text
            onDoubleClick={() => setEditingCol(col.key)}
            style={{ cursor: 'pointer' }}
          >
            {col.title}
          </Text>
        ),
      dataIndex: col.key,
      key: col.key,
      render: renderInput(col.key),
    })),
  ];

  const crearTablaNxN = (tamaño) => {
    const nuevasColumnas = Array.from({ length: tamaño }, (_, i) => ({
      key: `horario_${i + 1}`,
      title: `Horario ${i + 1}`
    }));

    const nuevasFilas = Array.from({ length: tamaño }, (_, i) => {
      const fila = {
        key: `${i + 1}`,
        grupo: `Grupo ${i + 1}`
      };
      nuevasColumnas.forEach(col => {
        fila[col.key] = 0;
      });
      return fila;
    });

    setNombreTabla(`Tabla ${tamaño}x${tamaño}`);
    setColumns(nuevasColumnas);
    setDataSource(nuevasFilas);
    setTablaVisible(true);
  };

  const agregarFila = () => {
    const nuevoGrupo = prompt('Nombre del nuevo grupo');
    if (!nuevoGrupo) return;

    const nuevaFila = {
      key: Date.now().toString(),
      grupo: nuevoGrupo,
    };

    columns.forEach(col => {
      nuevaFila[col.key] = 0;
    });

    setDataSource([...dataSource, nuevaFila]);
  };

  const agregarColumna = () => {
    const nuevoHorario = prompt('Nombre del nuevo horario');
    if (!nuevoHorario) return;

    const nuevaKey = nuevoHorario.toLowerCase().replace(/\s/g, '_');

    setColumns([...columns, { key: nuevaKey, title: nuevoHorario }]);

    const nuevosDatos = dataSource.map(row => ({
      ...row,
      [nuevaKey]: 0,
    }));

    setDataSource(nuevosDatos);
  };

  const resolver = () => {
    if (onListo) {
      onListo(columns, dataSource);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>
        {nombreTabla ? `Paso 0 - ${nombreTabla}` : 'Paso 0 - Costos de Asignación'}
      </h2>

      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          style={{
            width: 220,
            height: 40,
            fontSize: '16px',
            fontWeight: 'bold'
          }}
          placeholder="Crear tabla"
          onChange={(value) => crearTablaNxN(value)}
          value={undefined}
        >
          <Option disabled value={undefined}>
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
              Crear tabla
            </span>
          </Option>
          {Array.from({ length: 10 }, (_, i) => (
            <Option key={i + 1} value={i + 1}>
              Tabla {i + 1}x{i + 1}
            </Option>
          ))}
        </Select>

        {tablaVisible && (
          <>
            <Button onClick={agregarFila} type="primary">Agregar Grupo</Button>
            <Button onClick={agregarColumna} type="dashed">Agregar Horario</Button>
          </>
        )}
      </Space>

      {tablaVisible && (
        <>
          <Table
            dataSource={dataSource}
            columns={tableColumns}
            pagination={false}
            bordered
          />
          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={resolver}>
              Resolver
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
