/**
 * ============================================
 * COMPONENTE: CrearHorario
 * ============================================
 * Permite crear, editar y eliminar bloques horarios.
 * Cada bloque tiene nombre, hora inicio/fin y costo.
 * 
 * @param {Array} horarios - Lista de horarios existentes
 * @param {Function} setHorarios - Funcion para actualizar horarios
 */

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
  Card,
  List,
} from 'antd';
import {
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

// Extiende dayjs para comparar horas
dayjs.extend(isSameOrAfter);

export default function CrearHorario({ horarios, setHorarios }) {
  // Estados para el formulario de creacion/edicion de horarios
  const [modalVisible, setModalVisible] = useState(false);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [inicio, setInicio] = useState(dayjs('07:00', 'HH:mm'));
  const [fin, setFin] = useState(dayjs('08:00', 'HH:mm'));
  const [costo, setCosto] = useState(0);
  const [nombreHorario, setNombreHorario] = useState('');

  // Funcion que abre el modal para crear un nuevo horario
  const abrirModalNuevo = () => {
    setInicio(dayjs('07:00', 'HH:mm'));
    setFin(dayjs('08:00', 'HH:mm'));
    setCosto(0);
    setNombreHorario(`Horario ${horarios.length + 1}`);
    setEditandoIndex(null);
    setModalVisible(true);
  };

  // Funcion que abre el modal para editar un horario existente
  const abrirModalEditar = (index) => {
    const bloque = horarios[index];
    setInicio(dayjs(bloque.inicio || '07:00', 'HH:mm'));
    setFin(dayjs(bloque.fin || '08:00', 'HH:mm'));
    setCosto(Number(bloque.costo) || 0);
    setNombreHorario(bloque.nombre || `Horario ${index + 1}`);
    setEditandoIndex(index);
    setModalVisible(true);
  };

  // Funcion que guarda un nuevo horario o actualiza uno existente
  const guardarBloque = () => {
    try {
      const inicioHora = dayjs(inicio, 'HH:mm');
      const finHora = dayjs(fin, 'HH:mm');

      // Validaciones basicas
      if (!inicioHora.isValid() || !finHora.isValid()) {
        return message.error('Las horas no son validas');
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
      message.success('Bloque guardado correctamente');
    } catch (error) {
      console.error('Error al guardar horario:', error);
      message.error('Ocurrio un error al guardar el horario');
    }
  };

  // Elimina un bloque horario de la lista
  const eliminarBloque = (index) => {
    const nuevaLista = [...horarios];
    nuevaLista.splice(index, 1);
    setHorarios(nuevaLista);
    message.success('Bloque eliminado correctamente');
  };

  return (
    <Card
      style={{
        marginTop: 24,
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
      }}
    >
      {/* Estilos responsive */}
      <style>{`
        @media (max-width: 600px) {
          .crear-horario-title {
            font-size: 16px !important;
          }
          .horario-item {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 8px;
          }
        }
      `}</style>

      {/* Titulo de seccion */}
      <Typography.Title level={4} className="crear-horario-title" style={{ marginBottom: 16 }}>
        <ClockCircleOutlined style={{ marginRight: 8, color: '#2563eb' }} />
        Gestion de Horarios
      </Typography.Title>

      {/* Boton para abrir modal de creacion */}
      <Button type="primary" icon={<PlusOutlined />} onClick={abrirModalNuevo}>
        Crear Bloque Horario
      </Button>

      {/* Lista de horarios actuales */}
      <List
        style={{ marginTop: 20 }}
        dataSource={horarios}
        renderItem={(bloque, index) => (
          <List.Item
            className="horario-item"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              marginBottom: '8px',
              border: '1px solid #e2e8f0',
            }}
            actions={[
              <Button
                key="edit"
                size="small"
                icon={<EditOutlined />}
                onClick={() => abrirModalEditar(index)}
              >
                Editar
              </Button>,
              <Button
                key="delete"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => eliminarBloque(index)}
              >
                Eliminar
              </Button>,
            ]}
          >
            <div>
              <strong style={{ color: '#1e293b' }}>{bloque.nombre}</strong>
              <span style={{ color: '#64748b', marginLeft: 12 }}>
                {bloque.inicio} - {bloque.fin}
              </span>
              <span style={{
                marginLeft: 12,
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '12px',
              }}>
                Costo: ${bloque.costo}
              </span>
            </div>
          </List.Item>
        )}
      />

      {/* Modal para crear o editar bloque */}
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
    </Card>
  );
}
