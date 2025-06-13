'use client';
import React, { useState } from 'react';
import CrearHorario from './CrearHorario';


export default function Horario() {
  const [horarios, setHorarios] = useState([
    { inicio: "07:00", fin: "09:15" },
    { inicio: "09:15", fin: "11:30" },
    { inicio: "11:30", fin: "13:45" },
    { inicio: "14:00", fin: "16:15" },
    { inicio: "16:15", fin: "18:30" },
    { inicio: "18:30", fin: "20:45" },
  ]);

  return (
    <CrearHorario horarios={horarios} setHorarios={setHorarios} />
  );
}
