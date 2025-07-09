'use client';
import React, { useState } from 'react';
import {
  Button,
  Modal,
  Typography,
  Space,
  TimePicker,
  InputNumber,
  Input,
  message,
} from 'antd';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter); //  ¡Extiende el plugin necesario para comparar horas!

export default function CrearHorario({ horarios, setHorarios }) {
  //  Estados para el formulario de creación/edición de horarios
  const [modalVisible, setModalVisible] = useState(false); // Muestra/oculta el modal
  const [editandoIndex, setEditandoIndex] = useState(null); // Índice del horario que se está editando
  const [inicio, setInicio] = useState(dayjs('07:00', 'HH:mm')); // Hora de inicio
  const [fin, setFin] = useState(dayjs('08:00', 'HH:mm')); // Hora de fin
  const [costo, setCosto] = useState(0); // Costo del bloque
  const [nombreHorario, setNombreHorario] = useState(''); // Nombre personalizado del horario

  //  Función que abre el modal para crear un nuevo horario
  const abrirModalNuevo = () => {
    setInicio(dayjs('07:00', 'HH:mm'));
    setFin(dayjs('08:00', 'HH:mm'));
    setCosto(0);
    setNombreHorario(`Horario ${horarios.length + 1}`);
    setEditandoIndex(null);
    setModalVisible(true);
  };

  //  Función que abre el modal para editar un horario existente
  const abrirModalEditar = (index) => {
    const bloque = horarios[index];
    setInicio(dayjs(bloque.inicio || '07:00', 'HH:mm'));
    setFin(dayjs(bloque.fin || '08:00', 'HH:mm'));
    setCosto(Number(bloque.costo) || 0);
    setNombreHorario(bloque.nombre || `Horario ${index + 1}`);
    setEditandoIndex(index);
    setModalVisible(true);
  };

  //  Función que guarda un nuevo horario o actualiza uno existente
  const guardarBloque = () => {
    try {
      const inicioHora = dayjs(inicio, 'HH:mm');
      const finHora = dayjs(fin, 'HH:mm');

      // Validaciones básicas
      if (!inicioHora.isValid() || !finHora.isValid()) {
        return message.error('Las horas no son válidas');
      }

      if (inicioHora.isSameOrAfter(finHora)) {
        return message.error('La hora de inicio debe ser menor que la de fin');
      }

      const nombreFinal = nombreHorario?.trim() || `Horario ${horarios.length + 1}`;

      // Crear objeto del nuevo bloque horario
      const nuevoBloque = {
        nombre: nombreFinal,
        inicio: inicioHora.format('HH:mm'),
        fin: finHora.format('HH:mm'),
        costo: Math.max(0, costo),
      };

      const nuevaLista = [...horarios];
      if (editandoIndex !== null) {
        // Actualizar bloque existente
        nuevaLista[editandoIndex] = nuevoBloque;
      } else {
        // Agregar nuevo bloque
        nuevaLista.push(nuevoBloque);
      }

      setHorarios(nuevaLista);
      setModalVisible(false);
      message.success('Bloque guardado');
    } catch (error) {
      console.error('❌ Error inesperado al guardar:', error);
      message.error('Ocurrió un error al guardar el horario');
    }
  };

  //  Elimina un bloque horario de la lista
  const eliminarBloque = (index) => {
    const nuevaLista = [...horarios];
    nuevaLista.splice(index, 1); // Elimina el horario en la posición indicada
    setHorarios(nuevaLista);
    message.success('Bloque eliminado');
  };

  return (
    <div style={{ padding: 16 }}>
      {/* 🔧 Estilos para pantallas pequeñas */}
      <style>{`
        @media (max-width: 600px) {
          .crear-horario-title {
            font-size: 16px !important;
          }
          .crear-horario-list span {
            font-size: 12px !important;
          }
          .crear-horario-list button {
            font-size: 10px !important;
            padding: 0 4px !important;
          }
        }
      `}</style>

      {/* Título de sección */}
      <Typography.Title level={4} className="crear-horario-title">
        Gestionar Horarios
      </Typography.Title>

      {/* ➕ Botón para abrir modal de creación */}
      <Button type="primary" onClick={abrirModalNuevo}>
        Crear Bloque Horario
      </Button>

      {/*  Lista de horarios actuales con botones para editar/eliminar */}
      <ul className="crear-horario-list" style={{ marginTop: 24, paddingLeft: 16 }}>
        {horarios.map((bloque, index) => (
          <li key={index} style={{ marginBottom: 12 }}>
            <Space wrap>
              <span>
                <strong>{bloque.nombre}</strong>: {bloque.inicio} — {bloque.fin} | Costo: ${bloque.costo}
              </span>
              <Button size="small" onClick={() => abrirModalEditar(index)}>
                Editar
              </Button>
              <Button size="small" danger onClick={() => eliminarBloque(index)}>
                Eliminar
              </Button>
            </Space>
          </li>
        ))}
      </ul>

      {/*  Modal para crear o editar bloque */}
      <Modal
        title={editandoIndex !== null ? 'Editar Bloque' : 'Crear Bloque'}
        open={modalVisible}
        onOk={guardarBloque}
        onCancel={() => setModalVisible(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* Campo: Nombre */}
          <div>
            <label>Nombre del horario:</label>
            <Input
              value={nombreHorario}
              onChange={(e) => setNombreHorario(e.target.value)}
              placeholder="Nombre del horario"
            />
          </div>

          {/* Campo: Hora de inicio */}
          <div>
            <label>Hora de inicio:</label>
            <TimePicker
              format="HH:mm"
              value={dayjs.isDayjs(inicio) ? inicio : dayjs('07:00', 'HH:mm')}
              onChange={(value) =>
                setInicio(dayjs.isDayjs(value) ? value : dayjs('07:00', 'HH:mm'))
              }
              style={{ width: '100%' }}
              allowClear={false}
            />
          </div>

          {/* Campo: Hora de fin */}
          <div>
            <label>Hora de fin:</label>
            <TimePicker
              format="HH:mm"
              value={dayjs.isDayjs(fin) ? fin : dayjs('08:00', 'HH:mm')}
              onChange={(value) =>
                setFin(dayjs.isDayjs(value) ? value : dayjs('08:00', 'HH:mm'))
              }
              style={{ width: '100%' }}
              allowClear={false}
            />
          </div>

          {/* Campo: Costo */}
          <div>
            <label>Costo de atención:</label>
            <InputNumber
              min={0}
              value={costo}
              onChange={(value) => setCosto(Number(value) || 0)}
              formatter={(value) => `$ ${value}`}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              style={{ width: '100%' }}
            />
          </div>
        </Space>
      </Modal>
    </div>
  );
}
