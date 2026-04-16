--
-- PostgreSQL database dump
--

\restrict Q0zUkOtbwBeSKTMdptOA8jqSZuBwbsatkOvKJp5pc0YK8ppjNEVt73C3Om8OUpB

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: espacios_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.espacios_estado_enum AS ENUM (
    'LIBRE',
    'OCUPADO',
    'MANTENIMIENTO',
    'RESERVADO'
);


ALTER TYPE public.espacios_estado_enum OWNER TO postgres;

--
-- Name: pagos_metodo_pago_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.pagos_metodo_pago_enum AS ENUM (
    'EFECTIVO',
    'TARJETA',
    'TRANSFERENCIA',
    'YAPE/PLIN'
);


ALTER TYPE public.pagos_metodo_pago_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auditoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditoria (
    id integer NOT NULL,
    usuario_id integer,
    accion character varying(50) NOT NULL,
    tabla_afectada character varying(50),
    registro_id integer,
    datos_anteriores jsonb,
    datos_nuevos jsonb,
    ip_origen character varying(45),
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.auditoria OWNER TO postgres;

--
-- Name: auditoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auditoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auditoria_id_seq OWNER TO postgres;

--
-- Name: auditoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auditoria_id_seq OWNED BY public.auditoria.id;


--
-- Name: conceptos_pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conceptos_pago (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    precio_base numeric(10,2) NOT NULL,
    es_periodico boolean DEFAULT false NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.conceptos_pago OWNER TO postgres;

--
-- Name: conceptos_pago_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.conceptos_pago_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.conceptos_pago_id_seq OWNER TO postgres;

--
-- Name: conceptos_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.conceptos_pago_id_seq OWNED BY public.conceptos_pago.id;


--
-- Name: detalle_pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalle_pagos (
    id integer NOT NULL,
    pago_id integer NOT NULL,
    concepto_id integer NOT NULL,
    cantidad integer DEFAULT 1 NOT NULL,
    subtotal numeric(10,2) NOT NULL
);


ALTER TABLE public.detalle_pagos OWNER TO postgres;

--
-- Name: detalle_pagos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalle_pagos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalle_pagos_id_seq OWNER TO postgres;

--
-- Name: detalle_pagos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalle_pagos_id_seq OWNED BY public.detalle_pagos.id;


--
-- Name: difuntos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.difuntos (
    id integer NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    dni character varying(15),
    fecha_nacimiento date,
    fecha_defuncion date NOT NULL,
    acta_defuncion character varying(50),
    sexo character(1),
    causa_muerte character varying(200),
    observaciones text,
    titular_id integer
);


ALTER TABLE public.difuntos OWNER TO postgres;

--
-- Name: difuntos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.difuntos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.difuntos_id_seq OWNER TO postgres;

--
-- Name: difuntos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.difuntos_id_seq OWNED BY public.difuntos.id;


--
-- Name: espacios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.espacios (
    id integer NOT NULL,
    sector_id integer NOT NULL,
    fila character varying(10),
    columna character varying(10),
    numero character varying(10),
    tipo_espacio character varying(20) DEFAULT 'NICHO'::character varying NOT NULL,
    estado public.espacios_estado_enum DEFAULT 'LIBRE'::public.espacios_estado_enum NOT NULL,
    coordenadas_lat numeric(10,8),
    coordenadas_lng numeric(11,8),
    codigo character varying(20),
    titular_id integer
);


ALTER TABLE public.espacios OWNER TO postgres;

--
-- Name: espacios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.espacios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.espacios_id_seq OWNER TO postgres;

--
-- Name: espacios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.espacios_id_seq OWNED BY public.espacios.id;


--
-- Name: inhumaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inhumaciones (
    id integer NOT NULL,
    difunto_id integer NOT NULL,
    espacio_id integer NOT NULL,
    titular_id integer,
    fecha_inhumacion date DEFAULT ('now'::text)::date NOT NULL,
    tipo_concesion character varying(20) DEFAULT 'TEMPORAL'::character varying NOT NULL,
    fecha_vencimiento date,
    estado character varying(20) DEFAULT 'ACTIVO'::character varying NOT NULL,
    hora_inhumacion time without time zone,
    numero_acta character varying(50),
    observaciones text
);


ALTER TABLE public.inhumaciones OWNER TO postgres;

--
-- Name: inhumaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inhumaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inhumaciones_id_seq OWNER TO postgres;

--
-- Name: inhumaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inhumaciones_id_seq OWNED BY public.inhumaciones.id;


--
-- Name: pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos (
    id integer NOT NULL,
    codigo_recibo character varying(20),
    titular_id integer,
    usuario_id integer NOT NULL,
    inhumacion_id integer,
    monto_total numeric(10,2) NOT NULL,
    metodo_pago public.pagos_metodo_pago_enum DEFAULT 'EFECTIVO'::public.pagos_metodo_pago_enum NOT NULL,
    fecha_pago timestamp without time zone DEFAULT now() NOT NULL,
    estado character varying(20) DEFAULT 'PAGADO'::character varying NOT NULL,
    observaciones text
);


ALTER TABLE public.pagos OWNER TO postgres;

--
-- Name: pagos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pagos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pagos_id_seq OWNER TO postgres;

--
-- Name: pagos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pagos_id_seq OWNED BY public.pagos.id;


--
-- Name: permisos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permisos (
    id integer NOT NULL,
    slug character varying(100) NOT NULL,
    descripcion character varying(150)
);


ALTER TABLE public.permisos OWNER TO postgres;

--
-- Name: permisos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permisos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permisos_id_seq OWNER TO postgres;

--
-- Name: permisos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permisos_id_seq OWNED BY public.permisos.id;


--
-- Name: rol_permisos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol_permisos (
    rol_id integer NOT NULL,
    permiso_id integer NOT NULL
);


ALTER TABLE public.rol_permisos OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: sectores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sectores (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    tipo character varying(50),
    coordenadas_geo text,
    descripcion text,
    tipo_espacio character varying(20) DEFAULT 'NICHO'::character varying NOT NULL,
    capacidad_total integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.sectores OWNER TO postgres;

--
-- Name: sectores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sectores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sectores_id_seq OWNER TO postgres;

--
-- Name: sectores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sectores_id_seq OWNED BY public.sectores.id;


--
-- Name: titulares; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titulares (
    id integer NOT NULL,
    dni character varying(15) NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    telefono character varying(20),
    direccion character varying(200),
    email character varying(100)
);


ALTER TABLE public.titulares OWNER TO postgres;

--
-- Name: titulares_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.titulares_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.titulares_id_seq OWNER TO postgres;

--
-- Name: titulares_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.titulares_id_seq OWNED BY public.titulares.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    rol_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    nombre_completo character varying(150) NOT NULL,
    email character varying(100),
    ultimo_login timestamp without time zone,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: auditoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria ALTER COLUMN id SET DEFAULT nextval('public.auditoria_id_seq'::regclass);


--
-- Name: conceptos_pago id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conceptos_pago ALTER COLUMN id SET DEFAULT nextval('public.conceptos_pago_id_seq'::regclass);


--
-- Name: detalle_pagos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pagos ALTER COLUMN id SET DEFAULT nextval('public.detalle_pagos_id_seq'::regclass);


--
-- Name: difuntos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.difuntos ALTER COLUMN id SET DEFAULT nextval('public.difuntos_id_seq'::regclass);


--
-- Name: espacios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.espacios ALTER COLUMN id SET DEFAULT nextval('public.espacios_id_seq'::regclass);


--
-- Name: inhumaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inhumaciones ALTER COLUMN id SET DEFAULT nextval('public.inhumaciones_id_seq'::regclass);


--
-- Name: pagos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos ALTER COLUMN id SET DEFAULT nextval('public.pagos_id_seq'::regclass);


--
-- Name: permisos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos ALTER COLUMN id SET DEFAULT nextval('public.permisos_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: sectores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sectores ALTER COLUMN id SET DEFAULT nextval('public.sectores_id_seq'::regclass);


--
-- Name: titulares id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titulares ALTER COLUMN id SET DEFAULT nextval('public.titulares_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: auditoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auditoria (id, usuario_id, accion, tabla_afectada, registro_id, datos_anteriores, datos_nuevos, ip_origen, fecha) FROM stdin;
1	\N	UPDATE	usuarios	\N	\N	{"ultimoLogin": "2026-04-11T18:04:35.369Z"}	\N	2026-04-11 13:04:35.396967
2	\N	UPDATE	usuarios	\N	\N	{"ultimoLogin": "2026-04-11T18:20:42.814Z"}	\N	2026-04-11 13:20:42.831367
3	\N	INSERT	sectores	9	\N	{"id": 9, "tipo": null, "nombre": "Santa clara", "descripcion": null, "tipoEspacio": "fosa", "capacidadTotal": 100, "coordenadasGeo": null}	\N	2026-04-11 13:23:02.838232
4	\N	INSERT	espacios	151	\N	{"id": 151, "fila": "1", "codigo": "SC-001", "estado": "LIBRE", "numero": "1", "columna": "1", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
5	\N	INSERT	espacios	152	\N	{"id": 152, "fila": "1", "codigo": "SC-002", "estado": "LIBRE", "numero": "2", "columna": "2", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
6	\N	INSERT	espacios	153	\N	{"id": 153, "fila": "1", "codigo": "SC-003", "estado": "LIBRE", "numero": "3", "columna": "3", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
7	\N	INSERT	espacios	154	\N	{"id": 154, "fila": "1", "codigo": "SC-004", "estado": "LIBRE", "numero": "4", "columna": "4", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
8	\N	INSERT	espacios	155	\N	{"id": 155, "fila": "1", "codigo": "SC-005", "estado": "LIBRE", "numero": "5", "columna": "5", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
9	\N	INSERT	espacios	156	\N	{"id": 156, "fila": "1", "codigo": "SC-006", "estado": "LIBRE", "numero": "6", "columna": "6", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
10	\N	INSERT	espacios	157	\N	{"id": 157, "fila": "1", "codigo": "SC-007", "estado": "LIBRE", "numero": "7", "columna": "7", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
11	\N	INSERT	espacios	158	\N	{"id": 158, "fila": "1", "codigo": "SC-008", "estado": "LIBRE", "numero": "8", "columna": "8", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
12	\N	INSERT	espacios	159	\N	{"id": 159, "fila": "1", "codigo": "SC-009", "estado": "LIBRE", "numero": "9", "columna": "9", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
13	\N	INSERT	espacios	160	\N	{"id": 160, "fila": "1", "codigo": "SC-010", "estado": "LIBRE", "numero": "10", "columna": "10", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
14	\N	INSERT	espacios	161	\N	{"id": 161, "fila": "2", "codigo": "SC-011", "estado": "LIBRE", "numero": "11", "columna": "1", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
15	\N	INSERT	espacios	162	\N	{"id": 162, "fila": "2", "codigo": "SC-012", "estado": "LIBRE", "numero": "12", "columna": "2", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
16	\N	INSERT	espacios	163	\N	{"id": 163, "fila": "2", "codigo": "SC-013", "estado": "LIBRE", "numero": "13", "columna": "3", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
17	\N	INSERT	espacios	164	\N	{"id": 164, "fila": "2", "codigo": "SC-014", "estado": "LIBRE", "numero": "14", "columna": "4", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
18	\N	INSERT	espacios	165	\N	{"id": 165, "fila": "2", "codigo": "SC-015", "estado": "LIBRE", "numero": "15", "columna": "5", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
19	\N	INSERT	espacios	166	\N	{"id": 166, "fila": "2", "codigo": "SC-016", "estado": "LIBRE", "numero": "16", "columna": "6", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
20	\N	INSERT	espacios	167	\N	{"id": 167, "fila": "2", "codigo": "SC-017", "estado": "LIBRE", "numero": "17", "columna": "7", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
21	\N	INSERT	espacios	168	\N	{"id": 168, "fila": "2", "codigo": "SC-018", "estado": "LIBRE", "numero": "18", "columna": "8", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
22	\N	INSERT	espacios	169	\N	{"id": 169, "fila": "2", "codigo": "SC-019", "estado": "LIBRE", "numero": "19", "columna": "9", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
23	\N	INSERT	espacios	170	\N	{"id": 170, "fila": "2", "codigo": "SC-020", "estado": "LIBRE", "numero": "20", "columna": "10", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
24	\N	INSERT	espacios	171	\N	{"id": 171, "fila": "3", "codigo": "SC-021", "estado": "LIBRE", "numero": "21", "columna": "1", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
25	\N	INSERT	espacios	172	\N	{"id": 172, "fila": "3", "codigo": "SC-022", "estado": "LIBRE", "numero": "22", "columna": "2", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
26	\N	INSERT	espacios	173	\N	{"id": 173, "fila": "3", "codigo": "SC-023", "estado": "LIBRE", "numero": "23", "columna": "3", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
27	\N	INSERT	espacios	174	\N	{"id": 174, "fila": "3", "codigo": "SC-024", "estado": "LIBRE", "numero": "24", "columna": "4", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
28	\N	INSERT	espacios	175	\N	{"id": 175, "fila": "3", "codigo": "SC-025", "estado": "LIBRE", "numero": "25", "columna": "5", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
29	\N	INSERT	espacios	176	\N	{"id": 176, "fila": "3", "codigo": "SC-026", "estado": "LIBRE", "numero": "26", "columna": "6", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
30	\N	INSERT	espacios	177	\N	{"id": 177, "fila": "3", "codigo": "SC-027", "estado": "LIBRE", "numero": "27", "columna": "7", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
163	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 53}	\N	2026-04-11 21:07:12.740922
164	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 54}	\N	2026-04-11 21:07:12.740922
31	\N	INSERT	espacios	178	\N	{"id": 178, "fila": "3", "codigo": "SC-028", "estado": "LIBRE", "numero": "28", "columna": "8", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
32	\N	INSERT	espacios	179	\N	{"id": 179, "fila": "3", "codigo": "SC-029", "estado": "LIBRE", "numero": "29", "columna": "9", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
33	\N	INSERT	espacios	180	\N	{"id": 180, "fila": "3", "codigo": "SC-030", "estado": "LIBRE", "numero": "30", "columna": "10", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
34	\N	INSERT	espacios	181	\N	{"id": 181, "fila": "4", "codigo": "SC-031", "estado": "LIBRE", "numero": "31", "columna": "1", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
35	\N	INSERT	espacios	182	\N	{"id": 182, "fila": "4", "codigo": "SC-032", "estado": "LIBRE", "numero": "32", "columna": "2", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
36	\N	INSERT	espacios	183	\N	{"id": 183, "fila": "4", "codigo": "SC-033", "estado": "LIBRE", "numero": "33", "columna": "3", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
37	\N	INSERT	espacios	184	\N	{"id": 184, "fila": "4", "codigo": "SC-034", "estado": "LIBRE", "numero": "34", "columna": "4", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
38	\N	INSERT	espacios	185	\N	{"id": 185, "fila": "4", "codigo": "SC-035", "estado": "LIBRE", "numero": "35", "columna": "5", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
39	\N	INSERT	espacios	186	\N	{"id": 186, "fila": "4", "codigo": "SC-036", "estado": "LIBRE", "numero": "36", "columna": "6", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
40	\N	INSERT	espacios	187	\N	{"id": 187, "fila": "4", "codigo": "SC-037", "estado": "LIBRE", "numero": "37", "columna": "7", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
41	\N	INSERT	espacios	188	\N	{"id": 188, "fila": "4", "codigo": "SC-038", "estado": "LIBRE", "numero": "38", "columna": "8", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
42	\N	INSERT	espacios	189	\N	{"id": 189, "fila": "4", "codigo": "SC-039", "estado": "LIBRE", "numero": "39", "columna": "9", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
43	\N	INSERT	espacios	190	\N	{"id": 190, "fila": "4", "codigo": "SC-040", "estado": "LIBRE", "numero": "40", "columna": "10", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
44	\N	INSERT	espacios	191	\N	{"id": 191, "fila": "5", "codigo": "SC-041", "estado": "LIBRE", "numero": "41", "columna": "1", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
45	\N	INSERT	espacios	192	\N	{"id": 192, "fila": "5", "codigo": "SC-042", "estado": "LIBRE", "numero": "42", "columna": "2", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
46	\N	INSERT	espacios	193	\N	{"id": 193, "fila": "5", "codigo": "SC-043", "estado": "LIBRE", "numero": "43", "columna": "3", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
47	\N	INSERT	espacios	194	\N	{"id": 194, "fila": "5", "codigo": "SC-044", "estado": "LIBRE", "numero": "44", "columna": "4", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
48	\N	INSERT	espacios	195	\N	{"id": 195, "fila": "5", "codigo": "SC-045", "estado": "LIBRE", "numero": "45", "columna": "5", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
49	\N	INSERT	espacios	196	\N	{"id": 196, "fila": "5", "codigo": "SC-046", "estado": "LIBRE", "numero": "46", "columna": "6", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
50	\N	INSERT	espacios	197	\N	{"id": 197, "fila": "5", "codigo": "SC-047", "estado": "LIBRE", "numero": "47", "columna": "7", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
51	\N	INSERT	espacios	198	\N	{"id": 198, "fila": "5", "codigo": "SC-048", "estado": "LIBRE", "numero": "48", "columna": "8", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
52	\N	INSERT	espacios	199	\N	{"id": 199, "fila": "5", "codigo": "SC-049", "estado": "LIBRE", "numero": "49", "columna": "9", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
53	\N	INSERT	espacios	200	\N	{"id": 200, "fila": "5", "codigo": "SC-050", "estado": "LIBRE", "numero": "50", "columna": "10", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
54	\N	INSERT	espacios	201	\N	{"id": 201, "fila": "6", "codigo": "SC-051", "estado": "LIBRE", "numero": "51", "columna": "1", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
55	\N	INSERT	espacios	202	\N	{"id": 202, "fila": "6", "codigo": "SC-052", "estado": "LIBRE", "numero": "52", "columna": "2", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
56	\N	INSERT	espacios	203	\N	{"id": 203, "fila": "6", "codigo": "SC-053", "estado": "LIBRE", "numero": "53", "columna": "3", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
57	\N	INSERT	espacios	204	\N	{"id": 204, "fila": "6", "codigo": "SC-054", "estado": "LIBRE", "numero": "54", "columna": "4", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
58	\N	INSERT	espacios	205	\N	{"id": 205, "fila": "6", "codigo": "SC-055", "estado": "LIBRE", "numero": "55", "columna": "5", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
59	\N	INSERT	espacios	206	\N	{"id": 206, "fila": "6", "codigo": "SC-056", "estado": "LIBRE", "numero": "56", "columna": "6", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
165	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 55}	\N	2026-04-11 21:07:12.740922
60	\N	INSERT	espacios	207	\N	{"id": 207, "fila": "6", "codigo": "SC-057", "estado": "LIBRE", "numero": "57", "columna": "7", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
61	\N	INSERT	espacios	208	\N	{"id": 208, "fila": "6", "codigo": "SC-058", "estado": "LIBRE", "numero": "58", "columna": "8", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
62	\N	INSERT	espacios	209	\N	{"id": 209, "fila": "6", "codigo": "SC-059", "estado": "LIBRE", "numero": "59", "columna": "9", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
63	\N	INSERT	espacios	210	\N	{"id": 210, "fila": "6", "codigo": "SC-060", "estado": "LIBRE", "numero": "60", "columna": "10", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
64	\N	INSERT	espacios	211	\N	{"id": 211, "fila": "7", "codigo": "SC-061", "estado": "LIBRE", "numero": "61", "columna": "1", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
65	\N	INSERT	espacios	212	\N	{"id": 212, "fila": "7", "codigo": "SC-062", "estado": "LIBRE", "numero": "62", "columna": "2", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
66	\N	INSERT	espacios	213	\N	{"id": 213, "fila": "7", "codigo": "SC-063", "estado": "LIBRE", "numero": "63", "columna": "3", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
67	\N	INSERT	espacios	214	\N	{"id": 214, "fila": "7", "codigo": "SC-064", "estado": "LIBRE", "numero": "64", "columna": "4", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
68	\N	INSERT	espacios	215	\N	{"id": 215, "fila": "7", "codigo": "SC-065", "estado": "LIBRE", "numero": "65", "columna": "5", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
69	\N	INSERT	espacios	216	\N	{"id": 216, "fila": "7", "codigo": "SC-066", "estado": "LIBRE", "numero": "66", "columna": "6", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
70	\N	INSERT	espacios	217	\N	{"id": 217, "fila": "7", "codigo": "SC-067", "estado": "LIBRE", "numero": "67", "columna": "7", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
71	\N	INSERT	espacios	218	\N	{"id": 218, "fila": "7", "codigo": "SC-068", "estado": "LIBRE", "numero": "68", "columna": "8", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
72	\N	INSERT	espacios	219	\N	{"id": 219, "fila": "7", "codigo": "SC-069", "estado": "LIBRE", "numero": "69", "columna": "9", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
73	\N	INSERT	espacios	220	\N	{"id": 220, "fila": "7", "codigo": "SC-070", "estado": "LIBRE", "numero": "70", "columna": "10", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
74	\N	INSERT	espacios	221	\N	{"id": 221, "fila": "8", "codigo": "SC-071", "estado": "LIBRE", "numero": "71", "columna": "1", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
75	\N	INSERT	espacios	222	\N	{"id": 222, "fila": "8", "codigo": "SC-072", "estado": "LIBRE", "numero": "72", "columna": "2", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
76	\N	INSERT	espacios	223	\N	{"id": 223, "fila": "8", "codigo": "SC-073", "estado": "LIBRE", "numero": "73", "columna": "3", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
77	\N	INSERT	espacios	224	\N	{"id": 224, "fila": "8", "codigo": "SC-074", "estado": "LIBRE", "numero": "74", "columna": "4", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
78	\N	INSERT	espacios	225	\N	{"id": 225, "fila": "8", "codigo": "SC-075", "estado": "LIBRE", "numero": "75", "columna": "5", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
79	\N	INSERT	espacios	226	\N	{"id": 226, "fila": "8", "codigo": "SC-076", "estado": "LIBRE", "numero": "76", "columna": "6", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
80	\N	INSERT	espacios	227	\N	{"id": 227, "fila": "8", "codigo": "SC-077", "estado": "LIBRE", "numero": "77", "columna": "7", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
81	\N	INSERT	espacios	228	\N	{"id": 228, "fila": "8", "codigo": "SC-078", "estado": "LIBRE", "numero": "78", "columna": "8", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
82	\N	INSERT	espacios	229	\N	{"id": 229, "fila": "8", "codigo": "SC-079", "estado": "LIBRE", "numero": "79", "columna": "9", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
83	\N	INSERT	espacios	230	\N	{"id": 230, "fila": "8", "codigo": "SC-080", "estado": "LIBRE", "numero": "80", "columna": "10", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
84	\N	INSERT	espacios	231	\N	{"id": 231, "fila": "9", "codigo": "SC-081", "estado": "LIBRE", "numero": "81", "columna": "1", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
85	\N	INSERT	espacios	232	\N	{"id": 232, "fila": "9", "codigo": "SC-082", "estado": "LIBRE", "numero": "82", "columna": "2", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
86	\N	INSERT	espacios	233	\N	{"id": 233, "fila": "9", "codigo": "SC-083", "estado": "LIBRE", "numero": "83", "columna": "3", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
87	\N	INSERT	espacios	234	\N	{"id": 234, "fila": "9", "codigo": "SC-084", "estado": "LIBRE", "numero": "84", "columna": "4", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
88	\N	INSERT	espacios	235	\N	{"id": 235, "fila": "9", "codigo": "SC-085", "estado": "LIBRE", "numero": "85", "columna": "5", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
166	\N	UPDATE	usuarios	\N	\N	{"ultimoLogin": "2026-04-12T02:25:44.822Z"}	\N	2026-04-11 21:25:44.828059
89	\N	INSERT	espacios	236	\N	{"id": 236, "fila": "9", "codigo": "SC-086", "estado": "LIBRE", "numero": "86", "columna": "6", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
90	\N	INSERT	espacios	237	\N	{"id": 237, "fila": "9", "codigo": "SC-087", "estado": "LIBRE", "numero": "87", "columna": "7", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
91	\N	INSERT	espacios	238	\N	{"id": 238, "fila": "9", "codigo": "SC-088", "estado": "LIBRE", "numero": "88", "columna": "8", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
92	\N	INSERT	espacios	239	\N	{"id": 239, "fila": "9", "codigo": "SC-089", "estado": "LIBRE", "numero": "89", "columna": "9", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
93	\N	INSERT	espacios	240	\N	{"id": 240, "fila": "9", "codigo": "SC-090", "estado": "LIBRE", "numero": "90", "columna": "10", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
94	\N	INSERT	espacios	241	\N	{"id": 241, "fila": "10", "codigo": "SC-091", "estado": "LIBRE", "numero": "91", "columna": "1", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
95	\N	INSERT	espacios	242	\N	{"id": 242, "fila": "10", "codigo": "SC-092", "estado": "LIBRE", "numero": "92", "columna": "2", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
96	\N	INSERT	espacios	243	\N	{"id": 243, "fila": "10", "codigo": "SC-093", "estado": "LIBRE", "numero": "93", "columna": "3", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
97	\N	INSERT	espacios	244	\N	{"id": 244, "fila": "10", "codigo": "SC-094", "estado": "LIBRE", "numero": "94", "columna": "4", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
98	\N	INSERT	espacios	245	\N	{"id": 245, "fila": "10", "codigo": "SC-095", "estado": "LIBRE", "numero": "95", "columna": "5", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
99	\N	INSERT	espacios	246	\N	{"id": 246, "fila": "10", "codigo": "SC-096", "estado": "LIBRE", "numero": "96", "columna": "6", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
100	\N	INSERT	espacios	247	\N	{"id": 247, "fila": "10", "codigo": "SC-097", "estado": "LIBRE", "numero": "97", "columna": "7", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
101	\N	INSERT	espacios	248	\N	{"id": 248, "fila": "10", "codigo": "SC-098", "estado": "LIBRE", "numero": "98", "columna": "8", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
102	\N	INSERT	espacios	249	\N	{"id": 249, "fila": "10", "codigo": "SC-099", "estado": "LIBRE", "numero": "99", "columna": "9", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
103	\N	INSERT	espacios	250	\N	{"id": 250, "fila": "10", "codigo": "SC-100", "estado": "LIBRE", "numero": "100", "columna": "10", "sectorId": 9, "tipoEspacio": "FOSA", "coordenadasLat": null, "coordenadasLng": null}	\N	2026-04-11 13:23:02.865514
104	\N	UPDATE	usuarios	\N	\N	{"ultimoLogin": "2026-04-11T20:48:42.323Z"}	\N	2026-04-11 15:48:42.339355
105	\N	UPDATE	usuarios	\N	\N	{"ultimoLogin": "2026-04-12T01:27:30.762Z"}	\N	2026-04-11 20:27:30.781699
106	\N	UPDATE	pagos	4	{"id": 4, "estado": "PENDIENTE", "titular": {"id": 8}, "usuario": {"id": 1}, "detalles": [{"id": 3}], "fechaPago": "2026-04-07T15:50:39.395Z", "titularId": 8, "usuarioId": 1, "inhumacion": {"id": 8}, "metodoPago": "EFECTIVO", "montoTotal": "1000.00", "codigoRecibo": "REC-202604-000004", "inhumacionId": 8, "observaciones": "Pago pendiente por servicio de inhumación - inhymacion persona mayor "}	{"id": 4, "estado": "PAGADO", "titular": {"id": 8, "dni": "78945612", "email": "luna@gmail.com", "nombres": "luna lunera", "telefono": "978945614", "apellidos": "casca velera", "direccion": "avenida siempre viva 2"}, "usuario": {"id": 1, "email": "sistemas@municipio.gob.pe", "rolId": 1, "activo": true, "username": "admin", "createdAt": "2025-12-07T23:37:59.499Z", "updatedAt": "2026-04-12T01:27:30.771Z", "ultimoLogin": "2026-04-12T01:27:30.762Z", "passwordHash": "$2b$10$0jVFke.Y2/e/i4M9AmJay.hkqmTA6qGObUEVQDwK1cK9mfoHGVzRS", "nombreCompleto": "Administrador Municipal"}, "detalles": [{"id": 3, "pagoId": 4, "cantidad": 1, "concepto": {"id": 4, "activo": true, "nombre": "inhymacion persona mayor ", "precioBase": "1000.00", "esPeriodico": false}, "subtotal": "1000.00", "conceptoId": 4}], "fechaPago": "2026-04-12T01:30:22.828Z", "titularId": 8, "usuarioId": 1, "inhumacion": {"id": 8, "estado": "ACTIVO", "difunto": {"id": 10, "dni": "85469857", "sexo": "F", "nombres": "raul", "apellidos": "rojas rojas", "causaMuerte": "nose", "actaDefuncion": "78974586", "observaciones": "ninguna ", "fechaDefuncion": "2026-04-02", "fechaNacimiento": "2020-02-01"}, "difuntoId": 10, "espacioId": 66, "titularId": 8, "numeroActa": "78974586", "observaciones": "ninguna", "tipoConcesion": "PERPETUA", "horaInhumacion": "15:00:00", "fechaInhumacion": "2026-04-07", "fechaVencimiento": null}, "metodoPago": "EFECTIVO", "montoTotal": "1000.00", "codigoRecibo": "REC-202604-000004", "inhumacionId": 8, "observaciones": "Pago pendiente por servicio de inhumación - inhymacion persona mayor "}	\N	2026-04-11 20:30:22.943922
107	\N	UPDATE	pagos	4	{"id": 4, "estado": "PAGADO", "titular": {"id": 8}, "usuario": {"id": 1}, "detalles": [{"id": 3}], "fechaPago": "2026-04-12T01:30:22.828Z", "titularId": 8, "usuarioId": 1, "inhumacion": {"id": 8}, "metodoPago": "EFECTIVO", "montoTotal": "1000.00", "codigoRecibo": "REC-202604-000004", "inhumacionId": 8, "observaciones": "Pago pendiente por servicio de inhumación - inhymacion persona mayor "}	{"id": 4, "estado": "PAGADO", "titular": {"id": 8, "dni": "78945612", "email": "luna@gmail.com", "nombres": "luna lunera", "telefono": "978945614", "apellidos": "casca velera", "direccion": "avenida siempre viva 2"}, "usuario": {"id": 1, "email": "sistemas@municipio.gob.pe", "rolId": 1, "activo": true, "username": "admin", "createdAt": "2025-12-07T23:37:59.499Z", "updatedAt": "2026-04-12T01:27:30.771Z", "ultimoLogin": "2026-04-12T01:27:30.762Z", "passwordHash": "$2b$10$0jVFke.Y2/e/i4M9AmJay.hkqmTA6qGObUEVQDwK1cK9mfoHGVzRS", "nombreCompleto": "Administrador Municipal"}, "detalles": [{"id": 3, "pagoId": 4, "cantidad": 1, "concepto": {"id": 4, "activo": true, "nombre": "inhymacion persona mayor ", "precioBase": "1000.00", "esPeriodico": false}, "subtotal": "1000.00", "conceptoId": 4}], "fechaPago": "2026-04-12T01:30:27.732Z", "titularId": 8, "usuarioId": 1, "inhumacion": {"id": 8, "estado": "ACTIVO", "difunto": {"id": 10, "dni": "85469857", "sexo": "F", "nombres": "raul", "apellidos": "rojas rojas", "causaMuerte": "nose", "actaDefuncion": "78974586", "observaciones": "ninguna ", "fechaDefuncion": "2026-04-02", "fechaNacimiento": "2020-02-01"}, "difuntoId": 10, "espacioId": 66, "titularId": 8, "numeroActa": "78974586", "observaciones": "ninguna", "tipoConcesion": "PERPETUA", "horaInhumacion": "15:00:00", "fechaInhumacion": "2026-04-07", "fechaVencimiento": null}, "metodoPago": "EFECTIVO", "montoTotal": "1000.00", "codigoRecibo": "REC-202604-000004", "inhumacionId": 8, "observaciones": "Pago pendiente por servicio de inhumación - inhymacion persona mayor "}	\N	2026-04-11 20:30:27.752884
167	\N	UPDATE	usuarios	\N	\N	{"ultimoLogin": "2026-04-12T02:26:35.084Z"}	\N	2026-04-11 21:26:35.093844
108	\N	UPDATE	pagos	4	{"id": 4, "estado": "PAGADO", "titular": {"id": 8}, "usuario": {"id": 1}, "detalles": [{"id": 3}], "fechaPago": "2026-04-12T01:30:27.732Z", "titularId": 8, "usuarioId": 1, "inhumacion": {"id": 8}, "metodoPago": "EFECTIVO", "montoTotal": "1000.00", "codigoRecibo": "REC-202604-000004", "inhumacionId": 8, "observaciones": "Pago pendiente por servicio de inhumación - inhymacion persona mayor "}	{"id": 4, "estado": "PAGADO", "titular": {"id": 8, "dni": "78945612", "email": "luna@gmail.com", "nombres": "luna lunera", "telefono": "978945614", "apellidos": "casca velera", "direccion": "avenida siempre viva 2"}, "usuario": {"id": 1, "email": "sistemas@municipio.gob.pe", "rolId": 1, "activo": true, "username": "admin", "createdAt": "2025-12-07T23:37:59.499Z", "updatedAt": "2026-04-12T01:27:30.771Z", "ultimoLogin": "2026-04-12T01:27:30.762Z", "passwordHash": "$2b$10$0jVFke.Y2/e/i4M9AmJay.hkqmTA6qGObUEVQDwK1cK9mfoHGVzRS", "nombreCompleto": "Administrador Municipal"}, "detalles": [{"id": 3, "pagoId": 4, "cantidad": 1, "concepto": {"id": 4, "activo": true, "nombre": "inhymacion persona mayor ", "precioBase": "1000.00", "esPeriodico": false}, "subtotal": "1000.00", "conceptoId": 4}], "fechaPago": "2026-04-12T01:30:30.545Z", "titularId": 8, "usuarioId": 1, "inhumacion": {"id": 8, "estado": "ACTIVO", "difunto": {"id": 10, "dni": "85469857", "sexo": "F", "nombres": "raul", "apellidos": "rojas rojas", "causaMuerte": "nose", "actaDefuncion": "78974586", "observaciones": "ninguna ", "fechaDefuncion": "2026-04-02", "fechaNacimiento": "2020-02-01"}, "difuntoId": 10, "espacioId": 66, "titularId": 8, "numeroActa": "78974586", "observaciones": "ninguna", "tipoConcesion": "PERPETUA", "horaInhumacion": "15:00:00", "fechaInhumacion": "2026-04-07", "fechaVencimiento": null}, "metodoPago": "EFECTIVO", "montoTotal": "1000.00", "codigoRecibo": "REC-202604-000004", "inhumacionId": 8, "observaciones": "Pago pendiente por servicio de inhumación - inhymacion persona mayor "}	\N	2026-04-11 20:30:30.567161
109	\N	UPDATE	pagos	4	{"id": 4, "estado": "PAGADO", "titular": {"id": 8}, "usuario": {"id": 1}, "detalles": [{"id": 3}], "fechaPago": "2026-04-12T01:30:30.545Z", "titularId": 8, "usuarioId": 1, "inhumacion": {"id": 8}, "metodoPago": "EFECTIVO", "montoTotal": "1000.00", "codigoRecibo": "REC-202604-000004", "inhumacionId": 8, "observaciones": "Pago pendiente por servicio de inhumación - inhymacion persona mayor "}	{"id": 4, "estado": "PAGADO", "titular": {"id": 8, "dni": "78945612", "email": "luna@gmail.com", "nombres": "luna lunera", "telefono": "978945614", "apellidos": "casca velera", "direccion": "avenida siempre viva 2"}, "usuario": {"id": 1, "email": "sistemas@municipio.gob.pe", "rolId": 1, "activo": true, "username": "admin", "createdAt": "2025-12-07T23:37:59.499Z", "updatedAt": "2026-04-12T01:27:30.771Z", "ultimoLogin": "2026-04-12T01:27:30.762Z", "passwordHash": "$2b$10$0jVFke.Y2/e/i4M9AmJay.hkqmTA6qGObUEVQDwK1cK9mfoHGVzRS", "nombreCompleto": "Administrador Municipal"}, "detalles": [{"id": 3, "pagoId": 4, "cantidad": 1, "concepto": {"id": 4, "activo": true, "nombre": "inhymacion persona mayor ", "precioBase": "1000.00", "esPeriodico": false}, "subtotal": "1000.00", "conceptoId": 4}], "fechaPago": "2026-04-12T01:30:33.346Z", "titularId": 8, "usuarioId": 1, "inhumacion": {"id": 8, "estado": "ACTIVO", "difunto": {"id": 10, "dni": "85469857", "sexo": "F", "nombres": "raul", "apellidos": "rojas rojas", "causaMuerte": "nose", "actaDefuncion": "78974586", "observaciones": "ninguna ", "fechaDefuncion": "2026-04-02", "fechaNacimiento": "2020-02-01"}, "difuntoId": 10, "espacioId": 66, "titularId": 8, "numeroActa": "78974586", "observaciones": "ninguna", "tipoConcesion": "PERPETUA", "horaInhumacion": "15:00:00", "fechaInhumacion": "2026-04-07", "fechaVencimiento": null}, "metodoPago": "EFECTIVO", "montoTotal": "1000.00", "codigoRecibo": "REC-202604-000004", "inhumacionId": 8, "observaciones": "Pago pendiente por servicio de inhumación - inhymacion persona mayor "}	\N	2026-04-11 20:30:33.367747
110	\N	UPDATE	pagos	2	{"id": 2, "estado": "PENDIENTE", "titular": {"id": 1}, "usuario": {"id": 1}, "detalles": [], "fechaPago": "2026-03-22T19:16:48.526Z", "titularId": 1, "usuarioId": 1, "inhumacion": {"id": null}, "metodoPago": "EFECTIVO", "montoTotal": "1000.00", "codigoRecibo": "REC-202603-000002", "inhumacionId": null, "observaciones": null}	{"id": 2, "estado": "PAGADO", "titular": {"id": 1, "dni": "12345678", "email": "admin@cementerio.gob.pe", "nombres": "perosona ", "telefono": "123456788", "apellidos": "apelli1 ", "direccion": "lass rtina s"}, "usuario": {"id": 1, "email": "sistemas@municipio.gob.pe", "rolId": 1, "activo": true, "username": "admin", "createdAt": "2025-12-07T23:37:59.499Z", "updatedAt": "2026-04-12T01:27:30.771Z", "ultimoLogin": "2026-04-12T01:27:30.762Z", "passwordHash": "$2b$10$0jVFke.Y2/e/i4M9AmJay.hkqmTA6qGObUEVQDwK1cK9mfoHGVzRS", "nombreCompleto": "Administrador Municipal"}, "detalles": [], "fechaPago": "2026-04-12T01:34:13.858Z", "titularId": 1, "usuarioId": 1, "inhumacion": null, "metodoPago": "EFECTIVO", "montoTotal": "1000.00", "codigoRecibo": "REC-202603-000002", "inhumacionId": null, "observaciones": null}	\N	2026-04-11 20:34:13.985856
111	\N	UPDATE	pagos	4	{"id": 4, "estado": "PAGADO", "titular": {"id": 8}, "usuario": {"id": 1}, "detalles": [{"id": 3}], "fechaPago": "2026-04-12T01:30:33.346Z", "titularId": 8, "usuarioId": 1, "inhumacion": {"id": 8}, "metodoPago": "EFECTIVO", "montoTotal": "1000.00", "codigoRecibo": "REC-202604-000004", "inhumacionId": 8, "observaciones": "Pago pendiente por servicio de inhumación - inhymacion persona mayor "}	{"id": 4, "estado": "ANULADO", "titular": {"id": 8, "dni": "78945612", "email": "luna@gmail.com", "nombres": "luna lunera", "telefono": "978945614", "apellidos": "casca velera", "direccion": "avenida siempre viva 2"}, "usuario": {"id": 1, "email": "sistemas@municipio.gob.pe", "rolId": 1, "activo": true, "username": "admin", "createdAt": "2025-12-07T23:37:59.499Z", "updatedAt": "2026-04-12T01:27:30.771Z", "ultimoLogin": "2026-04-12T01:27:30.762Z", "passwordHash": "$2b$10$0jVFke.Y2/e/i4M9AmJay.hkqmTA6qGObUEVQDwK1cK9mfoHGVzRS", "nombreCompleto": "Administrador Municipal"}, "detalles": [{"id": 3, "pagoId": 4, "cantidad": 1, "concepto": {"id": 4, "activo": true, "nombre": "inhymacion persona mayor ", "precioBase": "1000.00", "esPeriodico": false}, "subtotal": "1000.00", "conceptoId": 4}], "fechaPago": "2026-04-12T01:30:33.346Z", "titularId": 8, "usuarioId": 1, "inhumacion": {"id": 8, "estado": "ACTIVO", "difunto": {"id": 10, "dni": "85469857", "sexo": "F", "nombres": "raul", "apellidos": "rojas rojas", "causaMuerte": "nose", "actaDefuncion": "78974586", "observaciones": "ninguna ", "fechaDefuncion": "2026-04-02", "fechaNacimiento": "2020-02-01"}, "difuntoId": 10, "espacioId": 66, "titularId": 8, "numeroActa": "78974586", "observaciones": "ninguna", "tipoConcesion": "PERPETUA", "horaInhumacion": "15:00:00", "fechaInhumacion": "2026-04-07", "fechaVencimiento": null}, "metodoPago": "EFECTIVO", "montoTotal": "1000.00", "codigoRecibo": "REC-202604-000004", "inhumacionId": 8, "observaciones": "Pago pendiente por servicio de inhumación - inhymacion persona mayor "}	\N	2026-04-11 20:34:27.903255
168	\N	DELETE	rol_permisos	\N	\N	\N	\N	2026-04-11 21:27:48.416916
169	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 15}	\N	2026-04-11 21:27:48.416916
170	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 1}	\N	2026-04-11 21:27:48.416916
171	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 4}	\N	2026-04-11 21:27:48.416916
172	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 24}	\N	2026-04-11 21:27:48.416916
173	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 28}	\N	2026-04-11 21:27:48.416916
174	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 32}	\N	2026-04-11 21:27:48.416916
175	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 6}	\N	2026-04-11 21:27:48.416916
176	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 7}	\N	2026-04-11 21:27:48.416916
177	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 56}	\N	2026-04-11 21:27:48.416916
178	\N	INSERT	permisos	63	\N	{"id": 63, "slug": "registrar_cobro", "descripcion": "Registrar el cobro efectivo de un pago pendiente"}	\N	2026-04-11 21:43:24.318319
112	\N	UPDATE	pagos	4	{"id": 4, "estado": "ANULADO", "titular": {"id": 8}, "usuario": {"id": 1}, "detalles": [{"id": 3}], "fechaPago": "2026-04-12T01:30:33.346Z", "titularId": 8, "usuarioId": 1, "inhumacion": {"id": 8}, "metodoPago": "EFECTIVO", "montoTotal": "1000.00", "codigoRecibo": "REC-202604-000004", "inhumacionId": 8, "observaciones": "Pago pendiente por servicio de inhumación - inhymacion persona mayor "}	{"id": 4, "estado": "PENDIENTE", "titular": {"id": 8, "dni": "78945612", "email": "luna@gmail.com", "nombres": "luna lunera", "telefono": "978945614", "apellidos": "casca velera", "direccion": "avenida siempre viva 2"}, "usuario": {"id": 1, "email": "sistemas@municipio.gob.pe", "rolId": 1, "activo": true, "username": "admin", "createdAt": "2025-12-07T23:37:59.499Z", "updatedAt": "2026-04-12T01:27:30.771Z", "ultimoLogin": "2026-04-12T01:27:30.762Z", "passwordHash": "$2b$10$0jVFke.Y2/e/i4M9AmJay.hkqmTA6qGObUEVQDwK1cK9mfoHGVzRS", "nombreCompleto": "Administrador Municipal"}, "detalles": [{"id": 3, "pagoId": 4, "cantidad": 1, "concepto": {"id": 4, "activo": true, "nombre": "inhymacion persona mayor ", "precioBase": "1000.00", "esPeriodico": false}, "subtotal": "1000.00", "conceptoId": 4}], "fechaPago": "2026-04-12T01:30:33.346Z", "titularId": 8, "usuarioId": 1, "inhumacion": {"id": 8, "estado": "ACTIVO", "difunto": {"id": 10, "dni": "85469857", "sexo": "F", "nombres": "raul", "apellidos": "rojas rojas", "causaMuerte": "nose", "actaDefuncion": "78974586", "observaciones": "ninguna ", "fechaDefuncion": "2026-04-02", "fechaNacimiento": "2020-02-01"}, "difuntoId": 10, "espacioId": 66, "titularId": 8, "numeroActa": "78974586", "observaciones": "ninguna", "tipoConcesion": "PERPETUA", "horaInhumacion": "15:00:00", "fechaInhumacion": "2026-04-07", "fechaVencimiento": null}, "metodoPago": "EFECTIVO", "montoTotal": "1000.00", "codigoRecibo": "REC-202604-000004", "inhumacionId": 8, "observaciones": "Pago pendiente por servicio de inhumación - inhymacion persona mayor "}	\N	2026-04-11 20:41:54.551663
113	\N	INSERT	permisos	60	\N	{"id": 60, "slug": "anular_inhumaciones", "descripcion": "Anular inhumaciones (libera el espacio)"}	\N	2026-04-11 20:44:41.312318
114	\N	INSERT	permisos	61	\N	{"id": 61, "slug": "revertir_anulacion_inhumaciones", "descripcion": "Revertir la anulación de una inhumación"}	\N	2026-04-11 20:44:41.329984
115	\N	INSERT	permisos	62	\N	{"id": 62, "slug": "revertir_anulacion_pagos", "descripcion": "Revertir la anulación de un pago"}	\N	2026-04-11 20:44:41.36375
116	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 60}	\N	2026-04-11 20:44:41.480456
117	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 61}	\N	2026-04-11 20:44:41.490471
118	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 62}	\N	2026-04-11 20:44:41.500653
119	\N	UPDATE	usuarios	\N	\N	{"ultimoLogin": "2026-04-12T02:06:52.935Z"}	\N	2026-04-11 21:06:52.951486
120	\N	DELETE	rol_permisos	\N	\N	\N	\N	2026-04-11 21:07:12.740922
121	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 15}	\N	2026-04-11 21:07:12.740922
122	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 1}	\N	2026-04-11 21:07:12.740922
123	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 2}	\N	2026-04-11 21:07:12.740922
124	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 18}	\N	2026-04-11 21:07:12.740922
125	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 3}	\N	2026-04-11 21:07:12.740922
126	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 4}	\N	2026-04-11 21:07:12.740922
127	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 5}	\N	2026-04-11 21:07:12.740922
128	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 22}	\N	2026-04-11 21:07:12.740922
129	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 23}	\N	2026-04-11 21:07:12.740922
130	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 60}	\N	2026-04-11 21:07:12.740922
131	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 61}	\N	2026-04-11 21:07:12.740922
132	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 24}	\N	2026-04-11 21:07:12.740922
133	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 25}	\N	2026-04-11 21:07:12.740922
134	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 26}	\N	2026-04-11 21:07:12.740922
135	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 27}	\N	2026-04-11 21:07:12.740922
136	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 28}	\N	2026-04-11 21:07:12.740922
137	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 29}	\N	2026-04-11 21:07:12.740922
138	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 30}	\N	2026-04-11 21:07:12.740922
139	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 31}	\N	2026-04-11 21:07:12.740922
140	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 32}	\N	2026-04-11 21:07:12.740922
141	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 33}	\N	2026-04-11 21:07:12.740922
142	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 34}	\N	2026-04-11 21:07:12.740922
143	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 35}	\N	2026-04-11 21:07:12.740922
144	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 6}	\N	2026-04-11 21:07:12.740922
145	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 7}	\N	2026-04-11 21:07:12.740922
146	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 38}	\N	2026-04-11 21:07:12.740922
147	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 39}	\N	2026-04-11 21:07:12.740922
148	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 8}	\N	2026-04-11 21:07:12.740922
149	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 62}	\N	2026-04-11 21:07:12.740922
150	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 56}	\N	2026-04-11 21:07:12.740922
151	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 57}	\N	2026-04-11 21:07:12.740922
152	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 58}	\N	2026-04-11 21:07:12.740922
153	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 59}	\N	2026-04-11 21:07:12.740922
154	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 44}	\N	2026-04-11 21:07:12.740922
155	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 45}	\N	2026-04-11 21:07:12.740922
156	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 46}	\N	2026-04-11 21:07:12.740922
157	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 47}	\N	2026-04-11 21:07:12.740922
158	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 48}	\N	2026-04-11 21:07:12.740922
159	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 49}	\N	2026-04-11 21:07:12.740922
160	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 50}	\N	2026-04-11 21:07:12.740922
161	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 51}	\N	2026-04-11 21:07:12.740922
162	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 52}	\N	2026-04-11 21:07:12.740922
179	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 9}	\N	2026-04-11 21:43:24.360932
180	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 10}	\N	2026-04-11 21:43:24.36833
181	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 11}	\N	2026-04-11 21:43:24.37504
182	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 12}	\N	2026-04-11 21:43:24.382049
183	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 13}	\N	2026-04-11 21:43:24.391806
184	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 14}	\N	2026-04-11 21:43:24.397341
185	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 40}	\N	2026-04-11 21:43:24.421827
186	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 41}	\N	2026-04-11 21:43:24.428106
187	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 42}	\N	2026-04-11 21:43:24.434656
188	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 43}	\N	2026-04-11 21:43:24.440439
189	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 63}	\N	2026-04-11 21:43:24.469406
190	\N	DELETE	rol_permisos	\N	\N	\N	\N	2026-04-11 21:45:18.592525
191	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 15}	\N	2026-04-11 21:45:18.592525
192	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 1}	\N	2026-04-11 21:45:18.592525
193	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 4}	\N	2026-04-11 21:45:18.592525
194	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 24}	\N	2026-04-11 21:45:18.592525
195	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 28}	\N	2026-04-11 21:45:18.592525
196	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 32}	\N	2026-04-11 21:45:18.592525
197	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 6}	\N	2026-04-11 21:45:18.592525
198	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 7}	\N	2026-04-11 21:45:18.592525
199	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 38}	\N	2026-04-11 21:45:18.592525
200	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 39}	\N	2026-04-11 21:45:18.592525
201	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 8}	\N	2026-04-11 21:45:18.592525
202	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 62}	\N	2026-04-11 21:45:18.592525
203	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 63}	\N	2026-04-11 21:45:18.592525
204	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 56}	\N	2026-04-11 21:45:18.592525
205	\N	DELETE	rol_permisos	\N	\N	\N	\N	2026-04-11 21:45:51.133697
206	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 15}	\N	2026-04-11 21:45:51.133697
207	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 1}	\N	2026-04-11 21:45:51.133697
208	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 4}	\N	2026-04-11 21:45:51.133697
209	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 24}	\N	2026-04-11 21:45:51.133697
210	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 28}	\N	2026-04-11 21:45:51.133697
211	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 32}	\N	2026-04-11 21:45:51.133697
212	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 6}	\N	2026-04-11 21:45:51.133697
213	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 7}	\N	2026-04-11 21:45:51.133697
214	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 38}	\N	2026-04-11 21:45:51.133697
215	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 39}	\N	2026-04-11 21:45:51.133697
216	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 8}	\N	2026-04-11 21:45:51.133697
217	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 62}	\N	2026-04-11 21:45:51.133697
218	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 56}	\N	2026-04-11 21:45:51.133697
219	\N	DELETE	rol_permisos	\N	\N	\N	\N	2026-04-11 21:45:54.664182
220	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 15}	\N	2026-04-11 21:45:54.664182
221	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 1}	\N	2026-04-11 21:45:54.664182
222	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 4}	\N	2026-04-11 21:45:54.664182
223	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 24}	\N	2026-04-11 21:45:54.664182
224	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 28}	\N	2026-04-11 21:45:54.664182
225	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 32}	\N	2026-04-11 21:45:54.664182
226	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 6}	\N	2026-04-11 21:45:54.664182
227	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 7}	\N	2026-04-11 21:45:54.664182
228	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 38}	\N	2026-04-11 21:45:54.664182
229	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 39}	\N	2026-04-11 21:45:54.664182
230	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 8}	\N	2026-04-11 21:45:54.664182
231	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 62}	\N	2026-04-11 21:45:54.664182
232	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 63}	\N	2026-04-11 21:45:54.664182
233	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 56}	\N	2026-04-11 21:45:54.664182
234	\N	DELETE	rol_permisos	\N	\N	\N	\N	2026-04-11 21:45:57.969633
235	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 15}	\N	2026-04-11 21:45:57.969633
236	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 1}	\N	2026-04-11 21:45:57.969633
237	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 4}	\N	2026-04-11 21:45:57.969633
238	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 24}	\N	2026-04-11 21:45:57.969633
239	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 28}	\N	2026-04-11 21:45:57.969633
240	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 32}	\N	2026-04-11 21:45:57.969633
241	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 6}	\N	2026-04-11 21:45:57.969633
242	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 7}	\N	2026-04-11 21:45:57.969633
243	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 38}	\N	2026-04-11 21:45:57.969633
244	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 39}	\N	2026-04-11 21:45:57.969633
245	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 8}	\N	2026-04-11 21:45:57.969633
246	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 62}	\N	2026-04-11 21:45:57.969633
247	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 56}	\N	2026-04-11 21:45:57.969633
248	\N	UPDATE	usuarios	\N	\N	{"ultimoLogin": "2026-04-12T02:47:53.477Z"}	\N	2026-04-11 21:47:53.493674
249	\N	UPDATE	usuarios	\N	\N	{"ultimoLogin": "2026-04-12T02:52:22.181Z"}	\N	2026-04-11 21:52:22.190736
250	\N	DELETE	rol_permisos	\N	\N	\N	\N	2026-04-11 21:52:47.905612
251	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 15}	\N	2026-04-11 21:52:47.905612
252	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 1}	\N	2026-04-11 21:52:47.905612
253	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 4}	\N	2026-04-11 21:52:47.905612
254	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 24}	\N	2026-04-11 21:52:47.905612
255	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 28}	\N	2026-04-11 21:52:47.905612
256	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 32}	\N	2026-04-11 21:52:47.905612
257	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 6}	\N	2026-04-11 21:52:47.905612
258	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 7}	\N	2026-04-11 21:52:47.905612
259	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 38}	\N	2026-04-11 21:52:47.905612
260	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 39}	\N	2026-04-11 21:52:47.905612
261	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 8}	\N	2026-04-11 21:52:47.905612
262	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 62}	\N	2026-04-11 21:52:47.905612
263	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 63}	\N	2026-04-11 21:52:47.905612
264	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 56}	\N	2026-04-11 21:52:47.905612
265	\N	DELETE	rol_permisos	\N	\N	\N	\N	2026-04-11 21:52:51.384221
266	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 15}	\N	2026-04-11 21:52:51.384221
267	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 1}	\N	2026-04-11 21:52:51.384221
268	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 4}	\N	2026-04-11 21:52:51.384221
269	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 24}	\N	2026-04-11 21:52:51.384221
270	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 28}	\N	2026-04-11 21:52:51.384221
271	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 32}	\N	2026-04-11 21:52:51.384221
272	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 6}	\N	2026-04-11 21:52:51.384221
273	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 7}	\N	2026-04-11 21:52:51.384221
274	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 38}	\N	2026-04-11 21:52:51.384221
275	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 39}	\N	2026-04-11 21:52:51.384221
276	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 8}	\N	2026-04-11 21:52:51.384221
277	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 62}	\N	2026-04-11 21:52:51.384221
278	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 63}	\N	2026-04-11 21:52:51.384221
279	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 56}	\N	2026-04-11 21:52:51.384221
280	\N	UPDATE	usuarios	\N	\N	{"ultimoLogin": "2026-04-12T02:53:01.673Z"}	\N	2026-04-11 21:53:01.682668
281	\N	DELETE	rol_permisos	\N	\N	\N	\N	2026-04-11 21:53:42.875577
282	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 15}	\N	2026-04-11 21:53:42.875577
283	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 1}	\N	2026-04-11 21:53:42.875577
284	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 2}	\N	2026-04-11 21:53:42.875577
285	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 18}	\N	2026-04-11 21:53:42.875577
286	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 3}	\N	2026-04-11 21:53:42.875577
287	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 4}	\N	2026-04-11 21:53:42.875577
288	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 5}	\N	2026-04-11 21:53:42.875577
289	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 22}	\N	2026-04-11 21:53:42.875577
290	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 23}	\N	2026-04-11 21:53:42.875577
291	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 60}	\N	2026-04-11 21:53:42.875577
292	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 61}	\N	2026-04-11 21:53:42.875577
293	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 24}	\N	2026-04-11 21:53:42.875577
294	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 25}	\N	2026-04-11 21:53:42.875577
295	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 26}	\N	2026-04-11 21:53:42.875577
296	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 27}	\N	2026-04-11 21:53:42.875577
297	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 28}	\N	2026-04-11 21:53:42.875577
298	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 29}	\N	2026-04-11 21:53:42.875577
299	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 30}	\N	2026-04-11 21:53:42.875577
300	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 31}	\N	2026-04-11 21:53:42.875577
301	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 32}	\N	2026-04-11 21:53:42.875577
302	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 33}	\N	2026-04-11 21:53:42.875577
303	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 34}	\N	2026-04-11 21:53:42.875577
304	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 35}	\N	2026-04-11 21:53:42.875577
305	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 6}	\N	2026-04-11 21:53:42.875577
306	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 7}	\N	2026-04-11 21:53:42.875577
307	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 38}	\N	2026-04-11 21:53:42.875577
308	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 39}	\N	2026-04-11 21:53:42.875577
309	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 8}	\N	2026-04-11 21:53:42.875577
310	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 62}	\N	2026-04-11 21:53:42.875577
311	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 63}	\N	2026-04-11 21:53:42.875577
312	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 56}	\N	2026-04-11 21:53:42.875577
313	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 57}	\N	2026-04-11 21:53:42.875577
314	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 58}	\N	2026-04-11 21:53:42.875577
315	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 59}	\N	2026-04-11 21:53:42.875577
316	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 44}	\N	2026-04-11 21:53:42.875577
317	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 45}	\N	2026-04-11 21:53:42.875577
318	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 46}	\N	2026-04-11 21:53:42.875577
319	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 47}	\N	2026-04-11 21:53:42.875577
320	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 48}	\N	2026-04-11 21:53:42.875577
321	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 49}	\N	2026-04-11 21:53:42.875577
322	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 50}	\N	2026-04-11 21:53:42.875577
323	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 51}	\N	2026-04-11 21:53:42.875577
324	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 52}	\N	2026-04-11 21:53:42.875577
325	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 53}	\N	2026-04-11 21:53:42.875577
326	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 54}	\N	2026-04-11 21:53:42.875577
327	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 55}	\N	2026-04-11 21:53:42.875577
328	\N	DELETE	rol_permisos	\N	\N	\N	\N	2026-04-11 21:54:10.942901
329	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 15}	\N	2026-04-11 21:54:10.942901
330	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 1}	\N	2026-04-11 21:54:10.942901
331	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 4}	\N	2026-04-11 21:54:10.942901
332	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 24}	\N	2026-04-11 21:54:10.942901
333	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 28}	\N	2026-04-11 21:54:10.942901
334	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 32}	\N	2026-04-11 21:54:10.942901
335	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 6}	\N	2026-04-11 21:54:10.942901
336	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 63}	\N	2026-04-11 21:54:10.942901
337	\N	INSERT	rol_permisos	\N	\N	{"rolId": 2, "permisoId": 56}	\N	2026-04-11 21:54:10.942901
338	\N	UPDATE	usuarios	\N	\N	{"ultimoLogin": "2026-04-12T02:54:22.312Z"}	\N	2026-04-11 21:54:22.321383
339	\N	UPDATE	usuarios	\N	\N	{"ultimoLogin": "2026-04-12T02:58:18.959Z"}	\N	2026-04-11 21:58:18.96926
340	\N	UPDATE	usuarios	\N	\N	{"ultimoLogin": "2026-04-12T03:08:21.225Z"}	\N	2026-04-11 22:08:21.245049
341	\N	INSERT	permisos	64	\N	{"id": 64, "slug": "gestionar_respaldos", "descripcion": "Gestionar y descargar copias de seguridad del sistema"}	\N	2026-04-11 22:24:07.510697
342	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 9}	\N	2026-04-11 22:24:07.552434
343	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 10}	\N	2026-04-11 22:24:07.560912
344	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 11}	\N	2026-04-11 22:24:07.568021
345	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 12}	\N	2026-04-11 22:24:07.575847
346	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 13}	\N	2026-04-11 22:24:07.587062
347	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 14}	\N	2026-04-11 22:24:07.593931
348	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 40}	\N	2026-04-11 22:24:07.630472
349	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 41}	\N	2026-04-11 22:24:07.639717
350	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 42}	\N	2026-04-11 22:24:07.649375
351	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 43}	\N	2026-04-11 22:24:07.655987
352	\N	INSERT	rol_permisos	\N	\N	{"rolId": 1, "permisoId": 64}	\N	2026-04-11 22:24:07.695431
353	\N	UPDATE	usuarios	\N	\N	{"ultimoLogin": "2026-04-12T03:26:00.813Z"}	\N	2026-04-11 22:26:00.82918
\.


