'use client';
import React, { useState } from 'react';
import { Button, Modal, Typography, Space, TimePicker, message } from 'antd';
import dayjs from 'dayjs';

export default function CrearHorario({ horarios, setHorarios }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [inicio, setInicio] = useState(null);
  const [fin, setFin] = useState(null);

  const abrirModalNuevo = () => {
    setInicio(dayjs('00:00', 'HH:mm'));
    setFin(dayjs('00:00', 'HH:mm'));
    setEditandoIndex(null);
    setModalVisible(true);
  };

  const abrirModalEditar = (index) => {
    const bloque = horarios[index];
    setInicio(dayjs(bloque.inicio, 'HH:mm'));
    setFin(dayjs(bloque.fin, 'HH:mm'));
    setEditandoIndex(index);
    setModalVisible(true);
  };

  const guardarBloque = () => {
    if (!inicio || !fin) return message.error('Completa ambos campos de hora');

    const nuevoBloque = {
      inicio: inicio.format('HH:mm'),
      fin: fin.format('HH:mm'),
    };

    const nuevaLista = [...horarios];
    if (editandoIndex !== null) {
      nuevaLista[editandoIndex] = nuevoBloque;
    } else {
      nuevaLista.push(nuevoBloque);
    }

    setHorarios(nuevaLista);
    setModalVisible(false);
    message.success('Bloque guardado');
  };

  const eliminarBloque = (index) => {
    const nuevaLista = [...horarios];
    nuevaLista.splice(index, 1);
    setHorarios(nuevaLista);
    message.success('Bloque eliminado');
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={4}>Gestionar Horarios</Typography.Title>

      <Button type="primary" onClick={abrirModalNuevo}>
        Crear Bloque Horario
      </Button>

      <ul style={{ marginTop: 24, paddingLeft: 20 }}>
        {horarios.map((bloque, index) => (
          <li key={index} style={{ marginBottom: 12 }}>
            <Space>
              <span>
                {index + 1}) {bloque.inicio} — {bloque.fin}{' '}
                ({parseInt(bloque.inicio.split(':')[0], 10) < 12 ? 'AM' : 'PM'})
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

      <Modal
        title={editandoIndex !== null ? 'Editar Bloque' : 'Crear Bloque'}
        open={modalVisible}
        onOk={guardarBloque}
        onCancel={() => setModalVisible(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <label>Hora de inicio:</label>
            <TimePicker
              format="HH:mm"
              value={inicio}
              onChange={(value) => setInicio(value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label>Hora de fin:</label>
            <TimePicker
              format="HH:mm"
              value={fin}
              onChange={(value) => setFin(value)}
              style={{ width: '100%' }}
            />
          </div>
        </Space>
      </Modal>
    </div>
  );
}
