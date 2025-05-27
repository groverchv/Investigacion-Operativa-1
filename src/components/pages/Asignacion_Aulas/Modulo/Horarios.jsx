import React, { useState } from 'react';
import { Button, Input, Modal, Typography, Space } from 'antd';

export default function Horarios({ horarios, setHorarios }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');

  const getPeriodo = (hora) => {
    const [h] = hora.split(':');
    const horaNum = parseInt(h, 10);
    if (isNaN(horaNum)) return '';
    return horaNum < 12 ? 'AM' : 'PM';
  };

  const abrirModalNuevo = () => {
    setInicio('00:00');
    setFin('00:00');
    setEditandoIndex(null);
    setModalVisible(true);
  };

  const abrirModalEditar = (index) => {
    const bloque = horarios[index];
    setInicio(bloque.inicio);
    setFin(bloque.fin);
    setEditandoIndex(index);
    setModalVisible(true);
  };

  const guardarBloque = () => {
    const nuevoBloque = { inicio, fin };
    const nuevaLista = [...horarios];
    if (editandoIndex !== null) {
      nuevaLista[editandoIndex] = nuevoBloque;
    } else {
      nuevaLista.push(nuevoBloque);
    }
    setHorarios(nuevaLista);
    setModalVisible(false);
  };

  const eliminarBloque = (index) => {
    const nuevaLista = [...horarios];
    nuevaLista.splice(index, 1);
    setHorarios(nuevaLista);
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={4}>Horarios Disponibles</Typography.Title>

      <Button type="primary" onClick={abrirModalNuevo}>
        Crear Bloque Horario
      </Button>

      <ul style={{ marginTop: 24, paddingLeft: 20 }}>
        {horarios.map((bloque, index) => (
          <li key={index} style={{ marginBottom: 12 }}>
            <Space>
              <span>
                {index + 1}) {bloque.inicio} — {bloque.fin} ({getPeriodo(bloque.inicio)})
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
            <Input
              placeholder="Hora de inicio"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: 12, color: '#888' }}>Período: {getPeriodo(inicio)}</div>
          </div>

          <div>
            <Input
              placeholder="Hora de fin"
              value={fin}
              onChange={(e) => setFin(e.target.value)}
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: 12, color: '#888' }}>Período: {getPeriodo(fin)}</div>
          </div>
        </Space>
      </Modal>
    </div>
  );
}
