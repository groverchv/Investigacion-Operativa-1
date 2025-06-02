import React, { useEffect, useState } from 'react';
import { Table, Modal, Button } from 'antd';
import { ExpandOutlined } from '@ant-design/icons';

export default function MatrizReducida({ materias, modulos, onDataReady }) {
  const [modalVisible, setModalVisible] = useState(false);

  // Ordenar aulas de Piso 1 a Piso 5
  const aulas = modulos
    .flatMap(mod => 
      mod.pisos
        .sort((a, b) => parseInt(a.nombre.replace('Piso ', '')) - parseInt(b.nombre.replace('Piso ', '')))
        .flatMap(piso =>
          piso.aulas.map(a => ({
            nombre: a.nombre.replace('Aula ', ''),
            piso: piso.nombre.replace('Piso ', ''),
            capacidad: parseInt(a.capacidad),
          }))
        )
    );

  // Columnas dinámicas: una por aula
  const columnas = [
    {
      title: 'MATERIA / Grupo',
      dataIndex: 'materiaGrupo',
      key: 'materiaGrupo',
      fixed: 'left',
      render: (_, row) => (
        <div>
          <strong>{row.materia}</strong><br />
          {row.grupo} = {row.estudiantes}
        </div>
      ),
    },
    ...aulas.map((aula, index) => ({
      title: `A${index + 1} -> Piso ${aula.piso}`,
      dataIndex: `aula${index + 1}`,
      key: `aula${index + 1}`,
      align: 'center',
      render: (valor) => (
        <span style={{ color: valor === 1000 ? 'red' : 'black' }}>{valor}</span>
      ),
    })),
  ];

  // Filas por grupo
  const rows = materias.flatMap((materia) =>
    materia.grupos.map((grupo) => {
      const estudiantes = parseInt(grupo.estudiantes);

      const fila = {
        key: `${materia.nombre}-${grupo.nombre}`,
        materia: materia.nombre,
        grupo: grupo.nombre,
        estudiantes: estudiantes,
        materiaGrupo: `${materia.nombre} - ${grupo.nombre}`,
      };

      aulas.forEach((aula, idx) => {
        fila[`aula${idx + 1}`] = aula.capacidad >= estudiantes ? aula.capacidad : 1000;
      });

      return fila;
    })
  );

  // Matriz pura (opcionalmente para paso siguiente)
  const matrizNumerica = rows.map(row =>
    aulas.map((_, idx) => row[`aula${idx + 1}`])
  );

  useEffect(() => {
    if (onDataReady) {
      onDataReady(matrizNumerica);
    }
  }, [onDataReady, matrizNumerica]);

  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>MATRIZ REDUCIDA</h2>
        <Button icon={<ExpandOutlined />} onClick={() => setModalVisible(true)}>
          Ver completo
        </Button>
      </div>

      <Table
        columns={columnas}
        dataSource={rows}
        bordered
        pagination={false}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        title="Matriz Reducida - Vista ampliada"
      >
        <Table
          columns={columnas}
          dataSource={rows}
          bordered
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </Modal>
    </div>
  );
}
