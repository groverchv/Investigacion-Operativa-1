'use client';
import React, { useEffect, useMemo } from 'react';
import { Table, Typography } from 'antd';

const { Title } = Typography;

export default function Paso1({ columnas = [], filas = [], onResolved }) {
  const { columnasFinales, datosFinales } = useMemo(() => {
    const numGrupos = filas.length;
    const numAulas = columnas.length;

    let columnasActuales = [...columnas];
    let filasActuales = [...filas];

    // Si hay más grupos que aulas, agregar columnas ficticias
    if (numGrupos > numAulas) {
      const cantidad = numGrupos - numAulas;
      for (let i = 0; i < cantidad; i++) {
        const key = `ficticio_col_${i + 1}`;
        columnasActuales.push({ key, title: `Horario Ficticio ${i + 1}`, dataIndex: key });
        filasActuales = filasActuales.map(f => ({ ...f, [key]: 0 }));
      }
    }

    // Si hay más aulas que grupos, agregar fila ficticia
    if (numAulas > numGrupos) {
      const nuevaFila = { key: 'ficticio_row', grupo: 'Grupo Ficticio' };
      columnasActuales.forEach(col => {
        nuevaFila[col.key] = 0;
      });
      filasActuales.push(nuevaFila);
    }

    const columnasConGrupo = [
      { title: '', dataIndex: 'grupo', key: 'grupo' },
      ...columnasActuales
    ];

    return {
      columnasFinales: columnasConGrupo,
      datosFinales: filasActuales
    };
  }, [columnas, filas]);

  useEffect(() => {
    if (onResolved) {
      const columnasSinGrupo = columnasFinales.slice(1); // sin la columna de grupo
      onResolved(columnasSinGrupo, datosFinales);
    }
  }, [columnasFinales, datosFinales, onResolved]);

  return (
    <div style={{ marginTop: 40 }}>
      <Title level={4}>Paso 1: Vista previa de la tabla simétrica</Title>
      <Table
        columns={columnasFinales}
        dataSource={datosFinales}
        pagination={false}
        bordered
        rowKey="key"
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}
