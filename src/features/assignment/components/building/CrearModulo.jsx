/**
 * ============================================
 * COMPONENTE: CrearModulo
 * ============================================
 * Gestion de modulos (edificios), pisos y aulas.
 * Permite crear, editar y eliminar la estructura de espacios.
 * 
 * @param {Array} modulos - Lista de modulos existentes
 * @param {Function} setModulos - Funcion para actualizar modulos
 */

import React from "react";
import { Button, Input, Modal, Typography, Space, Card, Tag } from "antd";
import {
  AppstoreAddOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  HomeOutlined,
} from "@ant-design/icons";

export default function CrearModulo({ modulos, setModulos }) {
  // Estado para controlar la visibilidad del modal de creación de módulo
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  // Estado para almacenar temporalmente el nombre de un nuevo módulo o módulo editado
  const [nombreModulo, setNombreModulo] = React.useState("");

  // Estados para controlar la edición de un módulo existente
  const [editandoModuloIndex, setEditandoModuloIndex] = React.useState(null);
  const [modalEditarModulo, setModalEditarModulo] = React.useState(false);

  // Estados para controlar la edición de un aula
  const [aulaSeleccionada, setAulaSeleccionada] = React.useState(null);
  const [modalAulaVisible, setModalAulaVisible] = React.useState(false);
  const [nuevoNombreAula, setNuevoNombreAula] = React.useState("");
  const [capacidadAula, setCapacidadAula] = React.useState("");

  // Crea un nuevo módulo con nombre y sin pisos
  const crearModulo = () => {
    if (nombreModulo.trim() === "") return;
    const nuevoModulo = {
      nombre: nombreModulo.trim(),
      pisos: [],
    };
    setModulos([...modulos, nuevoModulo]);
    setNombreModulo("");
    setIsModalOpen(false);
  };

  // Abre el modal para editar un módulo existente
  const abrirModalEditarModulo = (index) => {
    setEditandoModuloIndex(index);
    setNombreModulo(modulos[index].nombre);
    setModalEditarModulo(true);
  };

  // Guarda el nuevo nombre del módulo editado
  const guardarEdicionModulo = () => {
    if (editandoModuloIndex === null || nombreModulo.trim() === "") return;
    const nuevosModulos = [...modulos];
    nuevosModulos[editandoModuloIndex].nombre = nombreModulo.trim();
    setModulos(nuevosModulos);
    setModalEditarModulo(false);
    setEditandoModuloIndex(null);
    setNombreModulo("");
  };

  // Elimina un módulo del arreglo
  const eliminarModulo = (index) => {
    const nuevosModulos = [...modulos];
    nuevosModulos.splice(index, 1);
    setModulos(nuevosModulos);
  };

  // Agrega un piso nuevo al inicio del módulo indicado
  const agregarPiso = (moduloIndex) => {
    const nuevosModulos = [...modulos];
    const nuevoPiso = {
      nombre: `Piso ${nuevosModulos[moduloIndex].pisos.length + 1}`,
      aulas: [],
    };
    nuevosModulos[moduloIndex].pisos.unshift(nuevoPiso);
    setModulos(nuevosModulos);
  };

  // Elimina el piso seleccionado de un módulo
  const eliminarPiso = (moduloIndex, pisoIndex) => {
    const nuevosModulos = [...modulos];
    nuevosModulos[moduloIndex].pisos.splice(pisoIndex, 1);
    setModulos(nuevosModulos);
  };

  // Agrega un aula a un piso y calcula su número correlativo
  const agregarAula = (moduloIndex, pisoIndex) => {
    const nuevosModulos = [...modulos];
    const piso = nuevosModulos[moduloIndex].pisos[pisoIndex];
    const totalAulasPrevias = nuevosModulos[moduloIndex].pisos
      .slice(pisoIndex + 1)
      .reduce((sum, p) => sum + p.aulas.length, 0);
    const nuevaAula = {
      nombre: `Aula ${totalAulasPrevias + piso.aulas.length + 1}`,
      capacidad: null,
    };
    piso.aulas.push(nuevaAula);
    setModulos(nuevosModulos);
  };

  // Elimina un aula seleccionada desde el modal
  const eliminarAulaDesdeModal = () => {
    const { moduloIndex, pisoIndex, aulaIndex } = aulaSeleccionada;
    const nuevosModulos = [...modulos];
    nuevosModulos[moduloIndex].pisos[pisoIndex].aulas.splice(aulaIndex, 1);
    setModulos(nuevosModulos);
    setModalAulaVisible(false);
    setAulaSeleccionada(null);
  };

  // Abre el modal para editar el aula seleccionada
  const abrirModalEditarAula = (moduloIndex, pisoIndex, aulaIndex) => {
    const aula = modulos[moduloIndex].pisos[pisoIndex].aulas[aulaIndex];
    setAulaSeleccionada({ moduloIndex, pisoIndex, aulaIndex });
    setNuevoNombreAula(aula.nombre);
    setCapacidadAula(aula.capacidad || "");
    setModalAulaVisible(true);
  };

  // Guarda los datos editados del aula
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
    <Card
      style={{
        marginBottom: 24,
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
      }}
    >
      <Typography.Title level={4} style={{ marginBottom: 16, color: '#1e293b' }}>
        <HomeOutlined style={{ marginRight: 8, color: '#2563eb' }} />
        Gestion de Modulos / Edificios
      </Typography.Title>

      {/* Boton para abrir modal de creacion de modulo */}
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
        Crear Modulo
      </Button>

      {/* Modal para crear nuevo modulo */}
      <Modal
        title="Crear nuevo modulo"
        open={isModalOpen}
        onOk={crearModulo}
        onCancel={() => setIsModalOpen(false)}
        okText="Crear"
        cancelText="Cancelar"
      >
        <Input
          placeholder="Nombre del modulo"
          value={nombreModulo}
          onChange={(e) => setNombreModulo(e.target.value)}
        />
      </Modal>

      {/* Modal para editar modulo */}
      <Modal
        title="Editar Modulo"
        open={modalEditarModulo}
        onOk={guardarEdicionModulo}
        onCancel={() => setModalEditarModulo(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Input
          placeholder="Nuevo nombre del modulo"
          value={nombreModulo}
          onChange={(e) => setNombreModulo(e.target.value)}
        />
      </Modal>

      {/* Modal para editar aula */}
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

      {/* Renderizado de los módulos */}
      <div
        style={{
          marginTop: 32,
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        {modulos.map((modulo, mIndex) => {
          const totalAulas = modulo.pisos.reduce(
            (sum, piso) => sum + piso.aulas.length,
            0
          );
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
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: 16,
                width: 340,
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              {/* Encabezado del modulo */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                  paddingBottom: 12,
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <Typography.Title level={5} style={{ margin: 0, color: '#1e293b' }}>
                  <HomeOutlined style={{ marginRight: 6, color: '#2563eb' }} />
                  {modulo.nombre}
                </Typography.Title>
                <Space>
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => abrirModalEditarModulo(mIndex)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => eliminarModulo(mIndex)}
                  >
                    Eliminar
                  </Button>
                </Space>
              </div>

              {/* Boton para agregar piso */}
              <Button
                block
                icon={<PlusOutlined />}
                onClick={() => agregarPiso(mIndex)}
                style={{ marginBottom: 16 }}
              >
                Agregar Piso
              </Button>

              {/* Resumen del modulo - mostrado arriba */}
              <div
                style={{
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: '1px dashed #e2e8f0',
                  fontSize: 13,
                  color: '#475569',
                }}
              >
                <div>
                  <strong>Total de pisos:</strong> {modulo.pisos.length}
                </div>
                <div>
                  <strong>Total de aulas:</strong> {totalAulas}
                </div>
                <div>
                  <strong>Total de estudiantes:</strong> {totalEstudiantes}
                </div>
              </div>

              {/* Render de pisos y aulas - ordenados como edificio (Piso N arriba, Piso 1 abajo) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[...modulo.pisos].reverse().map((piso, reversedIndex) => {
                    const originalIndex = modulo.pisos.length - 1 - reversedIndex;
                    const totalCapacidad = piso.aulas.reduce((sum, aula) => {
                      const capacidadNum = parseInt(aula.capacidad);
                      return sum + (isNaN(capacidadNum) ? 0 : capacidadNum);
                    }, 0);

                    return (
                      <div
                        key={originalIndex}
                        style={{
                          border: "1px solid #ccc",
                          borderRadius: 4,
                          padding: 8,
                        }}
                      >
                        {/* Cabecera del piso */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <strong>{piso.nombre}</strong>
                          <Space>
                            <Button
                              size="small"
                              onClick={() => agregarAula(mIndex, originalIndex)}
                            >
                              Crear Aula
                            </Button>
                            <Button
                              size="small"
                              danger
                              onClick={() => eliminarPiso(mIndex, originalIndex)}
                            >
                              Eliminar Piso
                            </Button>
                          </Space>
                        </div>

                        {/* Aulas del piso */}
                        {piso.aulas.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              gap: 4,
                              flexWrap: "wrap",
                              marginTop: 8,
                            }}
                          >
                            {piso.aulas.map((aula, aIndex) => (
                              <div
                                key={aIndex}
                                style={{
                                  flex: 1,
                                  minWidth: 60,
                                  padding: 6,
                                  backgroundColor: "#91d5ff",
                                  color: "#000",
                                  borderRadius: 4,
                                  textAlign: "center",
                                  cursor: "pointer",
                                  position: "relative",
                                }}
                                onClick={() =>
                                  abrirModalEditarAula(mIndex, originalIndex, aIndex)
                                }
                              >
                                {aula.nombre}
                                {aula.capacidad && (
                                  <div style={{ fontSize: 10, color: "#333" }}>
                                    {aula.capacidad} personas
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Capacidad total del piso */}
                        <div
                          style={{
                            marginTop: 8,
                            textAlign: "right",
                            fontSize: 12,
                            color: "#555",
                          }}
                        >
                          Total: {totalCapacidad} personas
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