--
-- Data for Name: conceptos_pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conceptos_pago (id, nombre, precio_base, es_periodico, activo) FROM stdin;
4	inhymacion persona mayor 	1000.00	f	t
3	inhymacion persona menor	500.00	f	t
1	Derecho de Inhumación (Nicho)	1000.00	f	f
6	inhumacion Donada	0.00	f	t
\.


--
-- Data for Name: detalle_pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalle_pagos (id, pago_id, concepto_id, cantidad, subtotal) FROM stdin;
1	1	4	1	1000.00
2	3	4	1	1000.00
3	4	4	1	1000.00
\.


--
-- Data for Name: difuntos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.difuntos (id, nombres, apellidos, dni, fecha_nacimiento, fecha_defuncion, acta_defuncion, sexo, causa_muerte, observaciones, titular_id) FROM stdin;
4	aaaaaaaaaaa	gggggggggg gggggggggggg	848956262	2025-01-01	2025-12-02	gggggg	F	rgrgrgrgrgr	rgrgrg	\N
6	JUAN CARLOS	CASAS ROCA	78456312	1978-12-19	2025-12-16	\N	M	\N	\N	\N
8	christian jose 	lezama velarde	78945612	2020-01-03	2026-03-21	gggggg	M	dddedd	deded	10
9	RAUL 	EQUIS YESETA	52467825	2020-02-01	2026-03-21	14578945	F	NATURAL	NINGUNA	10
3	aaaaaaaaaa cccccccc 	vvvvv bbbbb	12345789	2020-02-01	2025-12-02	xxxxxxxxxxx	F	xxxxxxxx	xxxxxxxxxx	\N
10	raul	rojas rojas	85469857	2020-02-01	2026-04-02	78974586	F	nose	ninguna 	8
\.


