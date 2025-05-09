// src/Principal.jsx
import React from 'react';
import { Layout } from 'antd';
import HeaderApp from '../Layout/HeaderApp';
import SidebarApp from '../Layout/SidebarApp';

const Principal = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderApp />
      <Layout>
        <SidebarApp />
      </Layout>
    </Layout>
  );
};

export default Principal;
