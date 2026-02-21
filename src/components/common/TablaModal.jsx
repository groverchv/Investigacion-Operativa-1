/**
 * ============================================
 * COMPONENTE: Tabla
 * ============================================
 * Componente reutilizable para mostrar tablas de datos.
 * Incluye funcionalidad de modal expandido y responsive.
 * 
 * @param {Array} columnas - Definicion de columnas de la tabla
 * @param {Array} filas - Datos de las filas
 * @param {string} titulo - Titulo de la tabla
 * @param {number} scrollY - Altura maxima con scroll
 * @param {string} rowKey - Clave unica para cada fila
 * @param {string} size - Tamano de la tabla (small, middle, large)
 * @param {string} modalSize - Tamano de tabla en modal
 * @param {string} scrollX - Ancho con scroll horizontal
 * @param {Function} rowClassName - Funcion para clases de fila
 */

"use client";
import React, { useState } from "react";
import { Table, Modal, Button, Typography } from "antd";
import { ExpandOutlined, TableOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function Tabla({
  columnas,
  filas,
  titulo = "Tabla",
  scrollY = 200,
  rowKey = "key",
  size = "middle",
  modalSize = "small",
  scrollX = "max-content",
  rowClassName = () => "",
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div style={{ marginTop: 24 }}>
      <style>{`
        /* Estilos base de la tabla */
        .tabla-wrapper {
          max-height: ${scrollY}px;
          overflow-y: auto;
          overflow-x: auto;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-top: 12px;
          background-color: #ffffff;
        }

        .tabla-wrapper .ant-table-thead > tr > th {
          background-color: #f1f5f9 !important;
          color: #1e293b !important;
          font-weight: 600 !important;
          border-bottom: 2px solid #e2e8f0 !important;
          font-size: 13px;
        }

        .tabla-wrapper .ant-table-tbody > tr > td {
          border-bottom: 1px solid #e2e8f0 !important;
          font-size: 13px;
        }

        .tabla-wrapper .ant-table-tbody > tr:hover > td {
          background-color: #f8fafc !important;
        }

        /* Estilos del modal */
        .tabla-modal .ant-table-thead > tr > th {
          font-size: 11px !important;
          padding: 6px 8px !important;
          background-color: #f1f5f9 !important;
        }

        .tabla-modal .ant-table-tbody > tr > td {
          font-size: 11px !important;
          padding: 4px 6px !important;
          text-align: center;
        }

        .contenedor-scroll {
          overflow: auto;
          max-height: 80vh;
          touch-action: pan-x pan-y;
          -webkit-overflow-scrolling: touch;
        }

        /* Estilos responsive */
        @media (max-width: 768px) {
          .tabla-wrapper .ant-table-thead > tr > th,
          .tabla-wrapper .ant-table-tbody > tr > td {
            font-size: 11px;
            padding: 4px 6px;
          }

          .tabla-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 8px;
          }

          .tabla-header h4 {
            font-size: 14px !important;
          }
        }

        @media (max-width: 480px) {
          .tabla-wrapper .ant-table-thead > tr > th,
          .tabla-wrapper .ant-table-tbody > tr > td {
            font-size: 10px;
            padding: 3px 4px;
          }
        }
      `}</style>

      {/* Encabezado con titulo y boton de expandir */}
      <div
        className="tabla-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Title level={5} style={{ margin: 0, color: '#1e293b' }}>
          <TableOutlined style={{ marginRight: 8, color: '#2563eb' }} />
          {titulo}
        </Title>
        <Button
          size="small"
          icon={<ExpandOutlined />}
          onClick={() => setModalVisible(true)}
          style={{
            borderRadius: '6px',
          }}
        >
          Ver completo
        </Button>
      </div>

      {/* Tabla principal */}
      <div className="tabla-wrapper">
        <Table
          columns={columnas}
          dataSource={filas}
          bordered
          pagination={false}
          scroll={{ x: scrollX }}
          rowKey={rowKey}
          size={size}
          rowClassName={rowClassName}
        />
      </div>

      {/* Modal con vista ampliada */}
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width="95%"
        style={{ top: 20 }}
        title={
          <span style={{ color: '#1e293b' }}>
            <TableOutlined style={{ marginRight: 8, color: '#2563eb' }} />
            {titulo} - Vista Ampliada
          </span>
        }
        bodyStyle={{ padding: 0 }}
      >
        <div className="contenedor-scroll">
          <Table
            columns={columnas}
            dataSource={filas}
            bordered
            pagination={false}
            scroll={{ x: true }}
            rowKey={rowKey}
            size={modalSize}
            className="tabla-modal"
            rowClassName={rowClassName}
          />
        </div>
      </Modal>
    </div>
  );
}
