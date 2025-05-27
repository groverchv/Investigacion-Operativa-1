import React from 'react';
import { Table } from 'antd';

export default function MatrizInicial({ materias, modulos, horarios }) {
  // Recolectar todas las aulas disponibles del módulo FICCT
  const aulasDisponibles = modulos
    .flatMap(modulo => modulo.pisos)
    .flatMap(piso =>
      piso.aulas.map(aula => ({
        piso: piso.nombre,
        nombre: aula.nombre,
        capacidad: parseInt(aula.capacidad),
      }))
    );

  // Recolectar todos los horarios disponibles
  const bloques = horarios.map((_, index) => `${index + 1}`);

  // Generar las filas
  const rows = materias.flatMap((materia, idx) => {
    return materia.grupos.map((grupo, i) => {
      const estudiantes = parseInt(grupo.estudiantes);

      // Filtrar todas las aulas que pueden contener al grupo
      const aulasCompatibles = aulasDisponibles.filter(a => a.capacidad >= estudiantes);

      const pisos = [...new Set(aulasCompatibles.map(a => a.piso.replace('Piso ', '')))];
      const aulas = aulasCompatibles.map(a => a.nombre.replace('Aula ', ''));
      const capacidades = aulasCompatibles.map(a => a.capacidad);

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
      <h2>POSIBLES ASIGNACIONES</h2>
      <Table columns={columnas} dataSource={rows} pagination={false} bordered />
    </div>
  );
}