--
-- Data for Name: espacios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.espacios (id, sector_id, fila, columna, numero, tipo_espacio, estado, coordenadas_lat, coordenadas_lng, codigo, titular_id) FROM stdin;
64	6	1	4	4	NICHO	OCUPADO	\N	\N	SR-004	\N
67	6	2	1	7	NICHO	LIBRE	\N	\N	SR-007	\N
68	6	2	2	8	NICHO	LIBRE	\N	\N	SR-008	\N
69	6	2	3	9	NICHO	LIBRE	\N	\N	SR-009	\N
70	6	2	4	10	NICHO	LIBRE	\N	\N	SR-010	\N
71	6	2	5	11	NICHO	LIBRE	\N	\N	SR-011	\N
72	6	2	6	12	NICHO	LIBRE	\N	\N	SR-012	\N
73	6	3	1	13	NICHO	LIBRE	\N	\N	SR-013	\N
74	6	3	2	14	NICHO	LIBRE	\N	\N	SR-014	\N
75	6	3	3	15	NICHO	LIBRE	\N	\N	SR-015	\N
76	6	3	4	16	NICHO	LIBRE	\N	\N	SR-016	\N
77	6	3	5	17	NICHO	LIBRE	\N	\N	SR-017	\N
78	6	3	6	18	NICHO	LIBRE	\N	\N	SR-018	\N
79	6	4	1	19	NICHO	LIBRE	\N	\N	SR-019	\N
80	6	4	2	20	NICHO	LIBRE	\N	\N	SR-020	\N
81	6	4	3	21	NICHO	LIBRE	\N	\N	SR-021	\N
82	6	4	4	22	NICHO	LIBRE	\N	\N	SR-022	\N
83	6	4	5	23	NICHO	LIBRE	\N	\N	SR-023	\N
84	6	4	6	24	NICHO	LIBRE	\N	\N	SR-024	\N
85	6	5	1	25	NICHO	LIBRE	\N	\N	SR-025	\N
86	6	5	2	26	NICHO	LIBRE	\N	\N	SR-026	\N
87	6	5	3	27	NICHO	LIBRE	\N	\N	SR-027	\N
88	6	5	4	28	NICHO	LIBRE	\N	\N	SR-028	\N
89	6	5	5	29	NICHO	LIBRE	\N	\N	SR-029	\N
90	6	5	6	30	NICHO	LIBRE	\N	\N	SR-030	\N
62	6	1	2	2	NICHO	OCUPADO	\N	\N	SR-002	\N
61	6	1	1	1	NICHO	OCUPADO	\N	\N	SR-001	\N
65	6	1	5	5	NICHO	OCUPADO	\N	\N	SR-005	\N
91	7	1	1	1	NICHO	LIBRE	\N	\N	SP-001	\N
92	7	1	2	2	NICHO	LIBRE	\N	\N	SP-002	\N
93	7	1	3	3	NICHO	LIBRE	\N	\N	SP-003	\N
94	7	1	4	4	NICHO	LIBRE	\N	\N	SP-004	\N
95	7	1	5	5	NICHO	LIBRE	\N	\N	SP-005	\N
96	7	1	6	6	NICHO	LIBRE	\N	\N	SP-006	\N
97	7	2	1	7	NICHO	LIBRE	\N	\N	SP-007	\N
98	7	2	2	8	NICHO	LIBRE	\N	\N	SP-008	\N
99	7	2	3	9	NICHO	LIBRE	\N	\N	SP-009	\N
100	7	2	4	10	NICHO	LIBRE	\N	\N	SP-010	\N
101	7	2	5	11	NICHO	LIBRE	\N	\N	SP-011	\N
102	7	2	6	12	NICHO	LIBRE	\N	\N	SP-012	\N
103	7	3	1	13	NICHO	LIBRE	\N	\N	SP-013	\N
104	7	3	2	14	NICHO	LIBRE	\N	\N	SP-014	\N
105	7	3	3	15	NICHO	LIBRE	\N	\N	SP-015	\N
106	7	3	4	16	NICHO	LIBRE	\N	\N	SP-016	\N
107	7	3	5	17	NICHO	LIBRE	\N	\N	SP-017	\N
108	7	3	6	18	NICHO	LIBRE	\N	\N	SP-018	\N
109	7	4	1	19	NICHO	LIBRE	\N	\N	SP-019	\N
110	7	4	2	20	NICHO	LIBRE	\N	\N	SP-020	\N
111	7	4	3	21	NICHO	LIBRE	\N	\N	SP-021	\N
112	7	4	4	22	NICHO	LIBRE	\N	\N	SP-022	\N
113	7	4	5	23	NICHO	LIBRE	\N	\N	SP-023	\N
114	7	4	6	24	NICHO	LIBRE	\N	\N	SP-024	\N
115	7	5	1	25	NICHO	LIBRE	\N	\N	SP-025	\N
116	7	5	2	26	NICHO	LIBRE	\N	\N	SP-026	\N
117	7	5	3	27	NICHO	LIBRE	\N	\N	SP-027	\N
118	7	5	4	28	NICHO	LIBRE	\N	\N	SP-028	\N
119	7	5	5	29	NICHO	LIBRE	\N	\N	SP-029	\N
120	7	5	6	30	NICHO	LIBRE	\N	\N	SP-030	\N
63	6	1	3	3	NICHO	OCUPADO	\N	\N	SR-003	\N
121	8	1	1	1	NICHO	LIBRE	\N	\N	JP-001	\N
122	8	1	2	2	NICHO	LIBRE	\N	\N	JP-002	\N
123	8	1	3	3	NICHO	LIBRE	\N	\N	JP-003	\N
124	8	1	4	4	NICHO	LIBRE	\N	\N	JP-004	\N
125	8	1	5	5	NICHO	LIBRE	\N	\N	JP-005	\N
126	8	1	6	6	NICHO	LIBRE	\N	\N	JP-006	\N
127	8	2	1	7	NICHO	LIBRE	\N	\N	JP-007	\N
128	8	2	2	8	NICHO	LIBRE	\N	\N	JP-008	\N
129	8	2	3	9	NICHO	LIBRE	\N	\N	JP-009	\N
130	8	2	4	10	NICHO	LIBRE	\N	\N	JP-010	\N
131	8	2	5	11	NICHO	LIBRE	\N	\N	JP-011	\N
132	8	2	6	12	NICHO	LIBRE	\N	\N	JP-012	\N
133	8	3	1	13	NICHO	LIBRE	\N	\N	JP-013	\N
134	8	3	2	14	NICHO	LIBRE	\N	\N	JP-014	\N
135	8	3	3	15	NICHO	LIBRE	\N	\N	JP-015	\N
136	8	3	4	16	NICHO	LIBRE	\N	\N	JP-016	\N
137	8	3	5	17	NICHO	LIBRE	\N	\N	JP-017	\N
138	8	3	6	18	NICHO	LIBRE	\N	\N	JP-018	\N
139	8	4	1	19	NICHO	LIBRE	\N	\N	JP-019	\N
140	8	4	2	20	NICHO	LIBRE	\N	\N	JP-020	\N
141	8	4	3	21	NICHO	LIBRE	\N	\N	JP-021	\N
142	8	4	4	22	NICHO	LIBRE	\N	\N	JP-022	\N
143	8	4	5	23	NICHO	LIBRE	\N	\N	JP-023	\N
144	8	4	6	24	NICHO	LIBRE	\N	\N	JP-024	\N
145	8	5	1	25	NICHO	LIBRE	\N	\N	JP-025	\N
146	8	5	2	26	NICHO	LIBRE	\N	\N	JP-026	\N
147	8	5	3	27	NICHO	LIBRE	\N	\N	JP-027	\N
148	8	5	4	28	NICHO	LIBRE	\N	\N	JP-028	\N
149	8	5	5	29	NICHO	LIBRE	\N	\N	JP-029	\N
150	8	5	6	30	NICHO	LIBRE	\N	\N	JP-030	\N
66	6	1	6	6	NICHO	OCUPADO	\N	\N	SR-006	\N
151	9	1	1	1	FOSA	LIBRE	\N	\N	SC-001	\N
152	9	1	2	2	FOSA	LIBRE	\N	\N	SC-002	\N
153	9	1	3	3	FOSA	LIBRE	\N	\N	SC-003	\N
154	9	1	4	4	FOSA	LIBRE	\N	\N	SC-004	\N
155	9	1	5	5	FOSA	LIBRE	\N	\N	SC-005	\N
156	9	1	6	6	FOSA	LIBRE	\N	\N	SC-006	\N
157	9	1	7	7	FOSA	LIBRE	\N	\N	SC-007	\N
158	9	1	8	8	FOSA	LIBRE	\N	\N	SC-008	\N
159	9	1	9	9	FOSA	LIBRE	\N	\N	SC-009	\N
160	9	1	10	10	FOSA	LIBRE	\N	\N	SC-010	\N
161	9	2	1	11	FOSA	LIBRE	\N	\N	SC-011	\N
162	9	2	2	12	FOSA	LIBRE	\N	\N	SC-012	\N
163	9	2	3	13	FOSA	LIBRE	\N	\N	SC-013	\N
164	9	2	4	14	FOSA	LIBRE	\N	\N	SC-014	\N
165	9	2	5	15	FOSA	LIBRE	\N	\N	SC-015	\N
166	9	2	6	16	FOSA	LIBRE	\N	\N	SC-016	\N
167	9	2	7	17	FOSA	LIBRE	\N	\N	SC-017	\N
168	9	2	8	18	FOSA	LIBRE	\N	\N	SC-018	\N
169	9	2	9	19	FOSA	LIBRE	\N	\N	SC-019	\N
170	9	2	10	20	FOSA	LIBRE	\N	\N	SC-020	\N
171	9	3	1	21	FOSA	LIBRE	\N	\N	SC-021	\N
172	9	3	2	22	FOSA	LIBRE	\N	\N	SC-022	\N
173	9	3	3	23	FOSA	LIBRE	\N	\N	SC-023	\N
174	9	3	4	24	FOSA	LIBRE	\N	\N	SC-024	\N
175	9	3	5	25	FOSA	LIBRE	\N	\N	SC-025	\N
176	9	3	6	26	FOSA	LIBRE	\N	\N	SC-026	\N
177	9	3	7	27	FOSA	LIBRE	\N	\N	SC-027	\N
178	9	3	8	28	FOSA	LIBRE	\N	\N	SC-028	\N
179	9	3	9	29	FOSA	LIBRE	\N	\N	SC-029	\N
180	9	3	10	30	FOSA	LIBRE	\N	\N	SC-030	\N
181	9	4	1	31	FOSA	LIBRE	\N	\N	SC-031	\N
182	9	4	2	32	FOSA	LIBRE	\N	\N	SC-032	\N
183	9	4	3	33	FOSA	LIBRE	\N	\N	SC-033	\N
184	9	4	4	34	FOSA	LIBRE	\N	\N	SC-034	\N
185	9	4	5	35	FOSA	LIBRE	\N	\N	SC-035	\N
186	9	4	6	36	FOSA	LIBRE	\N	\N	SC-036	\N
187	9	4	7	37	FOSA	LIBRE	\N	\N	SC-037	\N
188	9	4	8	38	FOSA	LIBRE	\N	\N	SC-038	\N
189	9	4	9	39	FOSA	LIBRE	\N	\N	SC-039	\N
190	9	4	10	40	FOSA	LIBRE	\N	\N	SC-040	\N
191	9	5	1	41	FOSA	LIBRE	\N	\N	SC-041	\N
192	9	5	2	42	FOSA	LIBRE	\N	\N	SC-042	\N
193	9	5	3	43	FOSA	LIBRE	\N	\N	SC-043	\N
194	9	5	4	44	FOSA	LIBRE	\N	\N	SC-044	\N
195	9	5	5	45	FOSA	LIBRE	\N	\N	SC-045	\N
196	9	5	6	46	FOSA	LIBRE	\N	\N	SC-046	\N
197	9	5	7	47	FOSA	LIBRE	\N	\N	SC-047	\N
198	9	5	8	48	FOSA	LIBRE	\N	\N	SC-048	\N
199	9	5	9	49	FOSA	LIBRE	\N	\N	SC-049	\N
200	9	5	10	50	FOSA	LIBRE	\N	\N	SC-050	\N
201	9	6	1	51	FOSA	LIBRE	\N	\N	SC-051	\N
202	9	6	2	52	FOSA	LIBRE	\N	\N	SC-052	\N
203	9	6	3	53	FOSA	LIBRE	\N	\N	SC-053	\N
204	9	6	4	54	FOSA	LIBRE	\N	\N	SC-054	\N
205	9	6	5	55	FOSA	LIBRE	\N	\N	SC-055	\N
206	9	6	6	56	FOSA	LIBRE	\N	\N	SC-056	\N
207	9	6	7	57	FOSA	LIBRE	\N	\N	SC-057	\N
208	9	6	8	58	FOSA	LIBRE	\N	\N	SC-058	\N
209	9	6	9	59	FOSA	LIBRE	\N	\N	SC-059	\N
210	9	6	10	60	FOSA	LIBRE	\N	\N	SC-060	\N
211	9	7	1	61	FOSA	LIBRE	\N	\N	SC-061	\N
212	9	7	2	62	FOSA	LIBRE	\N	\N	SC-062	\N
213	9	7	3	63	FOSA	LIBRE	\N	\N	SC-063	\N
214	9	7	4	64	FOSA	LIBRE	\N	\N	SC-064	\N
215	9	7	5	65	FOSA	LIBRE	\N	\N	SC-065	\N
216	9	7	6	66	FOSA	LIBRE	\N	\N	SC-066	\N
217	9	7	7	67	FOSA	LIBRE	\N	\N	SC-067	\N
218	9	7	8	68	FOSA	LIBRE	\N	\N	SC-068	\N
219	9	7	9	69	FOSA	LIBRE	\N	\N	SC-069	\N
220	9	7	10	70	FOSA	LIBRE	\N	\N	SC-070	\N
221	9	8	1	71	FOSA	LIBRE	\N	\N	SC-071	\N
222	9	8	2	72	FOSA	LIBRE	\N	\N	SC-072	\N
223	9	8	3	73	FOSA	LIBRE	\N	\N	SC-073	\N
224	9	8	4	74	FOSA	LIBRE	\N	\N	SC-074	\N
225	9	8	5	75	FOSA	LIBRE	\N	\N	SC-075	\N
226	9	8	6	76	FOSA	LIBRE	\N	\N	SC-076	\N
227	9	8	7	77	FOSA	LIBRE	\N	\N	SC-077	\N
228	9	8	8	78	FOSA	LIBRE	\N	\N	SC-078	\N
229	9	8	9	79	FOSA	LIBRE	\N	\N	SC-079	\N
230	9	8	10	80	FOSA	LIBRE	\N	\N	SC-080	\N
231	9	9	1	81	FOSA	LIBRE	\N	\N	SC-081	\N
232	9	9	2	82	FOSA	LIBRE	\N	\N	SC-082	\N
233	9	9	3	83	FOSA	LIBRE	\N	\N	SC-083	\N
234	9	9	4	84	FOSA	LIBRE	\N	\N	SC-084	\N
235	9	9	5	85	FOSA	LIBRE	\N	\N	SC-085	\N
236	9	9	6	86	FOSA	LIBRE	\N	\N	SC-086	\N
237	9	9	7	87	FOSA	LIBRE	\N	\N	SC-087	\N
238	9	9	8	88	FOSA	LIBRE	\N	\N	SC-088	\N
239	9	9	9	89	FOSA	LIBRE	\N	\N	SC-089	\N
240	9	9	10	90	FOSA	LIBRE	\N	\N	SC-090	\N
241	9	10	1	91	FOSA	LIBRE	\N	\N	SC-091	\N
242	9	10	2	92	FOSA	LIBRE	\N	\N	SC-092	\N
243	9	10	3	93	FOSA	LIBRE	\N	\N	SC-093	\N
244	9	10	4	94	FOSA	LIBRE	\N	\N	SC-094	\N
245	9	10	5	95	FOSA	LIBRE	\N	\N	SC-095	\N
246	9	10	6	96	FOSA	LIBRE	\N	\N	SC-096	\N
247	9	10	7	97	FOSA	LIBRE	\N	\N	SC-097	\N
248	9	10	8	98	FOSA	LIBRE	\N	\N	SC-098	\N
249	9	10	9	99	FOSA	LIBRE	\N	\N	SC-099	\N
250	9	10	10	100	FOSA	LIBRE	\N	\N	SC-100	\N
\.


