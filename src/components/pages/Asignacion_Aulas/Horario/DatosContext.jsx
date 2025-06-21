import React, { createContext, useState, useContext } from 'react';

// Crea el contexto
const DatosContext = createContext();

// Proveedor
export function DatosProvider({ children }) {
  const [datosCompartidos, setDatosCompartidos] = useState([]);

  return (
    <DatosContext.Provider value={{ datosCompartidos, setDatosCompartidos }}>
      {children}
    </DatosContext.Provider>
  );
}

// Hook para usar el contexto fácilmente
export function useDatosCompartidos() {
  return useContext(DatosContext);
}
