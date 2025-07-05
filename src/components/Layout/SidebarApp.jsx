import React, { useState } from "react";
import {
  HomeOutlined,
  AuditOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Menu, Layout, Breadcrumb, Button, theme } from "antd";

// Componentes asociados
import Inicio from "../pages/Inicio/Inicio";
import Prueba from "../pages/Prueba/Prueba";

const { Sider, Content } = Layout;

const menuData = [
  {
    label: "Inicio",
    icon: HomeOutlined,
    options: [
      { label: "Inicio General", component: <Inicio /> },
    ],
  },

  {
    label: "Asignacion",
    icon: AuditOutlined,
    options: [{ label: "Asignación De Aulas", component: <Prueba /> }],
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
            width: "100%",           
            maxWidth: "100%",      
            overflowX: "auto",   
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