--
-- Data for Name: inhumaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inhumaciones (id, difunto_id, espacio_id, titular_id, fecha_inhumacion, tipo_concesion, fecha_vencimiento, estado, hora_inhumacion, numero_acta, observaciones) FROM stdin;
2	3	61	1	2025-12-17	TEMPORAL	\N	ACTIVO	\N	\N	\N
3	4	62	1	2025-12-18	PERPETUA	\N	ACTIVO	\N	\N	ninguno
5	6	64	7	2025-12-16	PERPETUA	\N	ACTIVO	\N	\N	\N
6	8	65	1	2026-03-23	PERPETUA	\N	ACTIVO	13:00:00	\N	\N
7	9	63	10	2026-03-23	PERPETUA	\N	ACTIVO	15:00:00	78945612	xxxxx
8	10	66	8	2026-04-07	PERPETUA	\N	ACTIVO	15:00:00	78974586	ninguna
\.


--
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagos (id, codigo_recibo, titular_id, usuario_id, inhumacion_id, monto_total, metodo_pago, fecha_pago, estado, observaciones) FROM stdin;
3	REC-202603-000003	10	1	7	1000.00	EFECTIVO	2026-03-22 19:07:53.349	PAGADO	Pago pendiente por servicio de inhumación - inhymacion persona mayor 
1	REC-202512-000001	7	1	5	1000.00	EFECTIVO	2026-03-22 19:11:06.281	PAGADO	Pago pendiente por servicio de inhumación - inhymacion persona mayor 
2	REC-202603-000002	1	1	\N	1000.00	EFECTIVO	2026-04-11 20:34:13.858	PAGADO	\N
4	REC-202604-000004	8	1	8	1000.00	EFECTIVO	2026-04-11 20:30:33.346	PENDIENTE	Pago pendiente por servicio de inhumación - inhymacion persona mayor 
\.


