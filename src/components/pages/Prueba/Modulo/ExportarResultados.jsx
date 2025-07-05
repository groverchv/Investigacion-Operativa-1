import React, { useRef } from "react";
import { Button } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CrearModulo from "./CrearModulo";
import CrearHorario from "./CrearHorario";
import GrupoMateria from "./GrupoMateria";
import Asignar from "./Asignar";
import AsignacionHorario from "./AsignacionHorario";

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
  const moduloRef = useRef();
  const horarioRef = useRef();
  const grupoRef = useRef();
  const asignarRef = useRef();
  const asignacionHorarioRef = useRef();

  const exportarPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    const renderAndAddPage = async (elementRef, isFirst = false) => {
      await new Promise((resolve) => setTimeout(resolve, 300)); // pequeño delay

      const canvas = await html2canvas(elementRef.current, {
        scale: 2,
        useCORS: true,
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

    await renderAndAddPage(moduloRef, true);

    await renderAndAddPage(grupoRef);
    await renderAndAddPage(asignarRef);
    await renderAndAddPage(horarioRef);
    await renderAndAddPage(asignacionHorarioRef);

    pdf.save("resumen-asignacion.pdf");
  };

  return (
    <div style={{ marginTop: 24 }}>
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

      {/* Renderizado fuera de pantalla, pero con tamaño completo */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={moduloRef} className="pagina-a4">
          <h2>Resumen de Asignaciones</h2>
          <CrearModulo modulos={modulos} />
        </div>

        <div ref={grupoRef} className="pagina-a4">
          <h2>Materias y Grupos</h2>
          <GrupoMateria materias={materias} />
        </div>

        <div ref={asignarRef} className="pagina-a4">
          <h2>Asignaciones Finales</h2>
          <Asignar
            matrizPaso1={matrizPaso1}
            matrizPaso5={matrizPaso5}
            nombresFilas={nombresFilas}
            nombresColumnas={nombresColumnas}
          />
        </div>

        <div ref={horarioRef} className="pagina-a4">
          <h2>Horarios Definidos</h2>
          <CrearHorario horarios={horarios} />
        </div>

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

      <Button type="primary" onClick={exportarPDF} style={{ marginTop: 16 }}>
        Exportar PDF
      </Button>
    </div>
  );
}
