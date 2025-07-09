import React, { useState } from "react";
import { Button, Input, Modal, Typography, Space } from "antd";

// GrupoMateria: permite crear, editar y eliminar materias y sus respectivos grupos
export default function GrupoMateria({ materias, setMaterias }) {
  // Estados para la creación y edición de materias
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombreMateria, setNombreMateria] = useState("");
  const [materiaEditandoIndex, setMateriaEditandoIndex] = useState(null);
  const [modalEditarMateria, setModalEditarMateria] = useState(false);

  // Estados para la creación y edición de grupos
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [modalGrupoVisible, setModalGrupoVisible] = useState(false);
  const [nuevoNombreGrupo, setNuevoNombreGrupo] = useState("");
  const [cantidadEstudiantes, setCantidadEstudiantes] = useState("");

  // Crea una nueva materia con nombre y sin grupos
  const crearMateria = () => {
    if (nombreMateria.trim() === "") return;
    const nuevaMateria = {
      nombre: nombreMateria.trim(),
      grupos: [],
    };
    setMaterias([...materias, nuevaMateria]);
    setNombreMateria("");
    setIsModalOpen(false);
  };

  // Guarda los cambios de una materia editada
  const editarMateria = () => {
    if (materiaEditandoIndex === null || nombreMateria.trim() === "") return;
    const nuevasMaterias = [...materias];
    nuevasMaterias[materiaEditandoIndex].nombre = nombreMateria.trim();
    setMaterias(nuevasMaterias);
    setModalEditarMateria(false);
    setMateriaEditandoIndex(null);
    setNombreMateria("");
  };

  // Elimina una materia del listado
  const eliminarMateria = (index) => {
    const nuevasMaterias = [...materias];
    nuevasMaterias.splice(index, 1);
    setMaterias(nuevasMaterias);
  };

  // Abre el modal para editar una materia específica
  const abrirModalEditarMateria = (index) => {
    setMateriaEditandoIndex(index);
    setNombreMateria(materias[index].nombre);
    setModalEditarMateria(true);
  };

  // Agrega un grupo nuevo a una materia existente
  const agregarGrupo = (materiaIndex) => {
    const nuevasMaterias = [...materias];
    const nuevaMateria = nuevasMaterias[materiaIndex];
    const nuevoGrupo = {
      nombre: `Grupo ${nuevaMateria.grupos.length + 1}`,
      estudiantes: null,
    };
    nuevaMateria.grupos.push(nuevoGrupo);
    setMaterias(nuevasMaterias);
  };

  // Abre el modal para editar un grupo específico
  const abrirModalEditarGrupo = (materiaIndex, grupoIndex) => {
    const grupo = materias[materiaIndex].grupos[grupoIndex];
    setGrupoSeleccionado({ materiaIndex, grupoIndex });
    setNuevoNombreGrupo(grupo.nombre);
    setCantidadEstudiantes(grupo.estudiantes || "");
    setModalGrupoVisible(true);
  };

  // Guarda los cambios de un grupo editado
  const guardarGrupo = () => {
    const nuevasMaterias = [...materias];
    const { materiaIndex, grupoIndex } = grupoSeleccionado;
    nuevasMaterias[materiaIndex].grupos[grupoIndex] = {
      nombre: nuevoNombreGrupo.trim() || `Grupo ${grupoIndex + 1}`,
      estudiantes: cantidadEstudiantes.trim(),
    };
    setMaterias(nuevasMaterias);
    setModalGrupoVisible(false);
    setGrupoSeleccionado(null);
  };

  // Elimina un grupo desde el modal de edición
  const eliminarGrupoDesdeModal = () => {
    const { materiaIndex, grupoIndex } = grupoSeleccionado;
    const nuevasMaterias = [...materias];
    nuevasMaterias[materiaIndex].grupos.splice(grupoIndex, 1);
    setMaterias(nuevasMaterias);
    setModalGrupoVisible(false);
    setGrupoSeleccionado(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={4}>
        Gestión de Materias y Grupos
      </Typography.Title>

      {/* Botón para crear nueva materia */}
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Crear Materia
      </Button>

      {/* Modal para crear materia */}
      <Modal
        title="Crear nueva materia"
        open={isModalOpen}
        onOk={crearMateria}
        onCancel={() => setIsModalOpen(false)}
        okText="Crear"
        cancelText="Cancelar"
      >
        <Input
          placeholder="Nombre de la materia"
          value={nombreMateria}
          onChange={(e) => setNombreMateria(e.target.value)}
        />
      </Modal>

      {/* Modal para editar materia */}
      <Modal
        title="Editar Materia"
        open={modalEditarMateria}
        onOk={editarMateria}
        onCancel={() => setModalEditarMateria(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Input
          placeholder="Nuevo nombre de la materia"
          value={nombreMateria}
          onChange={(e) => setNombreMateria(e.target.value)}
        />
      </Modal>

      {/* Modal para editar grupo */}
      <Modal
        title="Editar Grupo"
        open={modalGrupoVisible}
        onCancel={() => setModalGrupoVisible(false)}
        footer={[
          <Button key="delete" danger onClick={eliminarGrupoDesdeModal}>
            Eliminar
          </Button>,
          <Button key="cancel" onClick={() => setModalGrupoVisible(false)}>
            Cancelar
          </Button>,
          <Button key="save" type="primary" onClick={guardarGrupo}>
            Guardar
          </Button>,
        ]}
      >
        <Input
          placeholder="Nombre del grupo"
          value={nuevoNombreGrupo}
          onChange={(e) => setNuevoNombreGrupo(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Input
          type="number"
          placeholder="Cantidad de estudiantes"
          value={cantidadEstudiantes}
          onChange={(e) => setCantidadEstudiantes(e.target.value)}
        />
      </Modal>

      {/* Listado de materias y sus grupos */}
      <div
        style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 20 }}
      >
        {materias.map((materia, mIndex) => {
          const totalGrupos = materia.grupos.length;
          const totalEstudiantes = materia.grupos.reduce((sum, grupo) => {
            const cantidad = parseInt(grupo.estudiantes);
            return sum + (isNaN(cantidad) ? 0 : cantidad);
          }, 0);

          return (
            <div
              key={mIndex}
              style={{
                border: "2px solid #1890ff",
                borderRadius: 8,
                padding: 16,
                width: 320,
                backgroundColor: "#fafafa",
              }}
            >
              {/* Encabezado de materia */}
              <div style={{ marginBottom: 8 }}>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  {materia.nombre}
                </Typography.Title>
              </div>

              {/* Acciones de edición y eliminación */}
              <div style={{ marginBottom: 8 }}>
                <Space>
                  <Button
                    size="small"
                    onClick={() => abrirModalEditarMateria(mIndex)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    danger
                    onClick={() => eliminarMateria(mIndex)}
                  >
                    Eliminar
                  </Button>
                </Space>
              </div>

              {/* Botón para agregar grupo */}
              <Button
                block
                onClick={() => agregarGrupo(mIndex)}
                style={{ margin: "12px 0" }}
              >
                Agregar Grupo
              </Button>

              {/* Lista de grupos */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {materia.grupos.map((grupo, gIndex) => (
                  <div
                    key={gIndex}
                    onClick={() => abrirModalEditarGrupo(mIndex, gIndex)}
                    style={{
                      backgroundColor: "#91d5ff",
                      padding: 8,
                      borderRadius: 6,
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <div>{grupo.nombre}</div>
                    {grupo.estudiantes && (
                      <div style={{ fontSize: 12, color: "#333" }}>
                        {grupo.estudiantes} estudiantes
                      </div>
                    )}
                  </div>
                ))}

                {/* Resumen final */}
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 8,
                    borderTop: "1px dashed #ccc",
                    fontSize: 13,
                  }}
                >
                  <div>
                    <strong>Total de grupos:</strong> {totalGrupos}
                  </div>
                  <div>
                    <strong>Total de estudiantes:</strong> {totalEstudiantes}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