--
-- Data for Name: permisos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permisos (id, slug, descripcion) FROM stdin;
1	ver_difuntos	Ver listado de difuntos
2	crear_difuntos	Crear y editar difuntos
3	eliminar_difuntos	Eliminar difuntos
4	ver_inhumaciones	Ver listado de inhumaciones
5	crear_inhumaciones	Registrar nuevas inhumaciones
6	ver_pagos	Ver historial de pagos
7	crear_pagos	Registrar nuevos pagos
8	anular_pagos	Anular pagos existentes
9	gestionar_sectores	Administrar sectores y espacios
10	gestionar_titulares	Administrar titulares
11	gestionar_usuarios	Crear y editar usuarios del sistema
12	gestionar_roles	Administrar roles y permisos
13	ver_reportes	Acceso a reportes y estadísticas
14	admin_total	Acceso total al sistema (superadmin)
15	ver_dashboard	Ver dashboard
18	actualizar_difuntos	Actualizar difuntos
22	actualizar_inhumaciones	Actualizar inhumaciones
23	eliminar_inhumaciones	Eliminar inhumaciones
24	ver_titulares	Ver titulares
25	crear_titulares	Crear titulares
26	actualizar_titulares	Actualizar titulares
27	eliminar_titulares	Eliminar titulares
28	ver_sectores	Ver sectores
29	crear_sectores	Crear sectores
30	actualizar_sectores	Actualizar sectores
31	eliminar_sectores	Eliminar sectores
32	ver_espacios	Ver espacios
33	crear_espacios	Crear espacios
34	actualizar_espacios	Actualizar espacios
35	eliminar_espacios	Eliminar espacios
38	actualizar_pagos	Actualizar pagos
39	eliminar_pagos	Eliminar pagos
40	ver_conceptos_pago	Ver conceptos de pago
41	crear_conceptos_pago	Crear conceptos de pago
42	actualizar_conceptos_pago	Actualizar conceptos de pago
43	eliminar_conceptos_pago	Eliminar conceptos de pago
44	ver_usuarios	Ver usuarios
45	crear_usuarios	Crear usuarios
46	actualizar_usuarios	Actualizar usuarios
47	eliminar_usuarios	Eliminar usuarios
48	ver_roles	Ver roles
49	crear_roles	Crear roles
50	actualizar_roles	Actualizar roles
51	eliminar_roles	Eliminar roles
52	ver_permisos	Ver permisos
53	crear_permisos	Crear permisos
54	actualizar_permisos	Actualizar permisos
55	eliminar_permisos	Eliminar permisos
56	ver_conceptos	Ver listado de conceptos de pago
57	crear_conceptos	Crear nuevos conceptos de pago
58	actualizar_conceptos	Actualizar conceptos de pago
59	eliminar_conceptos	Eliminar conceptos de pago
60	anular_inhumaciones	Anular inhumaciones (libera el espacio)
61	revertir_anulacion_inhumaciones	Revertir la anulación de una inhumación
62	revertir_anulacion_pagos	Revertir la anulación de un pago
63	registrar_cobro	Registrar el cobro efectivo de un pago pendiente
64	gestionar_respaldos	Gestionar y descargar copias de seguridad del sistema
\.


