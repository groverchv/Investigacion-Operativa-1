import React from 'react';
import { Layout, Typography } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

const HeaderApp = () => (
  <Header
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#001529',
      padding: '0 16px',
      height: 70,
    }}
  >
    <Title
      level={3}  // Más pequeño que level 1 para mobile
      style={{
        color: 'white',
        margin: 0,
        textAlign: 'center',
        fontSize: 'clamp(1rem, 2vw + 1rem, 2rem)',
        whiteSpace: 'normal', 
      }}
    >
      Investigación Operativa 1
    </Title>
  </Header>
);

export default HeaderApp;
