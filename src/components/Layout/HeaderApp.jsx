/**
 * ============================================
 * COMPONENTE: HeaderApp
 * ============================================
 * Cabecera principal de la aplicacion.
 * Muestra el titulo del sistema con estilos profesionales.
 * 
 * @description Barra superior fija con branding del sistema.
 *              Totalmente responsive para dispositivos moviles.
 */

import React from 'react';
import { Layout, Typography } from 'antd';
import { BookOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

/**
 * Componente HeaderApp
 * @returns {JSX.Element} Cabecera de la aplicacion
 */
const HeaderApp = () => (
  <Header
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1e3a5f',
      padding: '0 24px',
      height: 64,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}
  >
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px' 
    }}>
      <BookOutlined style={{ 
        fontSize: '24px', 
        color: '#60a5fa' 
      }} />
      <Title
        level={4}
        style={{
          color: '#ffffff',
          margin: 0,
          fontWeight: 600,
          letterSpacing: '0.5px',
          fontSize: 'clamp(0.875rem, 2vw + 0.5rem, 1.25rem)',
          whiteSpace: 'nowrap',
        }}
      >
        Sistema de Asignacion de Aulas - IO1
      </Title>
    </div>
  </Header>
);

export default HeaderApp;
