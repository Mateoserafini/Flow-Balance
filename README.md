# Flow-Balance

Flow-Balance es una aplicación web full-stack diseñada para ayudarte a llevar un control detallado de tus finanzas personales. Permite registrar ingresos, gastos, organizarlos por categorías y gestionar usuarios con autenticación segura.

## 🚀 Tecnologías Utilizadas

### Frontend (Client)
- **React 19** con **TypeScript**
- **Vite** (herramienta de compilación ultrarrápida)
- **Tailwind CSS v4** para los estilos y diseño responsivo
- Configurado con ESLint y Babel (React Compiler)

### Backend (Server)
- **Node.js** con **Express** (Framework de servidor)
- **TypeScript**
- **MongoDB** con **Mongoose** (Base de datos y modelado)
- **JWT** (JSON Web Tokens) y **Bcrypt** para autenticación y encriptación de contraseñas
- **Zod** para la validación estricta de datos
- **Morgan** y **CORS** para registro de peticiones web y políticas de acceso

## 📦 Características Principales

- **Gestión de Usuarios y Autenticación**: Registro e inicio de sesión de forma segura y cifrada para proteger tu información financiera privada.
- **Control de Ingresos y Gastos**: Sistema completo para crear, visualizar, actualizar y eliminar operaciones financieras (CRUD).
- **Categorización**: Clasifica tus gastos e ingresos utilizando categorías (ej. Alimentación, Transporte, Salario, etc.).
- **Arquitectura de API RESTful**: Endpoints modulares orientados a recursos:
  - `/api/auth` para autenticación
  - `/api/users` para cuentas
  - `/api/incomes` para ingresos
  - `/api/expenses` para gastos
  - `/api/categories` para tipos de operaciones

## 🛠️ Instalación y Configuración Local

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión recomendada 20+)
- [MongoDB](https://www.mongodb.com/) (local o cuenta en MongoDB Atlas)

### Pasos de Ejecución

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd Flow-Balance
   ```

2. **Configuración del Servidor (Backend)**
   Abre una terminal en la ruta principal y dirígete a la carpeta `server`:
   ```bash
   cd server
   npm install
   ```
   **Variables de entorno:** Crea un archivo `.env` en el directorio `server` que incluya las variables necesarias:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/flow-balance
   JWT_SECRET=tu_secreto_super_seguro
   ```
   Levanta el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

3. **Configuración del Cliente (Frontend)**
   Abre otra pestaña de la terminal en la ruta principal del proyecto y ve a `client`:
   ```bash
   cd client
   npm install
   ```
   Inicia tu entorno de desarrollo del cliente:
   ```bash
   npm run dev
   ```

4. **Acceso a la Aplicación**
   - El cliente Vite típicamente iniciará en `http://localhost:5173`.
   - Asegúrate de que el backend se encuentre ejecutándose correctamente para que las llamadas a la API funcionen.

## 📂 Estructura del Proyecto

La estructura separa claramente las responsabilidades en dos áreas distintas del stack:

```text
Flow-Balance/
├── client/           # Aplicación Frontend
│   ├── src/          # Código fuente (Componentes, Vistas, main.tsx)
│   ├── vite.config.ts# Configuración de Vite
│   └── package.json
└── server/           # Aplicación Backend
    ├── src/
    │   ├── config/     # Configuraciones generales (ej. DB)
    │   ├── controllers/# Lógica y manejo de las respuestas http
    │   ├── middleware/ # Middlewares (Autorización JWT, Validaciones Zod)
    │   ├── models/     # Modelos y esquemas de Mongoose
    │   ├── routes/     # Definición de rutas Express
    │   ├── schemas/    # Esquemas de validación estructural (Zod)
    │   ├── app.ts      # Inicialización de Middlewares y Rutas de Express
    │   └── index.ts    # Punto de conexión a Base de Datos y arranque de servidor
    └── package.json
```
