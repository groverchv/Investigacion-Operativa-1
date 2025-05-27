import React, { useState } from 'react';
import { Button, Input, Modal, Typography, Space } from 'antd';

export default function CrearModulo() {
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
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombreModulo, setNombreModulo] = useState('');

  const [editandoModuloIndex, setEditandoModuloIndex] = useState(null);
  const [modalEditarModulo, setModalEditarModulo] = useState(false);

  const [aulaSeleccionada, setAulaSeleccionada] = useState(null);
  const [modalAulaVisible, setModalAulaVisible] = useState(false);
  const [nuevoNombreAula, setNuevoNombreAula] = useState('');
  const [capacidadAula, setCapacidadAula] = useState('');

  
    const crearModulo = () => {
    if (nombreModulo.trim() === '') return;
    const nuevoModulo = {
      nombre: nombreModulo.trim(),
      pisos: [],
    };
    setModulos([...modulos, nuevoModulo]);
    setNombreModulo('');
    setIsModalOpen(false);
  };


  

  const abrirModalEditarModulo = (index) => {
    setEditandoModuloIndex(index);
    setNombreModulo(modulos[index].nombre);
    setModalEditarModulo(true);
  };

  const guardarEdicionModulo = () => {
    if (editandoModuloIndex === null || nombreModulo.trim() === '') return;
    const nuevosModulos = [...modulos];
    nuevosModulos[editandoModuloIndex].nombre = nombreModulo.trim();
    setModulos(nuevosModulos);
    setModalEditarModulo(false);
    setEditandoModuloIndex(null);
    setNombreModulo('');
  };

  const eliminarModulo = (index) => {
    const nuevosModulos = [...modulos];
    nuevosModulos.splice(index, 1);
    setModulos(nuevosModulos);
  };

  const agregarPiso = (moduloIndex) => {
    const nuevosModulos = [...modulos];
    const nuevoPiso = {
      nombre: `Piso ${nuevosModulos[moduloIndex].pisos.length + 1}`,
      aulas: [],
    };
    nuevosModulos[moduloIndex].pisos.unshift(nuevoPiso);
    setModulos(nuevosModulos);
  };

  const eliminarPiso = (moduloIndex, pisoIndex) => {
    const nuevosModulos = [...modulos];
    nuevosModulos[moduloIndex].pisos.splice(pisoIndex, 1);
    setModulos(nuevosModulos);
  };

  const agregarAula = (moduloIndex, pisoIndex) => {
    const nuevosModulos = [...modulos];
    const piso = nuevosModulos[moduloIndex].pisos[pisoIndex];
    const nuevaAula = {
      nombre: `Aula ${piso.aulas.length + 1}`,
      capacidad: null,
    };
    piso.aulas.push(nuevaAula);
    setModulos(nuevosModulos);
  };

  const eliminarAulaDesdeModal = () => {
    const { moduloIndex, pisoIndex, aulaIndex } = aulaSeleccionada;
    const nuevosModulos = [...modulos];
    nuevosModulos[moduloIndex].pisos[pisoIndex].aulas.splice(aulaIndex, 1);
    setModulos(nuevosModulos);
    setModalAulaVisible(false);
    setAulaSeleccionada(null);
  };

  const abrirModalEditarAula = (moduloIndex, pisoIndex, aulaIndex) => {
    const aula = modulos[moduloIndex].pisos[pisoIndex].aulas[aulaIndex];
    setAulaSeleccionada({ moduloIndex, pisoIndex, aulaIndex });
    setNuevoNombreAula(aula.nombre);
    setCapacidadAula(aula.capacidad || '');
    setModalAulaVisible(true);
  };

  const guardarDatosAula = () => {
    const nuevosModulos = [...modulos];
    const { moduloIndex, pisoIndex, aulaIndex } = aulaSeleccionada;
    nuevosModulos[moduloIndex].pisos[pisoIndex].aulas[aulaIndex] = {
      nombre: nuevoNombreAula.trim() || `Aula ${aulaIndex + 1}`,
      capacidad: capacidadAula.trim(),
    };
    setModulos(nuevosModulos);
    setModalAulaVisible(false);
    setAulaSeleccionada(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={4}>Gestión de Módulos / Edificios</Typography.Title>

      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Crear Módulo
      </Button>

      {/* Modal Crear */}
      <Modal
        title="Crear nuevo módulo"
        open={isModalOpen}
        onOk={crearModulo}
        onCancel={() => setIsModalOpen(false)}
        okText="Crear"
        cancelText="Cancelar"
      >
        <Input
          placeholder="Nombre del módulo"
          value={nombreModulo}
          onChange={(e) => setNombreModulo(e.target.value)}
        />
      </Modal>

      {/* Modal Editar Módulo */}
      <Modal
        title="Editar Módulo"
        open={modalEditarModulo}
        onOk={guardarEdicionModulo}
        onCancel={() => setModalEditarModulo(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Input
          placeholder="Nuevo nombre del módulo"
          value={nombreModulo}
          onChange={(e) => setNombreModulo(e.target.value)}
        />
      </Modal>

      {/* Modal Editar Aula */}
      <Modal
        title="Editar Aula"
        open={modalAulaVisible}
        onCancel={() => setModalAulaVisible(false)}
        footer={[
          <Button key="delete" danger onClick={eliminarAulaDesdeModal}>
            Eliminar
          </Button>,
          <Button key="cancel" onClick={() => setModalAulaVisible(false)}>
            Cancelar
          </Button>,
          <Button key="save" type="primary" onClick={guardarDatosAula}>
            Guardar
          </Button>,
        ]}
      >
        <Input
          placeholder="Nuevo nombre del aula"
          value={nuevoNombreAula}
          onChange={(e) => setNuevoNombreAula(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Input
          type="number"
          placeholder="Capacidad de personas"
          value={capacidadAula}
          onChange={(e) => setCapacidadAula(e.target.value)}
        />
      </Modal>

      {/* Módulos */}
      <div style={{ marginTop: 32, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {modulos.map((modulo, mIndex) => {
          const totalAulas = modulo.pisos.reduce((sum, piso) => sum + piso.aulas.length, 0);
          const totalEstudiantes = modulo.pisos.reduce(
            (sumPisos, piso) =>
              sumPisos +
              piso.aulas.reduce((sumAulas, aula) => {
                const capacidad = parseInt(aula.capacidad);
                return sumAulas + (isNaN(capacidad) ? 0 : capacidad);
              }, 0),
            0
          );

          return (
            <div
              key={mIndex}
              style={{
                border: '2px solid #1890ff',
                borderRadius: 8,
                padding: 16,
                width: 320,
                backgroundColor: '#fafafa',
              }}
            >
              {/* Título + acciones */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Typography.Title level={5} style={{ margin: 0 }}>{modulo.nombre}</Typography.Title>
                <Space>
                  <Button size="small" onClick={() => abrirModalEditarModulo(mIndex)}>
                    Editar
                  </Button>
                  <Button size="small" danger onClick={() => eliminarModulo(mIndex)}>
                    Eliminar
                  </Button>
                </Space>
              </div>

              <Button block onClick={() => agregarPiso(mIndex)} style={{ marginBottom: 16 }}>
                Agregar Piso
              </Button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {modulo.pisos.map((piso, pIndex) => {
                  const totalCapacidad = piso.aulas.reduce((sum, aula) => {
                    const capacidadNum = parseInt(aula.capacidad);
                    return sum + (isNaN(capacidadNum) ? 0 : capacidadNum);
                  }, 0);

                  return (
                    <div key={pIndex} style={{ border: '1px solid #ccc', borderRadius: 4, padding: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{piso.nombre}</strong>
                        <Space>
                          <Button size="small" onClick={() => agregarAula(mIndex, pIndex)}>
                            Crear Aula
                          </Button>
                          <Button size="small" danger onClick={() => eliminarPiso(mIndex, pIndex)}>
                            Eliminar Piso
                          </Button>
                        </Space>
                      </div>

                      {piso.aulas.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                          {piso.aulas.map((aula, aIndex) => (
                            <div
                              key={aIndex}
                              style={{
                                flex: 1,
                                minWidth: 60,
                                padding: 6,
                                backgroundColor: '#91d5ff',
                                color: '#000',
                                borderRadius: 4,
                                textAlign: 'center',
                                cursor: 'pointer',
                                position: 'relative',
                              }}
                              onClick={() => abrirModalEditarAula(mIndex, pIndex, aIndex)}
                            >
                              {aula.nombre}
                              {aula.capacidad && (
                                <div style={{ fontSize: 10, color: '#333' }}>
                                  {aula.capacidad} personas
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ marginTop: 8, textAlign: 'right', fontSize: 12, color: '#555' }}>
                        Total: {totalCapacidad} personas
                      </div>
                    </div>
                  );
                })}

                {/* Resumen por módulo */}
                <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px dashed #ccc', fontSize: 13 }}>
                  <div><strong>Total de pisos:</strong> {modulo.pisos.length}</div>
                  <div><strong>Total de aulas:</strong> {totalAulas}</div>
                  <div><strong>Total de estudiantes:</strong> {totalEstudiantes}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
