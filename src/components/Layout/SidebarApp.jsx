/**
 * ============================================
 * COMPONENTE: SidebarApp
 * ============================================
 * Barra lateral de navegacion con menu desplegable.
 * Incluye navegacion entre secciones y boton de ayuda.
 * 
 * @description Sistema de navegacion principal con:
 *  - Menu colapsable
 *  - Breadcrumb de ubicacion
 *  - Area de contenido dinamico
 *  - Boton de manual de usuario
 */

import React, { useState } from "react";
import {
  HomeOutlined,
  AppstoreOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Menu, Layout, Breadcrumb, Button, theme, Space } from "antd";

// Componentes de pagina - Nuevas rutas escalables
import Inicio from "../../features/home/HomePage";
import Prueba from "../../features/assignment/AssignmentPage";
import AyudaManual from "../common/AyudaManual";

const { Sider, Content } = Layout;

/**
 * Configuracion del menu de navegacion
 * @type {Array} Lista de secciones con sus opciones
 */
const menuData = [
  {
    label: "Inicio",
    icon: HomeOutlined,
    options: [
      { label: "Pantalla Principal", component: <Inicio /> },
    ],
  },
  {
    label: "Asignacion",
    icon: AppstoreOutlined,
    options: [
      { label: "Asignacion de Aulas", component: <Prueba /> }
    ],
  },
];

/**
 * Componente SidebarApp
 * @returns {JSX.Element} Layout con sidebar, breadcrumb y contenido
 */
const SidebarApp = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Estado del breadcrumb actual
  const [breadcrumb, setBreadcrumb] = useState({
    subnav: "Inicio",
    option: "Pantalla Principal",
  });

  // Componente actualmente mostrado
  const [currentComponent, setCurrentComponent] = useState(<Inicio />);
  
  // Estado del collapse del sidebar
  const [collapsed, setCollapsed] = useState(false);

  // Construccion de items del menu y mapeo de componentes
  const items = [];
  const componentMap = {};

  menuData.forEach((section, i) => {
    const children = section.options.map((opt) => {
      const key = `${section.label}/${opt.label}`;
      componentMap[key] = {
        label: opt.label,
        parent: section.label,
        component: opt.component,
      };
      return { key, label: opt.label };
    });

    items.push({
      key: `sub${i + 1}`,
      icon: React.createElement(section.icon),
      label: section.label,
      children,
    });
  });

  /**
   * Maneja el clic en un item del menu
   * @param {Object} e - Evento del menu con la key seleccionada
   */
  const handleMenuClick = (e) => {
    const selected = componentMap[e.key];
    if (selected) {
      setBreadcrumb({ subnav: selected.parent, option: selected.label });
      setCurrentComponent(selected.component);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Barra lateral */}
      <Sider
        width={220}
        collapsible
        collapsedWidth={60}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ 
          background: colorBgContainer,
          borderRight: '1px solid #e2e8f0',
        }}
        breakpoint="md"
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={["Inicio/Pantalla Principal"]}
          defaultOpenKeys={["sub1"]}
          style={{ 
            height: "100%", 
            borderRight: 0,
            paddingTop: '8px',
          }}
          inlineIndent={16}
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>

      {/* Area de contenido */}
      <Layout>
        {/* Barra superior con breadcrumb y ayuda */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '12px 24px',
            backgroundColor: colorBgContainer,
            borderBottom: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <Breadcrumb
            items={[
              { title: breadcrumb.subnav }, 
              { title: breadcrumb.option }
            ]}
          />
          <AyudaManual 
            buttonType="primary" 
            buttonText={collapsed ? "" : "Manual de Usuario"} 
          />
        </div>

        {/* Contenido principal */}
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            width: "100%",
            maxWidth: "100%",
            overflowX: "auto",
            background: '#f8fafc',
            boxSizing: "border-box",
          }}
        >
          <div 
            style={{ 
              background: colorBgContainer, 
              borderRadius: borderRadiusLG,
              padding: '24px',
              minHeight: 'calc(100vh - 180px)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            {currentComponent}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarApp;
