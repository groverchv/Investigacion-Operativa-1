import React, { useEffect, useState } from 'react';
import { Table, Modal, Button } from 'antd';
import { ExpandOutlined } from '@ant-design/icons';

export default function MatrizGeneral({ materias, modulos, horarios, onDataReady }) {
  const [modalVisible, setModalVisible] = useState(false);

  const aulasDisponibles = modulos
    .flatMap(modulo =>
      modulo.pisos
        .sort((a, b) => parseInt(a.nombre.replace('Piso ', '')) - parseInt(b.nombre.replace('Piso ', '')))
        .flatMap(piso =>
          piso.aulas.map(aula => ({
            piso: piso.nombre,
            nombre: aula.nombre,
            capacidad: parseInt(aula.capacidad),
          }))
        )
    );

  const bloques = horarios.map((_, index) => `${index + 1}`);

  const rows = materias.flatMap((materia, idx) =>
    materia.grupos.map((grupo, i) => {
      const estudiantes = parseInt(grupo.estudiantes);
      const aulasCompatibles = aulasDisponibles.filter(a => a.capacidad >= estudiantes);
      const pisos = [...new Set(aulasCompatibles.map(a => a.piso.replace('Piso ', '')))];
      const aulas = aulasCompatibles.map(a => a.nombre.replace('Aula ', ''));
      const capacidades = aulasCompatibles.map(a => a.capacidad);

      return {
        key: `${idx}-${i}`,
        materia: materia.nombre,
        grupo: grupo.nombre,
        estudiantes: grupo.estudiantes,
        piso: pisos.join(', '),
        aula: aulas.join(', '),
        capacidad: capacidades.join(', '),
        horario: bloques.join(', '),
      };
    })
  );

  useEffect(() => {
    if (onDataReady) {
      onDataReady(rows);
    }
  }, [rows, onDataReady]);

  const columnas = [
    { title: 'MATERIA', dataIndex: 'materia', key: 'materia' },
    { title: 'Grupo', dataIndex: 'grupo', key: 'grupo' },
    { title: 'Estudiantes', dataIndex: 'estudiantes', key: 'estudiantes' },
    { title: 'Piso', dataIndex: 'piso', key: 'piso' },
    { title: 'Aula', dataIndex: 'aula', key: 'aula' },
    { title: 'Capacidad', dataIndex: 'capacidad', key: 'capacidad' },
    { title: 'Horario', dataIndex: 'horario', key: 'horario' },
  ];

  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>POSIBLES ASIGNACIONES</h2>
        <Button icon={<ExpandOutlined />} onClick={() => setModalVisible(true)}>
          Ver completo
        </Button>
      </div>

      <Table
        columns={columnas}
        dataSource={rows}
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
      />

      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        title="Matriz completa - Vista ampliada"
      >
        <Table
          columns={columnas}
          dataSource={rows}
          pagination={false}
          bordered
          scroll={{ x: 'max-content' }}
        />
      </Modal>
    </div>
  );
}
