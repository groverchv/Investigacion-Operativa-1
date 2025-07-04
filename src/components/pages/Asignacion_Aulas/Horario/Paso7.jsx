import React, { useEffect } from 'react';
import Tabla from '../../Prueba/Modal/tabla';

export default function Paso7({ columnasPaso6, filasPaso6, filasConLinea, columnasConLinea, onResultado }) {
  const keysColumnas = columnasPaso6
    .filter(col => col.dataIndex !== 'materiaGrupo')
    .map(col => col.dataIndex);

  const matriz = filasPaso6.map(fila =>
    keysColumnas.map(key => Number(fila[key]) || 0)
  );

  // Buscar el menor valor no cubierto
  let menor = Infinity;
  matriz.forEach((fila, i) => {
    fila.forEach((val, j) => {
      const filaCubierta = filasConLinea.includes(i);
      const colCubierta = columnasConLinea.includes(j);
      if (!filaCubierta && !colCubierta) {
        menor = Math.min(menor, val);
      }
    });
  });

  // Aplicar ajuste
  const nuevaMatriz = matriz.map((fila, i) =>
    fila.map((val, j) => {
      const filaCubierta = filasConLinea.includes(i);
      const colCubierta = columnasConLinea.includes(j);

      if (!filaCubierta && !colCubierta) {
        return val - menor;
      }
      if (filaCubierta && colCubierta) {
        return val + menor;
      }
      return val;
    })
  );

  // Crear nuevas filas renderizadas
  const filasRenderizadas = filasPaso6.map((fila, i) => {
    const nuevaFila = { ...fila };
    keysColumnas.forEach((key, j) => {
      nuevaFila[key] = (
        <div style={{ padding: '4px', textAlign: 'center' }}>
          {nuevaMatriz[i][j]}
        </div>
      );
    });
    return nuevaFila;
  });

  // Enviar resultado al padre
  useEffect(() => {
    if (onResultado) {
      // Convertir nuevaMatriz a formato filas (opcional según flujo)
      const filasAjustadas = filasPaso6.map((fila, i) => {
        const nuevaFila = { ...fila };
        keysColumnas.forEach((key, j) => {
          nuevaFila[key] = nuevaMatriz[i][j];
        });
        return nuevaFila;
      });

      onResultado(filasAjustadas);
    }
  }, [nuevaMatriz, onResultado, filasPaso6, keysColumnas]);

  return (
    <div style={{ padding: 24 }}>
      <h2>PASO 7: Ajustar matriz para generar más ceros</h2>
      <Tabla
        columnas={columnasPaso6}
        filas={filasRenderizadas}
        titulo="PASO 7: Matriz ajustada para más ceros"
      />
      <p><strong>Menor valor restado:</strong> {menor}</p>
    </div>
  );
}
