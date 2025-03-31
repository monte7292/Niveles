# Niveles Front

Este es un proyecto de frontend desarrollado con React y TypeScript que forma parte de una aplicación web completa para un bot de Discord de sistema de niveles. La aplicación permite a los administradores de servidores de Discord gestionar y configurar el sistema de niveles de sus comunidades.

## 🎮 Descripción del Proyecto

El proyecto es una interfaz de administración para un bot de Discord que implementa un sistema de niveles. Permite a los administradores de servidores:

- Gestionar la configuración del sistema de niveles
- Personalizar mensajes y recompensas
- Ver estadísticas y tablas de clasificación
- Configurar roles automáticos por nivel
- Gestionar múltiples servidores de Discord
- Ver tablas de clasificación globales y por servidor

## 📁 Estructura del Proyecto

```
niveles-front/
├── src/
│   ├── assets/         # Recursos estáticos (imágenes, CSS)
│   ├── components/     # Componentes reutilizables
│   ├── pages/         # Páginas de la aplicación
│   │   ├── dashboard.tsx      # Panel principal de servidores
│   │   ├── ServerConfig.tsx   # Configuración del servidor
│   │   ├── leaderboard.tsx    # Tabla de clasificación por servidor
│   │   ├── TopGlobal.tsx      # Tabla de clasificación global
│   │   └── AuthCallback.tsx   # Manejo de autenticación
│   ├── config/        # Configuraciones
│   ├── auth/          # Lógica de autenticación
│   ├── App.tsx        # Componente principal
│   └── index.tsx      # Punto de entrada
├── public/            # Archivos públicos
│   ├── index.html
│   ├── manifest.json
│   └── logo.png
└── package.json       # Dependencias y scripts
```

## 🚀 Tecnologías Principales

- React 18
- TypeScript
- React Router DOM
- Axios para peticiones HTTP
- Redis para caché
- Express para el servidor
- MongoDB para la base de datos
- Discord OAuth2 para autenticación

## 📱 Características

- Interfaz de usuario moderna y responsiva
- Sistema de autenticación mediante Discord
- Gestión de sesiones
- Integración con backend
- Optimización de rendimiento
- Panel de administración intuitivo
- Gestión de múltiples servidores
- Configuración personalizable
- Tablas de clasificación en tiempo real
- Sistema de roles automáticos

## 🛠️ Requisitos Previos

- Node.js
- npm
- Redis instalado y configurado
- MongoDB instalado y configurado
- Bot de Discord configurado con los permisos necesarios
- Credenciales de OAuth2 de Discord

## 🔒 Seguridad

- Implementación de autenticación mediante Discord OAuth2
- Manejo de sesiones con Redis
- Protección de rutas
- Variables de entorno para datos sensibles
- Validación de permisos de administrador

## 📄 Licencia

Este proyecto está bajo la Licencia Privada.

