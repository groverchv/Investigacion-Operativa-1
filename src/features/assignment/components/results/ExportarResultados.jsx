/**
 * ============================================
 * COMPONENTE: ExportarResultados
 * ============================================
 * Genera un documento PDF con el resumen completo del proceso
 * de asignacion de aulas utilizando el metodo hungaro.
 * 
 * @description Contenido del PDF:
 *  - Pagina 1: Portada con titulo y fecha
 *  - Pagina 2: Resumen de modulos/edificios y aulas
 *  - Pagina 3: Lista de materias y grupos
 *  - Pagina 4: Resultado de asignaciones optimas
 *  - Pagina 5: Horarios definidos
 *  - Pagina 6: Distribucion final por horarios
 *  - Pagina 7: Explicacion del resultado
 * 
 * @requires html2canvas - Para capturar componentes como imagenes
 * @requires jspdf - Para generar el documento PDF
 */

import React, { useRef } from "react";
import { Button, Typography, Card, Divider, Space, Tag } from "antd";
import { FilePdfOutlined, CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CrearModulo from "../building/CrearModulo";
import CrearHorario from "../schedule/CrearHorario";
import GrupoMateria from "../subjects/GrupoMateria";
import Asignar from "./Asignar";
import AsignacionHorario from "../schedule/AsignacionHorario";

const { Title, Paragraph, Text } = Typography;

/**
 * ExportarResultados
 * Genera un PDF completo con los resultados de la asignacion.
 */
export default function ExportarResultados({
  modulos,
  materias,
  horarios,
  matrizPaso1,
  matrizPaso5,
  matrizPaso7,
  matrizPaso10,
  nombresFilas,
  nombresColumnas,
  filasPaso10,
  columnasPaso10,
}) {
  // Referencias para capturar cada seccion como imagen
  const portadaRef = useRef();
  const moduloRef = useRef();
  const grupoRef = useRef();
  const asignarRef = useRef();
  const horarioRef = useRef();
  const asignacionHorarioRef = useRef();
  const explicacionRef = useRef();

  /**
   * Calcula estadisticas del resultado de la asignacion
   */
  const calcularEstadisticas = () => {
    const totalAulas = modulos?.reduce((sum, m) => 
      sum + m.pisos.reduce((s, p) => s + p.aulas.length, 0), 0) || 0;
    const totalGrupos = materias?.reduce((sum, m) => sum + m.grupos.length, 0) || 0;
    const totalEstudiantes = materias?.reduce((sum, m) => 
      sum + m.grupos.reduce((s, g) => s + (parseInt(g.estudiantes) || 0), 0), 0) || 0;
    const totalHorarios = horarios?.length || 0;
    
    return { totalAulas, totalGrupos, totalEstudiantes, totalHorarios };
  };

  const stats = calcularEstadisticas();

  /**
   * Funcion principal para generar el PDF
   * Captura cada seccion y las agrega como paginas al documento
   */
  const exportarPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    /**
     * Renderiza un elemento DOM y lo agrega como pagina al PDF
     * @param {React.Ref} elementRef - Referencia al elemento
     * @param {boolean} isFirst - Si es la primera pagina
     */
    const renderAndAddPage = async (elementRef, isFirst = false) => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(elementRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL("image/png");
      const maxWidth = pageWidth - 2 * margin;
      const maxHeight = pageHeight - 2 * margin;

      let imgWidth = maxWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > maxHeight) {
        imgHeight = maxHeight;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
      }

      if (!isFirst) pdf.addPage();
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    };

    // Renderizar todas las secciones en orden
    await renderAndAddPage(portadaRef, true);
    await renderAndAddPage(moduloRef);
    await renderAndAddPage(grupoRef);
    await renderAndAddPage(asignarRef);
    await renderAndAddPage(horarioRef);
    await renderAndAddPage(asignacionHorarioRef);
    await renderAndAddPage(explicacionRef);

    // Generar nombre con fecha
    const fecha = new Date().toISOString().split('T')[0];
    pdf.save(`asignacion-aulas-${fecha}.pdf`);
  };

  return (
    <Card
      style={{
        marginTop: 24,
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={4} style={{ margin: 0, color: '#1e293b' }}>
          <FilePdfOutlined style={{ marginRight: 8, color: '#ef4444' }} />
          Exportar Resultados
        </Title>
        
        <Paragraph style={{ color: '#64748b', marginBottom: 16 }}>
          Genera un documento PDF con el resumen completo del proceso de asignacion,
          incluyendo modulos, materias, resultados del algoritmo hungaro y explicacion detallada.
        </Paragraph>

        {/* Resumen de estadisticas */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <Tag color="blue">{stats.totalAulas} Aulas</Tag>
          <Tag color="green">{stats.totalGrupos} Grupos</Tag>
          <Tag color="orange">{stats.totalEstudiantes} Estudiantes</Tag>
          <Tag color="purple">{stats.totalHorarios} Horarios</Tag>
        </div>

        <Button 
          type="primary" 
          icon={<FilePdfOutlined />}
          onClick={exportarPDF} 
          size="large"
          style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}
        >
          Descargar PDF
        </Button>
      </Space>

      {/* Estilos para el contenido del PDF */}
      <style>
        {`
          .pagina-pdf {
            width: 800px;
            min-height: 1000px;
            padding: 40px;
            background-color: white;
            font-family: 'Segoe UI', Arial, sans-serif;
          }
          .pagina-pdf h2 {
            text-align: center;
            color: #1e293b;
            margin-bottom: 24px;
            padding-bottom: 12px;
            border-bottom: 2px solid #2563eb;
          }
          .pagina-pdf h3 {
            color: #334155;
            margin-top: 20px;
          }
          .portada-pdf {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
          }
          .portada-pdf h1 {
            font-size: 36px;
            color: #1e293b;
            margin-bottom: 20px;
          }
          .portada-pdf .subtitulo {
            font-size: 18px;
            color: #64748b;
            margin-bottom: 40px;
          }
          .portada-pdf .fecha {
            font-size: 14px;
            color: #94a3b8;
            margin-top: 60px;
          }
          .explicacion-seccion {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 16px 0;
            border-left: 4px solid #2563eb;
          }
        `}
      </style>

      {/* Contenido oculto para captura PDF */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        {/* Pagina 1: Portada */}
        <div ref={portadaRef} className="pagina-pdf portada-pdf">
          <h1>Sistema de Asignacion Optima de Aulas</h1>
          <div className="subtitulo">
            Resultados del proceso de asignacion utilizando el Metodo Hungaro
          </div>
          <div style={{ marginTop: 40 }}>
            <div style={{ fontSize: 16, color: '#475569', marginBottom: 8 }}>
              UAGRM - Santa Cruz, Bolivia
            </div>
            <div style={{ fontSize: 14, color: '#64748b' }}>
              Facultad de Ingenieria en Ciencias de la Computacion y Telecomunicaciones
            </div>
            <div style={{ fontSize: 14, color: '#64748b' }}>
              Investigacion Operativa 1
            </div>
          </div>
          <div className="fecha">
            Generado el: {new Date().toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Pagina 2: Modulos y Aulas */}
        <div ref={moduloRef} className="pagina-pdf">
          <h2>1. Modulos y Aulas Disponibles</h2>
          <p style={{ color: '#64748b', marginBottom: 20 }}>
            Configuracion de edificios, pisos y aulas con sus respectivas capacidades.
          </p>
          <CrearModulo modulos={modulos} />
        </div>

        {/* Pagina 3: Materias y Grupos */}
        <div ref={grupoRef} className="pagina-pdf">
          <h2>2. Materias y Grupos</h2>
          <p style={{ color: '#64748b', marginBottom: 20 }}>
            Lista de materias con sus grupos de estudiantes que requieren asignacion de aulas.
          </p>
          <GrupoMateria materias={materias} />
        </div>

        {/* Pagina 4: Asignaciones */}
        <div ref={asignarRef} className="pagina-pdf">
          <h2>3. Resultado de Asignaciones</h2>
          <p style={{ color: '#64748b', marginBottom: 20 }}>
            Asignacion optima de aulas a grupos calculada mediante el Metodo Hungaro.
          </p>
          <Asignar
            matrizPaso1={matrizPaso1}
            matrizPaso5={matrizPaso5}
            nombresFilas={nombresFilas}
            nombresColumnas={nombresColumnas}
          />
        </div>

        {/* Pagina 5: Horarios */}
        <div ref={horarioRef} className="pagina-pdf">
          <h2>4. Horarios Definidos</h2>
          <p style={{ color: '#64748b', marginBottom: 20 }}>
            Bloques horarios configurados para la distribucion de clases.
          </p>
          <CrearHorario horarios={horarios} />
        </div>

        {/* Pagina 6: Distribucion por Horarios */}
        <div ref={asignacionHorarioRef} className="pagina-pdf">
          <h2>5. Distribucion por Horarios</h2>
          <p style={{ color: '#64748b', marginBottom: 20 }}>
            Asignacion de horarios a cada grupo-aula resultado del proceso.
          </p>
          <AsignacionHorario
            matrizPaso7={matrizPaso7}
            matrizPaso10={matrizPaso10}
            nombresFilas={filasPaso10}
            nombresColumnas={columnasPaso10}
          />
        </div>

        {/* Pagina 7: Explicacion del Resultado */}
        <div ref={explicacionRef} className="pagina-pdf">
          <h2>6. Explicacion del Resultado</h2>
          
          <div className="explicacion-seccion">
            <h3 style={{ color: '#2563eb', marginTop: 0 }}>Que es el Metodo Hungaro?</h3>
            <p>
              El Metodo Hungaro (tambien conocido como algoritmo de Kuhn-Munkres) es un 
              algoritmo de optimizacion combinatoria que resuelve problemas de asignacion 
              en tiempo polinomial. Encuentra la asignacion optima que minimiza o maximiza 
              el costo total.
            </p>
          </div>

          <div className="explicacion-seccion">
            <h3 style={{ color: '#2563eb', marginTop: 0 }}>Como se calculo la asignacion?</h3>
            <p>
              1. <strong>Matriz de Costos:</strong> Se construyo una matriz donde cada celda 
              representa el "costo" de asignar un grupo a un aula (diferencia entre capacidad 
              y estudiantes).
            </p>
            <p>
              2. <strong>Reduccion por Filas:</strong> Se resto el valor minimo de cada fila 
              para crear al menos un cero por fila.
            </p>
            <p>
              3. <strong>Reduccion por Columnas:</strong> Se resto el valor minimo de cada 
              columna para crear al menos un cero por columna.
            </p>
            <p>
              4. <strong>Cobertura Optima:</strong> Se trazaron lineas para cubrir todos los 
              ceros con el minimo numero de lineas.
            </p>
            <p>
              5. <strong>Iteracion:</strong> Si el numero de lineas es menor al tamanio de 
              la matriz, se ajusto y se repitio hasta encontrar la solucion optima.
            </p>
          </div>

          <div className="explicacion-seccion">
            <h3 style={{ color: '#22c55e', marginTop: 0 }}>Resultado Obtenido</h3>
            <p>
              La asignacion mostrada en este documento representa la <strong>solucion optima</strong> 
              que minimiza el desperdicio de espacio en las aulas. Cada grupo de estudiantes 
              ha sido asignado al aula mas adecuada segun su capacidad.
            </p>
            <p>
              <strong>Resumen:</strong>
            </p>
            <ul>
              <li>Total de aulas utilizadas: {stats.totalAulas}</li>
              <li>Total de grupos asignados: {stats.totalGrupos}</li>
              <li>Total de estudiantes beneficiados: {stats.totalEstudiantes}</li>
              <li>Bloques horarios configurados: {stats.totalHorarios}</li>
            </ul>
          </div>

          <div style={{ marginTop: 40, textAlign: 'center', color: '#94a3b8' }}>
            <p>
              Este documento fue generado automaticamente por el Sistema de Asignacion 
              Optima de Aulas.
            </p>
            <p>Investigacion Operativa 1 - UAGRM Santa Cruz, Bolivia</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
