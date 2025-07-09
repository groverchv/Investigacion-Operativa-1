import React, { useRef } from "react";
import { Button } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CrearModulo from "./CrearModulo";
import CrearHorario from "./CrearHorario";
import GrupoMateria from "./GrupoMateria";
import Asignar from "./Asignar";
import AsignacionHorario from "./AsignacionHorario";

/**
 * Componente que genera un PDF con los resultados del proceso de asignación.
 * Renderiza los componentes invisiblemente fuera de la pantalla, los captura con html2canvas y los exporta con jsPDF.
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
  // Refs para capturar cada sección como imagen para el PDF
  const moduloRef = useRef();
  const horarioRef = useRef();
  const grupoRef = useRef();
  const asignarRef = useRef();
  const asignacionHorarioRef = useRef();

  /**
   * Función principal que genera el PDF:
   * 1. Renderiza cada sección a imagen con html2canvas.
   * 2. Las añade a páginas individuales del PDF.
   * 3. Descarga el archivo final.
   */
  const exportarPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4"); // orientación: portrait, unidad: mm, tamaño: A4
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    /**
     * Renderiza un componente referenciado (ref) y lo agrega como una página al PDF.
     * @param {React.Ref} elementRef - Referencia al DOM del componente.
     * @param {boolean} isFirst - Si es la primera página, no se llama addPage().
     */
    const renderAndAddPage = async (elementRef, isFirst = false) => {
      await new Promise((resolve) => setTimeout(resolve, 300)); // delay para asegurar renderizado

      const canvas = await html2canvas(elementRef.current, {
        scale: 2,
        useCORS: true, // permite cargar imágenes externas si es necesario
      });

      const imgData = canvas.toDataURL("image/png");
      const maxWidth = pageWidth - 2 * margin;
      const maxHeight = pageHeight - 2 * margin;

      // Escalar imagen al tamaño máximo permitido
      let imgWidth = maxWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > maxHeight) {
        imgHeight = maxHeight;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
      }

      if (!isFirst) pdf.addPage(); // solo se omite en la primera página
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    };

    // Renderizar todas las secciones en orden
    await renderAndAddPage(moduloRef, true);
    await renderAndAddPage(grupoRef);
    await renderAndAddPage(asignarRef);
    await renderAndAddPage(horarioRef);
    await renderAndAddPage(asignacionHorarioRef);

    // Guardar PDF con nombre definido
    pdf.save("resumen-asignacion.pdf");
  };

  return (
    <div style={{ marginTop: 24 }}>
      {/* Estilos personalizados para el contenido del PDF */}
      <style>
        {`
          .pagina-a4 {
            width: 800px;
            padding: 20px;
            background-color: white;
            font-family: 'Arial', sans-serif;
          }

          .pagina-a4 h2 {
            text-align: center;
            margin-bottom: 16px;
          }
        `}
      </style>

      {/* Contenido oculto que se renderiza fuera de la pantalla solo para captura */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        {/* Página 1: Resumen de módulos y aulas */}
        <div ref={moduloRef} className="pagina-a4">
          <h2>Resumen de Asignaciones</h2>
          <CrearModulo modulos={modulos} />
        </div>

        {/* Página 2: Lista de materias y grupos */}
        <div ref={grupoRef} className="pagina-a4">
          <h2>Materias y Grupos</h2>
          <GrupoMateria materias={materias} />
        </div>

        {/* Página 3: Resultado de asignaciones (matriz final) */}
        <div ref={asignarRef} className="pagina-a4">
          <h2>Asignaciones Finales</h2>
          <Asignar
            matrizPaso1={matrizPaso1}
            matrizPaso5={matrizPaso5}
            nombresFilas={nombresFilas}
            nombresColumnas={nombresColumnas}
          />
        </div>

        {/* Página 4: Horarios definidos */}
        <div ref={horarioRef} className="pagina-a4">
          <h2>Horarios Definidos</h2>
          <CrearHorario horarios={horarios} />
        </div>

        {/* Página 5: Asignaciones con horarios (por grupo y aula) */}
        <div ref={asignacionHorarioRef} className="pagina-a4">
          <h2>Distribución por Horarios</h2>
          <AsignacionHorario
            matrizPaso7={matrizPaso7}
            matrizPaso10={matrizPaso10}
            nombresFilas={filasPaso10}
            nombresColumnas={columnasPaso10}
          />
        </div>
      </div>

      {/* Botón visible para el usuario */}
      <Button type="primary" onClick={exportarPDF} style={{ marginTop: 16 }}>
        Exportar PDF
      </Button>
    </div>
  );
}
