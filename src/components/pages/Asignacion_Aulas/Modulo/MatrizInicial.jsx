import React from 'react';
import { Table } from 'antd';

export default function MatrizInicial({ materias, modulos, horarios }) {
  // Recolectar todas las aulas disponibles del módulo FICCT
  const aulasDisponibles = modulos
    .flatMap(modulo => modulo.pisos)
    .flatMap((piso, index) =>
      piso.aulas.map(aula => ({
        piso: piso.nombre,
        nombre: aula.nombre,
        capacidad: parseInt(aula.capacidad),
      }))
    );

  // Recolectar todos los horarios disponibles
  const bloques = horarios.map((h, index) => `${index + 1}`);

  // Asignación simulada por orden: no cruza conflictos
  const rows = materias.flatMap((materia, idx) => {
    return materia.grupos.map((grupo, i) => {
      const estudiantes = parseInt(grupo.estudiantes);
      const aulasAsignadas = aulasDisponibles
        .filter(a => a.capacidad >= estudiantes)
        .slice(0, Math.ceil(estudiantes / 120)); // ejemplo: 1 aula grande

      const pisos = [...new Set(aulasAsignadas.map(a => a.piso.replace('Piso ', '')))];
      const aulas = aulasAsignadas.map(a => a.nombre.replace('Aula ', ''));
      const capacidades = aulasAsignadas.map(a => a.capacidad);

      return {
        key: `${idx}-${i}`,
        materia: materia.nombre,
        grupo: grupo.nombre,
        estudiantes: grupo.estudiantes,
        piso: pisos.join(','),
        aula: aulas.join(','),
        capacidad: capacidades.join(','),
        horario: bloques.join(','),
      };
    });
  });

  const columnas = [
    { title: 'MATERIA', dataIndex: 'materia', key: 'materia' },
    { title: 'Grupo', dataIndex: 'grupo', key: 'grupo' },
    { title: 'Estudiantes', dataIndex: 'estudiantes', key: 'estudiantes' },
    { title: 'PISO', dataIndex: 'piso', key: 'piso' },
    { title: 'Aula', dataIndex: 'aula', key: 'aula' },
    { title: 'Capacidad', dataIndex: 'capacidad', key: 'capacidad' },
    { title: 'Horario', dataIndex: 'horario', key: 'horario' },
  ];

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Resumen de Asignación</h2>
      <Table columns={columnas} dataSource={rows} pagination={false} bordered />
    </div>
  );
}
