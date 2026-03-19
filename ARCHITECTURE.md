# 🏗️ Arquitectura del Sistema de Cementerio

## Visión General

Sistema full-stack para la gestión integral de cementerios municipales, desarrollado con:
- **Backend**: NestJS + TypeORM + MySQL
- **Frontend**: Angular 19 + PrimeNG + Tailwind CSS

---

## 📁 Estructura del Backend

```
backend/src/
├── main.ts                    # Punto de entrada
├── app.module.ts              # Módulo raíz
├── app.controller.ts          # Controller raíz (health checks)
├── app.service.ts             # Servicio raíz (estadísticas dashboard)
│
├── database/                  # 🗄️ Configuración de Base de Datos
│   └── database.module.ts     # Conexión TypeORM a MySQL
│
├── auth/                      # 🔐 Autenticación y Autorización
│   ├── auth.module.ts
│   ├── auth.controller.ts     # Login, registro
│   ├── auth.service.ts        # JWT, validación
│   ├── strategies/            # Passport strategies
│   ├── guards/                # JWT Guard, Roles Guard
│   └── decorators/            # @Roles(), @Public()
│
├── infraestructura/           # 🏛️ Gestión de Infraestructura Física
│   ├── infraestructura.module.ts
│   ├── sectores.controller.ts   # CRUD sectores
│   ├── sectores.service.ts
│   ├── espacios.controller.ts   # CRUD espacios/nichos
│   ├── espacios.service.ts      # Incluye mapa visual
│   ├── dto/
│   └── entities/
│       ├── sector.entity.ts
│       └── espacio.entity.ts
│
├── registro/                  # 📋 Gestión de Registros (Personas)
│   ├── registro.module.ts
│   ├── difuntos.controller.ts    # CRUD difuntos
│   ├── difuntos.service.ts       # Incluye validación DNI único
│   ├── titulares.controller.ts   # CRUD titulares/responsables
│   ├── titulares.service.ts
│   ├── inhumaciones.controller.ts # CRUD inhumaciones
│   ├── inhumaciones.service.ts    # Validación difunto único
│   ├── dto/
│   └── entities/
│       ├── difunto.entity.ts      # Relación 1:1 con Inhumacion
│       ├── titular.entity.ts      # Responsable legal
│       └── inhumacion.entity.ts   # Une Difunto + Espacio + Titular
│
├── caja/                      # 💰 Gestión Financiera
│   ├── caja.module.ts
│   ├── conceptos-pago.controller.ts  # Tipos de cobro
│   ├── conceptos-pago.service.ts
│   ├── pagos.controller.ts           # Registro de pagos
│   ├── pagos.service.ts
│   ├── dto/
│   └── entities/
│       ├── concepto-pago.entity.ts
│       └── pago.entity.ts
│
└── auditoria/                 # 📝 Logs y Auditoría
    └── (pendiente implementación)
```

---

## 📁 Estructura del Frontend

```
frontend/src/app/
├── app.ts                     # Componente raíz
├── app.config.ts              # Configuración (providers, routes)
├── app.routes.ts              # Rutas principales
│
├── core/                      # 🔧 Núcleo de la Aplicación
│   ├── guards/
│   │   └── auth.guard.ts      # Protección de rutas
│   ├── interceptors/
│   │   └── auth.interceptor.ts # Inyección de JWT
│   ├── models/
│   │   ├── auth.model.ts
│   │   ├── caja.model.ts
│   │   ├── infraestructura.model.ts
│   │   └── registro.model.ts
│   ├── services/              # Servicios HTTP
│   │   ├── auth.service.ts
│   │   ├── difuntos.service.ts
│   │   ├── espacios.service.ts
│   │   ├── inhumaciones.service.ts
│   │   ├── pagos.service.ts
│   │   ├── sectores.service.ts
│   │   └── titulares.service.ts
│   └── layout/                # (deprecado, usar /layout)
│
├── layout/                    # 🎨 Layout Principal
│   ├── app.layout.ts          # Layout con sidebar
│   ├── app.topbar.ts          # Barra superior
│   ├── app.menu.ts            # Menú lateral
│   └── app.footer.ts          # Pie de página
│
├── features/                  # 📦 Módulos de Funcionalidad
│   ├── auth/                  # Login
│   ├── dashboard/             # Panel principal
│   ├── sectores/              # Gestión de sectores
│   │   ├── sectores-list/
│   │   └── mapa-nichos/       # Visualización gráfica
│   ├── espacios/              # Gestión de nichos/fosas
│   ├── difuntos/              # Gestión de difuntos
│   ├── titulares/             # Gestión de responsables
│   ├── inhumaciones/          # Gestión de inhumaciones
│   ├── conceptos-pago/        # Tipos de cobro
│   ├── pagos/                 # Registro de pagos
│   ├── usuarios/              # Gestión de usuarios
│   └── roles/                 # Gestión de roles
│
└── pages/                     # 📄 Páginas de Template (Sakai)
    ├── landing/               # Página de bienvenida
    ├── uikit/                 # Demos de componentes UI
    └── documentation/         # Documentación del template
```

