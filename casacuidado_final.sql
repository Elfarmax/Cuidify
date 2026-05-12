--
-- PostgreSQL database dump
--

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-04-20 21:18:48

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
-- TOC entry 2 (class 3079 OID 16470)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 16453)
-- Name: atributos_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.atributos_usuario (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    tipo character varying(50) NOT NULL,
    valor character varying(150) NOT NULL,
    es_oficial boolean DEFAULT false,
    CONSTRAINT atributos_usuario_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['habilidad'::character varying, 'equipo'::character varying, 'logistica'::character varying, 'certificado'::character varying])::text[])))
);


ALTER TABLE public.atributos_usuario OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16452)
-- Name: atributos_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.atributos_usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.atributos_usuario_id_seq OWNER TO postgres;

ALTER SEQUENCE public.atributos_usuario_id_seq OWNED BY public.atributos_usuario.id;


--
-- TOC entry 223 (class 1259 OID 16438)
-- Name: servicios_familia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicios_familia (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    target_tipo character varying(20) DEFAULT 'self'::character varying,
    nombre_familiar character varying(100),
    parentesco character varying(50),
    edad_familiar integer,
    ubicacion_servicio character varying(100)
);


ALTER TABLE public.servicios_familia OWNER TO postgres;

CREATE SEQUENCE public.servicios_familia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.servicios_familia_id_seq OWNER TO postgres;

ALTER SEQUENCE public.servicios_familia_id_seq OWNED BY public.servicios_familia.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    apellidos character varying(100) NOT NULL,
    email bytea NOT NULL,
    password_hash character varying(255) NOT NULL,
    telefono bytea,
    rol character varying(20) NOT NULL,
    bio text,
    precio_hora numeric(10,2) DEFAULT 0.00,
    tema_preferido character varying(20) DEFAULT 'normal'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    dni bytea,
    CONSTRAINT usuarios_rol_check CHECK (((rol)::text = ANY ((ARRAY['cuidador'::character varying, 'familia'::character varying])::text[])))
);


ALTER TABLE public.usuarios OWNER TO postgres;

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


ALTER TABLE ONLY public.atributos_usuario ALTER COLUMN id SET DEFAULT nextval('public.atributos_usuario_id_seq'::regclass);

ALTER TABLE ONLY public.servicios_familia ALTER COLUMN id SET DEFAULT nextval('public.servicios_familia_id_seq'::regclass);

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: atributos_usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.atributos_usuario (id, usuario_id, tipo, valor, es_oficial) FROM stdin;
\.


--
-- Data for Name: servicios_familia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicios_familia (id, usuario_id, target_tipo, nombre_familiar, parentesco, edad_familiar, ubicacion_servicio) FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, apellidos, email, password_hash, telefono, rol, bio, precio_hora, tema_preferido, created_at, dni) FROM stdin;
11	carla	nieto 	\\xc30d040703029fd4370ad37ac68873d24001bf277271548aa521faf0360dc73745564a1d44bce6b2cd1a48d240ad45bf9c301364ad6119c91274138ae00ae18ca3c183b00319710dd0c42b75aaca27f2cf	$2a$06$GyQlfMpdL0sK5Pg0y.7a0.MZLI14CiXXE0fdS4eiwBGL1QjtkeroS	\\xc30d0407030244a3a7aa7a896c7e74d23a01c4621bfe4743cce2bc3ffc0ef57217029ee3dfe21bedde5652dec252d8ccab3a2d3b94bf9452bc241179dfc2456507f6fd8ed6f8560ddab54a	cuidador	asasas	20.00	normal	2026-04-20 21:12:07.676895	\\xc30d040703028a9f6c730dc1769a6bd23a01ae2774573a23b55494f243a81e276d5daeb16e47889daf93ed9ac8c0d7938a3c7784a1a05ceb34c65a5fd6b08f2662b6df2a9870d90ed0b7a1
\.


SELECT pg_catalog.setval('public.atributos_usuario_id_seq', 3, true);

SELECT pg_catalog.setval('public.servicios_familia_id_seq', 1, true);

SELECT pg_catalog.setval('public.usuarios_id_seq', 11, true);


ALTER TABLE ONLY public.atributos_usuario
    ADD CONSTRAINT atributos_usuario_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.servicios_familia
    ADD CONSTRAINT servicios_familia_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.atributos_usuario
    ADD CONSTRAINT fk_usuario_atributo FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.servicios_familia
    ADD CONSTRAINT fk_usuario_familia FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;

--
-- PostgreSQL database dump complete
--