--
-- Data for Name: rol_permisos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol_permisos (rol_id, permiso_id) FROM stdin;
1	15
1	1
1	2
1	18
1	3
1	4
1	5
1	22
1	23
1	9
1	10
1	11
1	12
1	13
1	14
1	40
1	41
1	42
1	43
1	64
1	60
1	61
1	24
1	25
1	26
1	27
1	28
1	29
1	30
1	31
1	32
1	33
1	34
1	35
1	6
1	7
1	38
1	39
1	8
1	62
1	63
1	56
1	57
1	58
1	59
1	44
1	45
1	46
1	47
1	48
1	49
1	50
1	51
1	52
1	53
1	54
1	55
2	15
2	1
2	4
2	24
2	28
2	32
2	6
2	63
2	56
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, nombre, descripcion, activo) FROM stdin;
1	ADMIN	Acceso total al sistema	t
3	REGISTRADOR	Gestión de difuntos e infraestructura	t
4	CONSULTA	Solo lectura de mapas y ubicación	t
2	CAJERO	Acceso a módulo de caja y reportes financieros X	t
\.


--
-- Data for Name: sectores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sectores (id, nombre, tipo, coordenadas_geo, descripcion, tipo_espacio, capacidad_total) FROM stdin;
6	SANTA ROSA	\N	\N	ES UNA PRUEBA 	nicho	30
7	SAN PEDRO 	\N	\N	\N	nicho	30
8	JUAN PABLO II	\N	\N	\N	nicho	30
9	Santa clara	\N	\N	\N	fosa	100
\.


