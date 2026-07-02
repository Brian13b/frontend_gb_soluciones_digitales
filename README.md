# GB Soluciones - Admin Panel 🚀

Panel de administración moderno, responsivo y orientado a Mobile-First para la gestión integral de leads, conversaciones y proyectos de GB Soluciones Digitales.

---

## 🛠️ Tecnologías Utilizadas

Este proyecto está construido con una arquitectura moderna de Single Page Application (SPA) enfocada en el rendimiento y la fluidez de la interfaz:

* **Core:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* **Enrutamiento:** [React Router v6](https://reactrouter.com/)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
* **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
* **Iconografía:** [Lucide React](https://lucide.dev/)
* **Gestión de Estado:** Context API
* **Data Fetching:** Axios

---

## ✨ Características Principales

* **Diseño Mobile-First:** Interfaz adaptativa con un patrón *Master-Detail* para una experiencia fluida tanto en escritorio como en dispositivos móviles.
* **Sidebar Inteligente:** Navegación colapsable animada con Framer Motion que optimiza el espacio de trabajo.
* **Gestión de Leads Estructurada:** Panel de detalles de conversación con extracción de contactos (nombre, email, teléfono) y validación de estados.
* **Modo Oscuro Nativo:** Interfaz diseñada bajo un esquema *Dark Theme* con efectos *glassmorphism*.
* **Protección de Rutas:** Sistema de autenticación con JWT integrado.

---

## ⚙️ Requisitos Previos

Asegúrate de tener instalado en tu entorno local:

* [Node.js](https://nodejs.org/)
* npm

---

## 🚀 Instalación y Configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Brian13b/frontend_gb_soluciones_digitales.git
    cd frontend_gb_soluciones_digitales
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example` y configura la URL del backend:
    ```env
    VITE_API_URL=http://localhost:8000/api
    # VITE_API_URL=[https://tu-backend-en-railway.app/api](https://tu-backend-en-railway.app/api)
    ```

4.  **Ejecutar en entorno de desarrollo:**
    ```bash
    npm run dev
    ```
    El panel estará disponible en `http://localhost:5173`.

---

## 📁 Estructura del Proyecto

```text
src/
├── components/
│   ├── layout/         # Componentes estructurales (AppShell, Sidebar)
│   ├── dashboard/      # Tarjetas de estadísticas e indicadores
│   └── conversations/  # Vistas de lista, detalle y filtros (ContactsList)
├── context/            # Contextos globales (AuthContext)
├── hooks/              # Custom hooks (useConversations, useStats)
├── pages/              # Vistas principales enlazadas al enrutador
├── services/           # Lógica de peticiones HTTP (Axios)
└── App.jsx             # Configuración de rutas y providers
```

---

## 🛣️ Roadmap Próximo

- [ ] Integración de Socket.io-client para recepción de mensajes de WhatsApp en tiempo real.

- [ ] Creación de la vista completa para la Gestión de Proyectos (CRUD).

- [ ] Implementación de Lazy Loading (Code Splitting) en las rutas principales para optimizar el bundle inicial.

---

## 📄 Licencia
Propietario **GB Soluciones Digitales**. Uso interno únicamente.