---

## 🔄 Flujo de Datos Principal

```mermaid
graph TD
    A[Usuario] -->|Interactúa| B[Frontend Angular]
    B -->|HTTP + JWT| C[Backend NestJS]
    C -->|TypeORM| D[(MySQL Database)]
    
    subgraph Frontend
        B1[Components] --> B2[Services]
        B2 --> B3[HTTP Client]
    end
    
    subgraph Backend
        C1[Controllers] --> C2[Services]
        C2 --> C3[Repositories]
    end
```

---

## 📊 Modelo de Datos (Relaciones)

```mermaid
erDiagram
    SECTOR ||--o{ ESPACIO : contiene
    ESPACIO ||--o| INHUMACION : aloja
    DIFUNTO ||--|| INHUMACION : tiene
    TITULAR ||--o{ INHUMACION : responsable
    INHUMACION ||--o{ PAGO : genera
    CONCEPTO_PAGO ||--o{ PAGO : define
    USUARIO }|--|| ROL : tiene
```

### Relaciones Clave:
- **Difunto ↔ Inhumación**: 1:1 (un difunto solo puede ser inhumado una vez)
- **Espacio ↔ Inhumación**: 1:N (un espacio puede tener múltiples inhumaciones en el tiempo)
- **Titular ↔ Inhumación**: 1:N (un titular puede ser responsable de varias inhumaciones)

---

## 🛡️ Seguridad

1. **Autenticación**: JWT con expiración configurable
2. **Autorización**: Guards basados en roles (ADMIN, OPERADOR, CONSULTA)
3. **Validación**: class-validator en DTOs del backend
4. **Protección de rutas**: AuthGuard en frontend

---

## 🔧 Configuración

### Variables de Entorno Backend (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=****
DB_DATABASE=cementerio_db
JWT_SECRET=****
JWT_EXPIRES_IN=24h
```

### Variables de Entorno Frontend (environment.ts)
```typescript
export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api'
};
```

---

## 📝 Convenciones de Código

### Backend (NestJS)
- Controllers: `nombre.controller.ts`
- Services: `nombre.service.ts`
- Entities: `nombre.entity.ts`
- DTOs: `create-nombre.dto.ts`, `update-nombre.dto.ts`

### Frontend (Angular)
- Components: `nombre-list.component.ts/html/scss`
- Services: `nombre.service.ts`
- Models: `nombre.model.ts`

---

## 🚀 Comandos de Desarrollo

```bash
# Backend
cd backend
npm run start:dev      # Desarrollo con hot reload

# Frontend
cd frontend
npm start              # ng serve

# Base de datos
# Usar MySQL Workbench o phpMyAdmin
```

---

## 📈 Mejoras Futuras

- [ ] Implementar auditoría completa
- [ ] Agregar reportes PDF
- [ ] Sistema de notificaciones (vencimientos)
- [ ] Backup automático de BD
- [ ] Integración con sistemas de pago