--
-- Data for Name: titulares; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titulares (id, dni, nombres, apellidos, telefono, direccion, email) FROM stdin;
1	12345678	perosona 	apelli1 	123456788	lass rtina s	admin@cementerio.gob.pe
5	7412586	AJEMPLO2	APELLIRSMALA	9595595959	DEWEDWDWDWD	XXXX@GMAIL.COM
7	89562314	JUSTINA 	ROBLES PINO	\N	\N	DESCO@GMAIL.COM
8	78945612	luna lunera	casca velera	978945614	avenida siempre viva 2	luna@gmail.com
10	88945612	sol radiante	casas nail	988945614	avenida siempre viva 2	sol@gmail.com
2	123478947	pedro	valle casas 	963258741	avenida siempre viva 18	pedro@gmail.com
3	85214796	rafael	nadal campos	6534764	las tunas 123\n	mmmmxxxx@gmail.com
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, rol_id, username, password_hash, nombre_completo, email, ultimo_login, activo, created_at, updated_at) FROM stdin;
2	2	maryori	$2b$10$n/Ck2u16F3ZM/nWyqTsIv.pSuXof9OjShzZCuq0MtohOJMeHdqOIO	mayorie rivas simon	mayori@gmail.com	2026-04-11 21:54:22.312	t	2025-12-16 21:39:04.103441	2026-04-11 21:54:22.314154
1	1	admin	$2b$10$0jVFke.Y2/e/i4M9AmJay.hkqmTA6qGObUEVQDwK1cK9mfoHGVzRS	Administrador Municipal	sistemas@municipio.gob.pe	2026-04-11 22:26:00.813	t	2025-12-07 18:37:59.4995	2026-04-11 22:26:00.82135
\.


