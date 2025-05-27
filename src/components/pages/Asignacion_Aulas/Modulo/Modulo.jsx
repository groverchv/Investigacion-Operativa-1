import React, { useState } from 'react';
import CrearModulo from './CrearModulo';
import GrupoMateria from './GrupoMateria';
import Horarios from './horarios';
import MatrizInicial from './MatrizInicial';

export default function Modulo() {
  const [horarios, setHorarios] = useState([
    { inicio: '07:00', fin: '09:15' },
    { inicio: '09:15', fin: '11:30' },
    { inicio: '11:30', fin: '13:45' },
    { inicio: '14:00', fin: '16:15' },
    { inicio: '16:15', fin: '18:30' },
    { inicio: '18:30', fin: '20:45' },
  ]);

  const [modulos, setModulos] = useState([
    {
      nombre: 'FICCT',
      pisos: [
        {
          nombre: 'Piso 5',
          aulas: [
            { nombre: 'Aula 15', capacidad: '120' },
            { nombre: 'Aula 16', capacidad: '120' },
          ]
        },
        {
          nombre: 'Piso 4',
          aulas: [
            { nombre: 'Aula 12', capacidad: '60' },
            { nombre: 'Aula 13', capacidad: '60' },
            { nombre: 'Aula 14', capacidad: '40' },
          ]
        },
        {
          nombre: 'Piso 3',
          aulas: [
            { nombre: 'Aula 9', capacidad: '60' },
            { nombre: 'Aula 10', capacidad: '60' },
            { nombre: 'Aula 11', capacidad: '40' },
          ]
        },
        {
          nombre: 'Piso 2',
          aulas: [
            { nombre: 'Aula 5', capacidad: '45' },
            { nombre: 'Aula 6', capacidad: '45' },
            { nombre: 'Aula 7', capacidad: '60' },
            { nombre: 'Aula 8', capacidad: '30' },
          ]
        },
        {
          nombre: 'Piso 1',
          aulas: [
            { nombre: 'Aula 1', capacidad: '45' },
            { nombre: 'Aula 2', capacidad: '45' },
            { nombre: 'Aula 3', capacidad: '60' },
            { nombre: 'Aula 4', capacidad: '30' },
          ]
        }
      ]
    }
  ]);

  const [materias, setMaterias] = useState([
    {
      nombre: 'Cálculo I',
      grupos: [{ nombre: 'Grupo 1', estudiantes: '35' }],
    },
    {
      nombre: 'Física I',
      grupos: [{ nombre: 'Grupo 2', estudiantes: '50' }],
    },
    {
      nombre: 'Introducción a la Ingeniería',
      grupos: [{ nombre: 'Grupo 3', estudiantes: '120' }],
    },
    {
      nombre: 'Redes I',
      grupos: [{ nombre: 'Grupo 4', estudiantes: '40' }],
    },
    {
      nombre: 'Álgebra Lineal',
      grupos: [{ nombre: 'Grupo 5', estudiantes: '60' }],
    },
  ]);

  return (
    <div>
      <CrearModulo modulos={modulos} setModulos={setModulos} />
      <GrupoMateria materias={materias} setMaterias={setMaterias} />
      <Horarios horarios={horarios} setHorarios={setHorarios} />
      <MatrizInicial materias={materias} modulos={modulos} horarios={horarios} />
    </div>
  );
}
