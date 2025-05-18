'use client'
import React, { useState } from 'react';
import Paso0 from './Paso0';
import Paso1 from './Paso1';
import Paso2 from './Paso2';
import Paso3 from './Paso3';
import Paso4 from './Paso4';
import Paso5 from './Paso5';
import Paso6 from './Paso6';
import Paso7 from './Paso7';

export default function Asignacion() {
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [dataPaso1, setDataPaso1] = useState([]);
  const [matricesIteracion, setMatricesIteracion] = useState([]);
  const [datosPaso3, setDatosPaso3] = useState(null);
  const [mostrarPaso1, setMostrarPaso1] = useState(false);
  const [ciclo, setCiclo] = useState(0);

  const handlePaso0Listo = (cols, data) => {
    setColumns(cols);
    setDataSource(data);
    setMostrarPaso1(true);
    setMatricesIteracion([]);
    setCiclo(0);
  };

  const handlePaso6Resuelto = (matrizReducida) => {
    setMatricesIteracion(prev => [...prev, matrizReducida]);
    setDatosPaso3(null);
    setCiclo(prev => prev + 1);
  };

  const currentData = matricesIteracion.length > 0 ? matricesIteracion[matricesIteracion.length - 1] : dataPaso1;

  const mostrarPaso6 = datosPaso3 &&
    datosPaso3.filasTachadas.length + datosPaso3.columnasTachadas.length <
    Math.min(currentData?.length || 0, columns.length);

  const mostrarPaso7 = datosPaso3 &&
    datosPaso3.filasTachadas.length + datosPaso3.columnasTachadas.length ===
    Math.min(currentData?.length || 0, columns.length);

  return (
    <div style={{ padding: 24 }}>
      <Paso0 onListo={handlePaso0Listo} />

      {mostrarPaso1 && (
        <div style={{ marginTop: 48 }}>
          <Paso1 columns={columns} dataSource={dataSource} onResolved={setDataPaso1} />

          {dataPaso1.length > 0 && (
            <Paso2 columns={columns} dataSource={dataPaso1} onResolved={matriz => setMatricesIteracion([matriz])} />
          )}

          {matricesIteracion.map((matriz, index) => (
            <div key={index} style={{ marginTop: 48 }}>
              <h3>Iteración {index + 1}</h3>
              <Paso3 columns={columns} dataSource={matriz} onResolved={setDatosPaso3} />

              {datosPaso3 && (
                <>
                  <Paso4
                    filasTachadas={datosPaso3.filasTachadas}
                    columnasTachadas={datosPaso3.columnasTachadas}
                    totalFilas={matriz.length}
                    totalColumnas={columns.length}
                  />

                  {datosPaso3.filasTachadas.length + datosPaso3.columnasTachadas.length < Math.min(matriz.length, columns.length) && (
                    <>
                      <Paso5
                        dataSource={matriz}
                        columns={columns}
                        filasTachadas={datosPaso3.filasTachadas}
                        columnasTachadas={datosPaso3.columnasTachadas}
                      />
                      <Paso6
                        dataSource={matriz}
                        columns={columns}
                        filasTachadas={datosPaso3.filasTachadas}
                        columnasTachadas={datosPaso3.columnasTachadas}
                        onResolved={handlePaso6Resuelto}
                      />
                    </>
                  )}

                  {datosPaso3.filasTachadas.length + datosPaso3.columnasTachadas.length === Math.min(matriz.length, columns.length) && (
                    <Paso7 dataSource={matriz} columns={columns} />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}