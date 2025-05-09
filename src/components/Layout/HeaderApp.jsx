// src/components/HeaderApp.jsx
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
      padding: 0,
      height: 70,                   
    }}
  >
    <Title
      level={1}                     
      style={{ color: 'white', margin: 0 }}
    >
      Investigación Operativa 1
    </Title>
  </Header>
);

export default HeaderApp;
