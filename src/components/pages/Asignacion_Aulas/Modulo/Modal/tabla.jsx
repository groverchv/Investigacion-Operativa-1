'use client';
import React, { useState } from 'react';
import { Table, Modal, Button } from 'antd';
import { ExpandOutlined } from '@ant-design/icons';

export default function Tabla({
  columnas,
  filas,
  titulo = 'Tabla',
  scrollY = 400,
  rowKey = 'key',
  size = 'middle',
  modalSize = 'small',
  scrollX = 'max-content',
  rowClassName = () => '', // ✅ NUEVO: se acepta esta prop
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div style={{ marginTop: 40 }}>
      {/* Estilos embebidos */}
      <style>{`
        .tabla-estandar-wrapper {
          max-height: ${scrollY}px;
          overflow-y: auto;
          overflow-x: auto;
          border: 1px solid #ccc;
          margin-top: 10px;
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
      `}</style>

      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{titulo}</h2>
        <Button icon={<ExpandOutlined />} onClick={() => setModalVisible(true)}>
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
          rowClassName={rowClassName} // ✅ Se aplica aquí
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
            rowClassName={rowClassName} // ✅ Se aplica también aquí
          />
        </div>
      </Modal>
    </div>
  );
}
