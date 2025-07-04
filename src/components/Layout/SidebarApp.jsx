import React, { useState } from "react";
import {
  HomeOutlined,
  AuditOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Menu, Layout, Breadcrumb, Button, theme } from "antd";

// Componentes asociados
import Integrantes from "../pages/Inicio/Integrantes";
import Inicio from "../pages/Inicio/Inicio";
import Asignacion from "../pages/Asignacion_Aulas/Asignacion";
import Objetivo from "../pages/Inicio/Objetivo";
import Funcion from "../pages/Inicio/Funcion";
import Prueba from "../pages/Prueba/Prueba";

const { Sider, Content } = Layout;

const menuData = [
  {
    label: "Inicio",
    icon: HomeOutlined,
    options: [
      { label: "Inicio General", component: <Inicio /> },
      { label: "Integrantes", component: <Integrantes /> },
      { label: "Objetivo", component: <Objetivo /> },
      { label: "Funcion", component: <Funcion /> },
    ],
  },
  {
    label: "Asignación Aula",
    icon: AuditOutlined,
    options: [{ label: "Asignación Optimizada", component: <Asignacion /> }],
  },

  {
    label: "Prueba",
    icon: AuditOutlined,
    options: [{ label: "Prueba", component: <Prueba /> }],
  },


];

const SidebarApp = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [breadcrumb, setBreadcrumb] = useState({
    subnav: "Inicio",
    option: "Inicio General",
  });

  const [currentComponent, setCurrentComponent] = useState(<Inicio />);
  const [collapsed, setCollapsed] = useState(false);

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

  const handleMenuClick = (e) => {
    const selected = componentMap[e.key];
    if (selected) {
      setBreadcrumb({ subnav: selected.parent, option: selected.label });
      setCurrentComponent(selected.component);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={200}
        collapsible
        collapsedWidth={48}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ background: colorBgContainer }}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={["Inicio/Inicio General"]}
          defaultOpenKeys={["sub1"]}
          style={{ height: "100%", borderRight: 0 }}
          inlineIndent={8}
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout>
        <Breadcrumb
          style={{ margin: "16px 24px" }}
          items={[{ title: breadcrumb.subnav }, { title: breadcrumb.option }]}
        />

        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            width: "100%",           // ✅ Que el Content use todo el espacio
            maxWidth: "100%",        // ✅ Que no se limite a un ancho máximo
            overflowX: "auto",       // ✅ Permitir scroll horizontal si el contenido es grande
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            boxSizing: "border-box",
          }}
        >
          {currentComponent}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarApp;
