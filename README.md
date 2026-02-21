# Sistema de Asignacion Optima de Aulas

Sistema web para la asignacion optima de aulas universitarias utilizando el **Metodo Hungaro** (Kuhn-Munkres). Desarrollado para el curso de Investigacion Operativa 1.

## Caracteristicas

- **Gestion de Modulos/Edificios**: Crear y administrar edificios con pisos y aulas
- **Gestion de Materias y Grupos**: Organizar materias con sus respectivos grupos de estudiantes
- **Algoritmo Hungaro**: Asignacion optima minimizando costos
- **Gestion de Horarios**: Configurar bloques horarios y asignar tiempos
- **Exportacion PDF**: Generar reportes con los resultados de asignacion

## Tecnologias

- **React 19** - Framework de UI
- **Vite** - Build tool
- **Ant Design 5** - Componentes de UI
- **dayjs** - Manejo de fechas/horas
- **html2canvas + jsPDF** - Exportacion a PDF

## Estructura del Proyecto

```
src/
├── components/
│   ├── common/              # Componentes reutilizables
│   │   ├── AyudaManual.jsx  # Modal de ayuda/manual
│   │   └── TablaModal.jsx   # Tabla con modal expandible
│   └── Layout/              # Componentes de layout
│       ├── HeaderApp.jsx    # Cabecera de la aplicacion
│       └── SidebarApp.jsx   # Barra lateral de navegacion
├── constants/               # Constantes del sistema
│   └── index.js             # Colores, configuracion, mensajes
├── features/                # Modulos funcionales (escalable)
│   ├── assignment/          # Modulo de asignacion
│   │   ├── components/
│   │   │   ├── building/    # Gestion de edificios
│   │   │   ├── matrix/      # Visualizacion de matrices
│   │   │   ├── results/     # Resultados y exportacion
│   │   │   ├── schedule/    # Gestion de horarios
│   │   │   ├── steps/       # Pasos del algoritmo (Paso1-Paso10)
│   │   │   └── subjects/    # Gestion de materias
│   │   ├── utils/           # Utilidades del modulo
│   │   ├── AssignmentModule.jsx
│   │   ├── AssignmentPage.jsx
│   │   └── index.js
│   └── home/                # Modulo de inicio
│       ├── components/      # Subcomponentes
│       ├── HomePage.jsx
│       └── index.js
├── hooks/                   # Hooks personalizados
├── styles/                  # Estilos globales
│   ├── App.css
│   └── index.css
├── App.jsx
└── main.jsx
```

## Algoritmo Hungaro

El sistema implementa el **Metodo Hungaro** para resolver problemas de asignacion:

1. **Paso 1**: Construccion de matriz cuadrada
2. **Paso 2**: Reduccion por filas (restar minimos)
3. **Paso 3**: Reduccion por columnas (restar minimos)
4. **Paso 4**: Cobertura de ceros con lineas minimas
5. **Paso 5**: Optimizacion iterativa hasta solucion optima

## Instalacion

```bash
# Clonar repositorio
git clone [URL_REPOSITORIO]

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para produccion
npm run build
```

## Uso

1. **Configurar Modulos**: Crear edificios, pisos y aulas con capacidades
2. **Configurar Materias**: Agregar materias y sus grupos con cantidad de estudiantes
3. **Ejecutar Asignacion de Aulas**: El sistema calculara la asignacion optima
4. **Configurar Horarios**: Establecer bloques horarios disponibles
5. **Ejecutar Asignacion de Horarios**: Asignar horarios a cada grupo-aula
6. **Exportar Resultados**: Generar PDF con el resultado final

## Equipo de Desarrollo

Proyecto desarrollado para la UAGRM - Santa Cruz, Bolivia
Materia: Investigacion Operativa 1

**Estudiante Universitario**: Grover Choque Villca

**Facultad**: Ingenieria en Ciencias de la Computacion y Telecomunicaciones (FICCT)

**Proyecto asignado por**: Ing. Luz Diana Torrez

## Licencia

MIT
