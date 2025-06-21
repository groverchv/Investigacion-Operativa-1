import React from 'react';
import Modulo from './Modulo/Modulo';
import Horario from './Horario/Horario';
import { DatosProvider } from './Horario/DatosContext'; // Ajusta el path según tu estructura

export default function Asignacion() {
  return (
    <DatosProvider>
      <Modulo />
      <Horario />
    </DatosProvider>
  );
}
