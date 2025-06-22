import React, { useState } from "react";
import {
  HomeOutlined,
  FunctionOutlined,
  ApartmentOutlined,
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
  /*{
    label: "Gran M",
    icon: FunctionOutlined,
    options: [
      { label: "Método Gran M", component: <Gran_M /> },
      { label: "Método", component: <Gran_M /> },
    ],
  },
  {
    label: "Dos Fases",
    icon: ApartmentOutlined,
    options: [{ label: "Método Dos Fases", component: <Dos_Fases /> }],
  },*/
  {
    label: "Asignación Aula",
    icon: AuditOutlined,
    options: [{ label: "Asignación Optimizada", component: <Asignacion /> }],
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
  const [collapsed, setCollapsed] = useState(false); // Estado para el Sider

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
    <Layout>
      <Sider
        width={200}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ background: colorBgContainer }}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={["Inicio/Inicio General"]}
          defaultOpenKeys={["sub1"]}
          style={{ height: "100%", borderRight: 0 }}
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout style={{ padding: "0 24px 24px" }}>
        <Breadcrumb
          style={{ margin: "16px 0" }}
          items={[{ title: breadcrumb.subnav }, { title: breadcrumb.option }]}
        />
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {currentComponent}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarApp;
