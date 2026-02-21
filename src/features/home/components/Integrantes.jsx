import React from 'react';
import Grover from '../../../assets/Grover.jpg';
import Melody from '../../../assets/Melody.png';

export default function Integrantes() {
  return (
    <div className="w-full min-h-screen bg-[#f5f5f5] flex flex-col items-center py-10 px-4 relative">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-6xl relative z-10">
        <h1 className="text-4xl font-bold text-center text-white py-3 bg-[#154577] rounded-md mb-10 tracking-wide shadow">
          EQUIPO
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 px-4">
          {/* Persona 1 */}
          <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-[#154577] shadow">
              <img
                src={Grover}
                alt="Choque Villca Grover"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-4 text-lg font-semibold text-center text-gray-800">
              Choque Villca Grover
            </p>
            <p className="text-sm text-gray-600 text-center">Jefe del Proyecto</p>
          </div>

          {/* Persona 2 */}
          <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-[#154577] shadow">
              <img
                src={Melody}
                alt="Montero Villarpando Melody Alejandra"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-4 text-lg font-semibold text-center text-gray-800">
              Montero Villarpando Melody Alejandra
            </p>
            <p className="text-sm text-gray-600 text-center">Miembro del Proyecto</p>
          </div>
        </div>
      </div>

      {/* Fondo decorativo inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#72c8f4] rounded-t-[50%] z-0"></div>
    </div>
  );
}
