import React, { useState } from 'react';
import {
  HomeOutlined,
  FunctionOutlined,
  ApartmentOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Typography } from 'antd';

// Componentes
import Gran_M from './Gran_M/Gran_M';
import Dos_Fases from './Dos_Fases/Dos_Fases';
import Asignacion from './Asignacion_Aulas/Asignacion';
import Inicio from './Inicio/Inicio';
import Integrantes from './Inicio/Integrantes';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const menuData = [
  {
    label: 'Inicio',
    icon: HomeOutlined,
    options: [
      { label: 'Inicio General', component: <Inicio /> },
      { label: 'Integrantes', component: <Integrantes /> },
    ],
  },
{/*  {
    label: 'Gran M',
    icon: FunctionOutlined,
    options: [
      { label: 'Método Gran M', component: <Gran_M /> },
    ],
  },
  {
    label: 'Dos Fases',
    icon: ApartmentOutlined,
    options: [
      { label: 'Método Dos Fases', component: <Dos_Fases /> },
    ],
  },
*/}
  {
    label: 'Asignación Aula',
    icon: AuditOutlined,
    options: [
      { label: 'Asignación Optimizada', component: <Asignacion /> },
    ],
  },
];

// Generar menú y mapa de componentes
const items2 = [];
const componentMap = {};
let optionKeyCounter = 1;

menuData.forEach((section, i) => {
  const children = section.options.map((opt) => {
    const key = `option${optionKeyCounter++}`;
    const compositeKey = `${section.label}/${opt.label}`;
    componentMap[compositeKey] = opt.component;
    return {
      key,
      label: opt.label,
      parent: section.label,
      compositeKey,
    };
  });

  items2.push({
    key: `sub${i + 1}`,
    icon: React.createElement(section.icon),
    label: section.label,
    children,
  });
});

const Principal = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [breadcrumb, setBreadcrumb] = useState({
    subnav: 'Inicio',
    option: 'Inicio General',
  });

  const handleMenuClick = (e) => {
    const selected = items2
      .flatMap(item => item.children || [])
      .find(child => child.key === e.key);

    if (selected) {
      setBreadcrumb({
        subnav: selected.parent,
        option: selected.label,
      });
    }
  };

  const currentComponent =
    componentMap[`${breadcrumb.subnav}/${breadcrumb.option}`] ||
    <div>Selecciona una opción del menú</div>;

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: '#001529', padding: '0 24px' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Investigación Operativa
        </Title>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['option1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={items2}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb
            style={{ margin: '16px 0' }}
            items={[
              { title: breadcrumb.subnav },
              { title: breadcrumb.option }
            ]}
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
    </Layout>
  );
};

export default Principal;
