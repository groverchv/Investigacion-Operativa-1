'use client';
import React, { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';

const { Title } = Typography;

export default function Asignar({ matrizPaso1 = [], matrizPaso7 = [], nombresFilas = [], nombresColumnas = [] }) {
  const [asignaciones, setAsignaciones] = useState([]);
  const [asignacionesLocales, setAsignacionesLocales] = useState([]);

  useEffect(() => {
    if (!matrizPaso1.length || !matrizPaso7.length) return;

    const size = matrizPaso1.length;
    const asignacionesLocales = Array(size).fill(-1);
    const usadas = new Set();

    for (let i = 0; i < size; i++) {
      let asignado = false;
      for (let j = 0; j < matrizPaso7[i].length; j++) {
        if (matrizPaso7[i][j] === 0 && !usadas.has(j)) {
          asignacionesLocales[i] = j;
          usadas.add(j);
          asignado = true;
          break;
        }
      }
      if (!asignado) {
        for (let j = 0; j < matrizPaso7[i].length; j++) {
          if (!usadas.has(j)) {
            asignacionesLocales[i] = j;
            usadas.add(j);
            break;
          }
        }
      }
    }

    const asignacionesValidas = asignacionesLocales.map((colIndex, i) => {
      const fila = nombresFilas[i];
      const columna = nombresColumnas[colIndex];
      if (!fila?.materia || !fila?.grupo || !columna) return null;
      const [aula, piso] = columna.split('=').map(s => s.trim());
      const capacidad = matrizPaso1?.[i]?.[colIndex] ?? '?';
      return `Al grupo ${fila.grupo} de la materia "${fila.materia}" con ${fila.estudiantes} estudiantes se le asignó el aula ${aula} del ${piso} que tiene una capacidad de ${capacidad} personas.`;
    }).filter(Boolean);

    setAsignaciones(asignacionesValidas);
    setAsignacionesLocales(asignacionesLocales);
  }, [matrizPaso1, matrizPaso7, nombresFilas, nombresColumnas]);

  const renderTabla = (matriz, tipo) => {
    const columnas = [
      {
        title: 'Materia / Grupo',
        dataIndex: 'materiaGrupo',
        key: 'materiaGrupo',
        fixed: 'left',
      },
      ...nombresColumnas.map((nombre, j) => {
        const [aula, piso] = (nombre || '').split('=').map(s => s.trim());
        return {
          title: (
            <div style={{ textAlign: 'center' }}>
              <strong>{aula || `Aula ${j + 1}`}</strong><br />
              <span>{piso ? `= ${piso}` : ''}</span>
            </div>
          ),
          dataIndex: `col_${j}`,
          key: `col_${j}`,
          align: 'center',
        };
      })
    ];

    const filas = matriz.map((fila, i) => {
      const isReal = nombresFilas[i]?.materia && nombresFilas[i]?.grupo;
      const filaObj = {
        key: `fila_${i}`,
        materiaGrupo: isReal ? (
          <div>
            <strong>{nombresFilas[i].materia}</strong><br />
            Grupo {nombresFilas[i].grupo} = {nombresFilas[i].estudiantes}
          </div>
        ) : (
          <div><strong>—</strong><br />Grupo ficticio</div>
        )
      };
      fila.forEach((valor, j) => {
        const esAsignado = tipo === 'paso1' && asignacionesLocales[i] === j;
        const esCero = tipo === 'paso1' && matrizPaso7[i]?.[j] === 0;
        const fondo = esAsignado ? '#ffa94d' : (esCero ? 'yellow' : 'transparent');
        filaObj[`col_${j}`] = (
          <div style={{ backgroundColor: fondo, padding: '4px' }}>{valor}</div>
        );
      });
      return filaObj;
    });

    return <Table columns={columnas} dataSource={filas} pagination={false} bordered scroll={{ x: 'max-content' }} />;
  };

  return (
    <div style={{ padding: 24 }}>

      {/*<Title level={4}>📘 Matriz del Paso 7 (con ceros)</Title>
      {renderTabla(matrizPaso7, 'paso7')}*/}

      <Title level={4} style={{ marginTop: 48 }}>📙 Matriz del Paso 1 (asignaciones y ceros)</Title>
      {renderTabla(matrizPaso1, 'paso1')}

      {asignaciones.map((mensaje, index) => (
        <p key={index} style={{ marginTop: 12, fontWeight: 'bold' }}>
          ✅ {mensaje}
        </p>
      ))}
    </div>
  );
}
