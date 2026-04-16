-- =================================================================================
-- SISTEMA DE GESTIÓN DE CEMENTERIO MUNICIPAL
-- Motor: PostgreSQL
-- Arquitecto: Gemini
-- =================================================================================

-- 1. CONFIGURACIONES INICIALES
SET client_encoding = 'UTF8';

-- =================================================================================
-- MÓDULO 1: SEGURIDAD Y ACCESO (RBAC)
-- =================================================================================

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL, -- Ej: 'ADMIN', 'CAJERO', 'OPERARIO'
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    rol_id INT NOT NULL REFERENCES roles (id),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Hash bcrypt/argon2
    nombre_completo VARCHAR(150) NOT NULL,
    email VARCHAR(100),
    ultimo_login TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permisos (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL, -- Ej: 'pagos.crear', 'reportes.ver'
    descripcion VARCHAR(150)
);

CREATE TABLE rol_permisos (
    rol_id INT REFERENCES roles (id) ON DELETE CASCADE,
    permiso_id INT REFERENCES permisos (id) ON DELETE CASCADE,
    PRIMARY KEY (rol_id, permiso_id)
);

-- =================================================================================
-- MÓDULO 2: INFRAESTRUCTURA (EL MAPA)
-- =================================================================================

CREATE TABLE sectores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL, -- Ej: 'SAN PABLO', 'SAN MATEO'
    tipo VARCHAR(50), -- 'PABELLON', 'MAUSOLEO', 'TIERRA'
    coordenadas_geo TEXT -- Para futuro polígono en mapa (GeoJSON o WKT)
);

CREATE TABLE espacios (
    id SERIAL PRIMARY KEY,
    sector_id INT NOT NULL REFERENCES sectores (id),
    fila VARCHAR(10),
    columna VARCHAR(10),
    numero VARCHAR(10), -- El número visible en la placa
    tipo_espacio VARCHAR(20) DEFAULT 'NICHO', -- NICHO, FOSA
    estado VARCHAR(20) DEFAULT 'LIBRE', -- LIBRE, OCUPADO, MANTENIMIENTO, RESERVADO
    coordenadas_lat DECIMAL(10, 8), -- Para ubicar el punto exacto en el mapa
    coordenadas_lng DECIMAL(11, 8),
    titular_id INT REFERENCES titulares (id), -- Para reservas sin inhumación
    CONSTRAINT check_estado CHECK (
        estado IN (
            'LIBRE',
            'OCUPADO',
            'MANTENIMIENTO',
            'RESERVADO'
        )
    )
);

-- =================================================================================
-- MÓDULO 3: REGISTRO CIVIL (DIFUNTOS Y TITULARES)
-- =================================================================================

-- Personas vivas (Responsables de los nichos/pagos)
CREATE TABLE titulares (
    id SERIAL PRIMARY KEY,
    dni VARCHAR(15) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(200),
    email VARCHAR(100)
);

-- Fallecidos
CREATE TABLE difuntos (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni VARCHAR(15), -- Puede ser nulo si son muy antiguos
    fecha_nacimiento DATE,
    fecha_defuncion DATE NOT NULL,
    acta_defuncion VARCHAR(50), -- Nro de acta
    sexo CHAR(1), -- 'M', 'F'
    causa_muerte VARCHAR(200),
    observaciones TEXT
);

-- Relación: Quién está enterrado dónde y quién paga
CREATE TABLE inhumaciones (
    id SERIAL PRIMARY KEY,
    difunto_id INT UNIQUE NOT NULL REFERENCES difuntos (id),
    espacio_id INT NOT NULL REFERENCES espacios (id),
    titular_id INT REFERENCES titulares (id), -- El responsable legal
    fecha_inhumacion DATE DEFAULT CURRENT_DATE,
    tipo_concesion VARCHAR(20) DEFAULT 'TEMPORAL', -- TEMPORAL, PERPETUA
    fecha_vencimiento DATE, -- Importante para alertas de exhumación
    estado VARCHAR(20) DEFAULT 'ACTIVO' -- ACTIVO, EXHUMADO, TRASLADADO
);

