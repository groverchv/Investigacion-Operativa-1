'use client';
import React, { useState } from 'react';
import { Button, Modal, Typography, Space, TimePicker, InputNumber, message } from 'antd';
import dayjs from 'dayjs';

export default function CrearHorario({ horarios, setHorarios }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [inicio, setInicio] = useState(null);
  const [fin, setFin] = useState(null);
  const [costo, setCosto] = useState(0);

  const abrirModalNuevo = () => {
    setInicio(dayjs('00:00', 'HH:mm'));
    setFin(dayjs('00:00', 'HH:mm'));
    setCosto(0);
    setEditandoIndex(null);
    setModalVisible(true);
  };

  const abrirModalEditar = (index) => {
    const bloque = horarios[index];
    setInicio(dayjs(bloque.inicio, 'HH:mm'));
    setFin(dayjs(bloque.fin, 'HH:mm'));
    setCosto(bloque.costo || 0);
    setEditandoIndex(index);
    setModalVisible(true);
  };

  const guardarBloque = () => {
    if (!inicio || !fin) return message.error('Completa ambos campos de hora');

    const nuevoBloque = {
      inicio: inicio.format('HH:mm'),
      fin: fin.format('HH:mm'),
      costo: costo,
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
    <div style={{ padding: 16 }}>
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

      <Typography.Title level={4} className="crear-horario-title">
        Gestionar Horarios
      </Typography.Title>

      <Button type="primary" onClick={abrirModalNuevo}>
        Crear Bloque Horario
      </Button>

      <ul className="crear-horario-list" style={{ marginTop: 24, paddingLeft: 16 }}>
        {horarios.map((bloque, index) => (
          <li key={index} style={{ marginBottom: 12 }}>
            <Space wrap>
              <span>
                {index + 1}) {bloque.inicio} — {bloque.fin} | Costo: ${bloque.costo}
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

          <div>
            <label>Costo de atención:</label>
            <InputNumber
              min={0}
              value={costo}
              onChange={(value) => setCosto(value)}
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
