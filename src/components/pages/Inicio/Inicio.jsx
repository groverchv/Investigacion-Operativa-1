import React from 'react';

export default function Inicio() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d9f3ff] to-[#ffffff] px-6 py-16">
      <div className="text-center max-w-5xl animate-fade-in">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-[#154577] via-[#3db4f2] to-[#72c8f4] bg-clip-text text-transparent mb-8 leading-tight drop-shadow-[0_10px_15px_rgba(21,69,119,0.4)]">
          Bienvenido a nuestro<br />proyecto de asignación de aulas
        </h1>
        <p className="text-2xl sm:text-3xl md:text-4xl text-[#154577] font-medium leading-relaxed drop-shadow-md">
          Gestiona de forma inteligente tus espacios académicos
        </p>
      </div>

      {/* Estilos animados opcionales */}
      <style>
        {`
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .animate-fade-in {
            animation: fade-in 1.2s ease-out both;
          }
        `}
      </style>
    </div>
  );
}