-- =================================================================================
-- MÓDULO 4: CAJA Y FINANZAS
-- =================================================================================

CREATE TABLE conceptos_pago (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL, -- Ej: 'DERECHO DE SEPULTURA', 'MANTENIMIENTO ANUAL'
    precio_base DECIMAL(10, 2) NOT NULL,
    es_periodico BOOLEAN DEFAULT FALSE, -- Si se cobra cada año
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    codigo_recibo VARCHAR(20) UNIQUE, -- Nro de comprobante físico o generado
    titular_id INT REFERENCES titulares (id), -- Quién paga
    usuario_id INT NOT NULL REFERENCES usuarios (id), -- El cajero que cobra
    inhumacion_id INT REFERENCES inhumaciones (id), -- A qué nicho afecta (opcional)
    monto_total DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(20) DEFAULT 'EFECTIVO',
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'PAGADO', -- PAGADO, ANULADO
    observaciones TEXT,
    CONSTRAINT check_metodo CHECK (
        metodo_pago IN (
            'EFECTIVO',
            'TARJETA',
            'TRANSFERENCIA',
            'YAPE/PLIN'
        )
    )
);

CREATE TABLE detalle_pagos (
    id SERIAL PRIMARY KEY,
    pago_id INT NOT NULL REFERENCES pagos (id),
    concepto_id INT NOT NULL REFERENCES conceptos_pago (id),
    cantidad INT DEFAULT 1,
    subtotal DECIMAL(10, 2) NOT NULL
);

-- =================================================================================
-- MÓDULO 5: AUDITORÍA (SEGURIDAD DE DATOS)
-- =================================================================================

CREATE TABLE auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios (id),
    accion VARCHAR(50) NOT NULL, -- INSERT, UPDATE, DELETE, LOGIN
    tabla_afectada VARCHAR(50),
    registro_id INT, -- ID del registro modificado
    datos_anteriores JSONB, -- Guardamos el estado previo en formato JSON
    datos_nuevos JSONB,
    ip_origen VARCHAR(45),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================================
-- DATOS SEMILLA (SEED DATA) - PARA PODER ENTRAR AL SISTEMA
-- =================================================================================

-- 1. Crear Roles Básicos
INSERT INTO
    roles (nombre, descripcion)
VALUES (
        'ADMIN',
        'Acceso total al sistema'
    ),
    (
        'CAJERO',
        'Acceso a módulo de caja y reportes financieros'
    ),
    (
        'REGISTRADOR',
        'Gestión de difuntos e infraestructura'
    ),
    (
        'CONSULTA',
        'Solo lectura de mapas y ubicación'
    );

-- 2. Crear Usuario Admin Inicial (Password: 'admin123' -> DEBES HASHEAR ESTO EN PRODUCCIÓN)
-- Nota: En un entorno real, inserta el hash generado por tu backend.
INSERT INTO
    usuarios (
        rol_id,
        username,
        password_hash,
        nombre_completo,
        email
    )
VALUES (
        1,
        'admin',
        '$2y$10$EjemploHashDeAdmin123...',
        'Administrador Municipal',
        'sistemas@municipio.gob.pe'
    );

-- 3. Cargar Sectores Basados en tus CSV
INSERT INTO
    sectores (nombre, tipo)
VALUES ('SAN MATEO', 'PABELLON'),
    ('SAN PABLO', 'PABELLON'),
    ('SANTA TERESA', 'PABELLON');

-- 4. Conceptos de Pago Comunes
INSERT INTO
    conceptos_pago (
        nombre,
        precio_base,
        es_periodico
    )
VALUES (
        'Derecho de Inhumación (Nicho)',
        250.00,
        FALSE
    ),
    (
        'Mantenimiento y Limpieza (Anual)',
        50.00,
        TRUE
    ),
    (
        'Certificado de Búsqueda',
        15.00,
        FALSE
    );