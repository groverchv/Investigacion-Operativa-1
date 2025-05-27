'use client';
import React, { useEffect, useMemo } from 'react';
import { Table, Typography } from 'antd';

const { Title } = Typography;

export default function Paso2({ columns = [], dataSource = [], onResolved }) {
  const { columnasFinales, datosFinales } = useMemo(() => {
    const numGrupos = dataSource.length;
    const numHorarios = columns.length;
    let columnasCorregidas = [...columns];
    let datosCorregidos = [...dataSource];

    if (numGrupos > numHorarios) {
      const cantidad = numGrupos - numHorarios;
      for (let i = 0; i < cantidad; i++) {
        const key = `ficticio_col_${i + 1}`;
        columnasCorregidas.push({ key, title: `Horario Ficticio ${i + 1}` });
        datosCorregidos = datosCorregidos.map(fila => ({
          ...fila,
          [key]: 0
        }));
      }
    }

    if (numHorarios > numGrupos) {
      const nuevaFila = {
        key: 'ficticio_row',
        grupo: 'Grupo Ficticio'
      };
      columnasCorregidas.forEach(col => {
        nuevaFila[col.key] = 0;
      });
      datosCorregidos.push(nuevaFila);
    }

    return {
      columnasFinales: [
        { title: '', dataIndex: 'grupo', key: 'grupo' },
        ...columnasCorregidas.map(col => ({
          title: col.title,
          dataIndex: col.key,
          key: col.key,
        }))
      ],
      datosFinales: datosCorregidos
    };
  }, [columns, dataSource]);

  useEffect(() => {
    if (onResolved) {
      // Solo pasamos las columnas sin el encabezado vacío
      const colsSinGrupo = columnasFinales.slice(1);
      onResolved(colsSinGrupo, datosFinales);
    }
  }, [columnasFinales, datosFinales, onResolved]);

  return (
    <div>
      <Title level={4}>Paso 2: Vista previa de la tabla simétrica</Title>
      <Table
        columns={columnasFinales}
        dataSource={datosFinales}
        pagination={false}
        bordered
        rowKey="key"
      />
    </div>
  );
}