--
-- Name: auditoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auditoria_id_seq', 353, true);


--
-- Name: conceptos_pago_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.conceptos_pago_id_seq', 6, true);


--
-- Name: detalle_pagos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalle_pagos_id_seq', 3, true);


--
-- Name: difuntos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.difuntos_id_seq', 10, true);


--
-- Name: espacios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.espacios_id_seq', 250, true);


--
-- Name: inhumaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inhumaciones_id_seq', 8, true);


--
-- Name: pagos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pagos_id_seq', 4, true);


--
-- Name: permisos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permisos_id_seq', 64, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 4, true);


--
-- Name: sectores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sectores_id_seq', 9, true);


--
-- Name: titulares_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.titulares_id_seq', 10, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 2, true);


--
-- Name: auditoria PK_135fe98308816fe3a2d458e6637; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria
    ADD CONSTRAINT "PK_135fe98308816fe3a2d458e6637" PRIMARY KEY (id);


--
-- Name: permisos PK_3127bd9cfeb13ae76186d0d9b38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT "PK_3127bd9cfeb13ae76186d0d9b38" PRIMARY KEY (id);


--
-- Name: pagos PK_37321ca70a2ed50885dc205beb2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT "PK_37321ca70a2ed50885dc205beb2" PRIMARY KEY (id);


--
-- Name: espacios PK_499dd7197047432e1058397e852; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.espacios
    ADD CONSTRAINT "PK_499dd7197047432e1058397e852" PRIMARY KEY (id);


--
-- Name: conceptos_pago PK_6f5b5fb0cb98c1bed8fefd2284c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conceptos_pago
    ADD CONSTRAINT "PK_6f5b5fb0cb98c1bed8fefd2284c" PRIMARY KEY (id);


--
-- Name: detalle_pagos PK_756c08fda68150950aeb7a5757d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pagos
    ADD CONSTRAINT "PK_756c08fda68150950aeb7a5757d" PRIMARY KEY (id);


--
-- Name: difuntos PK_8040216cc630d5eb3e9f56b7f28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.difuntos
    ADD CONSTRAINT "PK_8040216cc630d5eb3e9f56b7f28" PRIMARY KEY (id);


--
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- Name: rol_permisos PK_d0cf98bfca05b7f290ea73bd734; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT "PK_d0cf98bfca05b7f290ea73bd734" PRIMARY KEY (rol_id, permiso_id);


--
-- Name: usuarios PK_d7281c63c176e152e4c531594a8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY (id);


--
-- Name: sectores PK_e4690b445beae51b850640e7d9d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sectores
    ADD CONSTRAINT "PK_e4690b445beae51b850640e7d9d" PRIMARY KEY (id);


--
-- Name: inhumaciones PK_f670359693333af2fe603844966; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inhumaciones
    ADD CONSTRAINT "PK_f670359693333af2fe603844966" PRIMARY KEY (id);


--
-- Name: titulares PK_fae7c09000ade2b775325ac61ea; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titulares
    ADD CONSTRAINT "PK_fae7c09000ade2b775325ac61ea" PRIMARY KEY (id);


--
-- Name: pagos UQ_31d35d723f1039896c1349411bd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT "UQ_31d35d723f1039896c1349411bd" UNIQUE (codigo_recibo);


--
-- Name: usuarios UQ_9f78cfde576fc28f279e2b7a9cb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "UQ_9f78cfde576fc28f279e2b7a9cb" UNIQUE (username);


--
-- Name: roles UQ_a5be7aa67e759e347b1c6464e10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "UQ_a5be7aa67e759e347b1c6464e10" UNIQUE (nombre);


--
-- Name: permisos UQ_b918200b3a90df691b32ca09e36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT "UQ_b918200b3a90df691b32ca09e36" UNIQUE (slug);


--
-- Name: inhumaciones UQ_ecc86c6a205dbe4a07709258037; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inhumaciones
    ADD CONSTRAINT "UQ_ecc86c6a205dbe4a07709258037" UNIQUE (difunto_id);


--
-- Name: titulares UQ_f09b42b039eaba7632aa9d81dc8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titulares
    ADD CONSTRAINT "UQ_f09b42b039eaba7632aa9d81dc8" UNIQUE (dni);


--
-- Name: espacios espacios_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.espacios
    ADD CONSTRAINT espacios_codigo_key UNIQUE (codigo);


--
-- Name: inhumaciones FK_13470b296b74203f1f87f97a542; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inhumaciones
    ADD CONSTRAINT "FK_13470b296b74203f1f87f97a542" FOREIGN KEY (espacio_id) REFERENCES public.espacios(id);


--
-- Name: espacios FK_17082545786cc587e2db0063afe; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.espacios
    ADD CONSTRAINT "FK_17082545786cc587e2db0063afe" FOREIGN KEY (sector_id) REFERENCES public.sectores(id);


--
-- Name: rol_permisos FK_25e38115872406619b03e46cced; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT "FK_25e38115872406619b03e46cced" FOREIGN KEY (permiso_id) REFERENCES public.permisos(id) ON DELETE CASCADE;


--
-- Name: difuntos FK_429b89902acbdc66d75a87765df; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.difuntos
    ADD CONSTRAINT "FK_429b89902acbdc66d75a87765df" FOREIGN KEY (titular_id) REFERENCES public.titulares(id);


--
-- Name: rol_permisos FK_4d6354d8c6fecd074abd3183f40; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT "FK_4d6354d8c6fecd074abd3183f40" FOREIGN KEY (rol_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: espacios FK_81b74229ac161b99311de34bdbc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.espacios
    ADD CONSTRAINT "FK_81b74229ac161b99311de34bdbc" FOREIGN KEY (titular_id) REFERENCES public.titulares(id);


--
-- Name: pagos FK_904f31f3af4be924012a6927028; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT "FK_904f31f3af4be924012a6927028" FOREIGN KEY (inhumacion_id) REFERENCES public.inhumaciones(id);


--
-- Name: inhumaciones FK_93287efd4607013222ea23ed5ec; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inhumaciones
    ADD CONSTRAINT "FK_93287efd4607013222ea23ed5ec" FOREIGN KEY (titular_id) REFERENCES public.titulares(id);


--
-- Name: pagos FK_9857617215b4f7ab8a1123fbb54; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT "FK_9857617215b4f7ab8a1123fbb54" FOREIGN KEY (titular_id) REFERENCES public.titulares(id);


--
-- Name: usuarios FK_9e519760a660751f4fa21453d3e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "FK_9e519760a660751f4fa21453d3e" FOREIGN KEY (rol_id) REFERENCES public.roles(id);


--
-- Name: detalle_pagos FK_b5011383286f6601e7726a782aa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pagos
    ADD CONSTRAINT "FK_b5011383286f6601e7726a782aa" FOREIGN KEY (pago_id) REFERENCES public.pagos(id);


--
-- Name: detalle_pagos FK_dc8c763404a4ce95ca6c7bf9c90; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pagos
    ADD CONSTRAINT "FK_dc8c763404a4ce95ca6c7bf9c90" FOREIGN KEY (concepto_id) REFERENCES public.conceptos_pago(id);


--
-- Name: auditoria FK_e3351946be53c7cd3286ed4c49d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria
    ADD CONSTRAINT "FK_e3351946be53c7cd3286ed4c49d" FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: inhumaciones FK_ecc86c6a205dbe4a07709258037; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inhumaciones
    ADD CONSTRAINT "FK_ecc86c6a205dbe4a07709258037" FOREIGN KEY (difunto_id) REFERENCES public.difuntos(id);


--
-- Name: pagos FK_fec62c47394f5abc6ab3e9159cb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT "FK_fec62c47394f5abc6ab3e9159cb" FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- PostgreSQL database dump complete
--

\unrestrict Q0zUkOtbwBeSKTMdptOA8jqSZuBwbsatkOvKJp5pc0YK8ppjNEVt73C3Om8OUpB

