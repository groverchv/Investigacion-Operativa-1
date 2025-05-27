import React, { useState } from 'react';
import CrearModulo from './CrearModulo';
import GrupoMateria from './GrupoMateria';
import Horarios from './horarios';
import MatrizInicial from './MatrizInicial';

export default function Modulo() {
  const [modulos, setModulos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [horarios, setHorarios] = useState([]);

  return (
    <div>
      <CrearModulo setModulos={setModulos} />
      <GrupoMateria setMaterias={setMaterias} />
      <Horarios setHorarios={setHorarios} />
      <MatrizInicial materias={materias} modulos={modulos} horarios={horarios} />
    </div>
  );
}
