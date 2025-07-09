"use client";
import React, { useState } from "react";
import { Table, Modal, Button } from "antd";
import { ExpandOutlined } from "@ant-design/icons";

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
    <div style={{ marginTop: 40 }}>
      <style>{`
        .tabla-estandar-wrapper {
          max-height: ${scrollY}px;
          overflow-y: auto;
          overflow-x: auto;
          border: 1px solid #ccc;
          margin-top: 10px;
        }

        .tabla-estandar-wrapper td,
        .tabla-estandar-wrapper th {
          font-size: 14px;
          padding: 6px 8px;
        }

        .tabla-modal td,
        .tabla-modal th {
          font-size: 11px !important;
          padding: 4px 6px !important;
          text-align: center;
          white-space: nowrap;
        }

        .contenedor-scroll {
          overflow: auto;
          max-height: 80vh;
          touch-action: pan-x pan-y;
          -webkit-overflow-scrolling: touch;
        }

        /* ✅ Estilo responsive para móviles */
        @media (max-width: 600px) {
          .tabla-estandar-wrapper td,
.tabla-estandar-wrapper th {
  font-size: 12px;        
  padding: 2px 4px;        
  line-height: 1.2; 
          }

          .tabla-estandar-wrapper {
            border-width: 1px;
          }

          h2 {
            font-size: 16px;
          }
        }
      `}</style>

      {/* Encabezado */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>{titulo}</h2>
        <Button
          size="small"
          icon={<ExpandOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Ver completo
        </Button>
      </div>

      {/* Tabla principal */}
      <div className="tabla-estandar-wrapper">
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

      {/* Modal ampliado */}
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width="95%"
        style={{ top: 20 }}
        title={`${titulo} - Vista ampliada`}
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
