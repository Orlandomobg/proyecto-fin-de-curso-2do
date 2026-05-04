--
-- PostgreSQL database dump
--

\restrict lowU1BmVl8B2P2p1yJOQnpueuVLU4azHh1dlEvPiFZDShwOoIVKSMs1dKb32qkb

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-25 21:07:42

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
-- TOC entry 5183 (class 1262 OID 16384)
-- Name: solar_project; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE solar_project WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';


ALTER DATABASE solar_project OWNER TO postgres;

\unrestrict lowU1BmVl8B2P2p1yJOQnpueuVLU4azHh1dlEvPiFZDShwOoIVKSMs1dKb32qkb
\connect solar_project
\restrict lowU1BmVl8B2P2p1yJOQnpueuVLU4azHh1dlEvPiFZDShwOoIVKSMs1dKb32qkb

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
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 5184 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16423)
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(150) NOT NULL,
    contact_email character varying(200),
    phone character varying(50),
    service_area text,
    rating double precision DEFAULT 0.0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16433)
-- Name: energy_consumptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.energy_consumptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    property_id uuid NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    consumption_kwh numeric(12,2) NOT NULL,
    energy_source character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    user_id uuid,
    annual_kwh numeric(14,2),
    CONSTRAINT energy_consumptions_month_check CHECK (((month >= 1) AND (month <= 12)))
);


ALTER TABLE public.energy_consumptions OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16445)
-- Name: installation_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.installation_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    simulation_id uuid NOT NULL,
    company_id uuid NOT NULL,
    total_cost numeric(14,2) NOT NULL,
    estimated_install_days integer,
    status character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.installation_plans OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16456)
-- Name: installations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.installations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    installation_plan_id uuid NOT NULL,
    start_date date,
    end_date date,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.installations OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16466)
-- Name: inversores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inversores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand character varying(100) NOT NULL,
    model character varying(100) NOT NULL,
    efficiency_pct numeric(5,2) DEFAULT 97,
    price_unit numeric(12,2),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.inversores OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16475)
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    property_id uuid NOT NULL,
    created_by_user_id uuid NOT NULL,
    company_id uuid,
    project_name character varying(200) NOT NULL,
    status character varying(100) DEFAULT 'DRAFT'::character varying NOT NULL,
    estimated_budget numeric(14,2),
    final_budget numeric(14,2),
    start_date date,
    expected_end_date date,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    currency character varying(10) DEFAULT 'EUR'::character varying
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16488)
-- Name: properties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.properties (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    address text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    area_total_m2 numeric(10,2) CONSTRAINT properties_roof_area_total_m2_not_null NOT NULL,
    area_usable_m2 numeric(10,2) CONSTRAINT properties_roof_area_usable_m2_not_null NOT NULL,
    surface_type character varying(100),
    orientation_degree numeric(5,2),
    tilt_angle_degree numeric(5,2),
    shading_factor numeric(3,2),
    created_at timestamp with time zone DEFAULT now(),
    roof_material character varying(100),
    electricity_price_eur_kwh numeric(6,4) DEFAULT 0.30,
    compensation_price_eur_kwh numeric(6,4) DEFAULT 0.15,
    annual_maintenance_eur numeric(10,2) DEFAULT 200,
    CONSTRAINT properties_check CHECK ((area_usable_m2 <= area_total_m2)),
    CONSTRAINT properties_orientation_degree_check CHECK (((orientation_degree >= (0)::numeric) AND (orientation_degree <= (360)::numeric))),
    CONSTRAINT properties_roof_area_total_m2_check CHECK ((area_total_m2 > (0)::numeric)),
    CONSTRAINT properties_shading_factor_check CHECK (((shading_factor >= (0)::numeric) AND (shading_factor <= (1)::numeric))),
    CONSTRAINT properties_tilt_angle_degree_check CHECK (((tilt_angle_degree >= (0)::numeric) AND (tilt_angle_degree <= (90)::numeric)))
);


ALTER TABLE public.properties OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16510)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16516)
-- Name: simulations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.simulations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    property_id uuid NOT NULL,
    panel_id uuid NOT NULL,
    number_of_panels integer NOT NULL,
    installed_power_kw numeric(12,2),
    annual_generation_kwh numeric(14,2),
    annual_savings numeric(14,2),
    roi_years numeric(6,2),
    coverage_percentage numeric(5,2),
    co2_offset_kg_year numeric(14,2),
    result_metadata jsonb,
    created_at timestamp with time zone DEFAULT now(),
    "optimal_azimuth_degree " numeric(5,0),
    "optimal_tilt_degree " numeric(5,0)
);


ALTER TABLE public.simulations OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16528)
-- Name: solar_panels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solar_panels (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand character varying(100) NOT NULL,
    model character varying(100) NOT NULL,
    power_watt numeric(10,2) NOT NULL,
    efficiency_percentage numeric(5,2) NOT NULL,
    area_m2 numeric(10,2) NOT NULL,
    price_unit numeric(12,2) NOT NULL,
    degradation_rate_year numeric(5,2),
    lifespan_years integer,
    created_at timestamp with time zone DEFAULT now(),
    noct_celsius numeric(5,2) DEFAULT 48,
    temp_coefficient numeric(6,4) DEFAULT '-0.0040'::numeric,
    inverter_efficiency_pct numeric(5,2) DEFAULT 97,
    wiring_losses_pct numeric(5,2) DEFAULT 2
);


ALTER TABLE public.solar_panels OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16544)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(120) NOT NULL,
    email character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    firebase_uid character varying(255),
    role character varying(50) DEFAULT 'user'::character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 5167 (class 0 OID 16423)
-- Dependencies: 220
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5168 (class 0 OID 16433)
-- Dependencies: 221
-- Data for Name: energy_consumptions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5169 (class 0 OID 16445)
-- Dependencies: 222
-- Data for Name: installation_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5170 (class 0 OID 16456)
-- Dependencies: 223
-- Data for Name: installations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5171 (class 0 OID 16466)
-- Dependencies: 224
-- Data for Name: inversores; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5172 (class 0 OID 16475)
-- Dependencies: 225
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5173 (class 0 OID 16488)
-- Dependencies: 226
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.properties (id, user_id, address, latitude, longitude, area_total_m2, area_usable_m2, surface_type, orientation_degree, tilt_angle_degree, shading_factor, created_at, roof_material, electricity_price_eur_kwh, compensation_price_eur_kwh, annual_maintenance_eur) VALUES ('d72588c9-58d1-439c-918c-8a3345e75290', 'f0ef8c1b-73c9-4b3a-a8a1-e068de7a5661', 'Calle Gran Vía 1, Madrid', 40.4168, -3.7038, 80.00, 50.00, 'building', 180.00, 30.00, 0.05, '2026-04-02 03:24:13.375536+02', 'concrete', 0.3000, 0.1500, 200.00);


--
-- TOC entry 5174 (class 0 OID 16510)
-- Dependencies: 227
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.roles (id, name) VALUES ('e5a19688-0b47-4b4e-861b-187ef3f107b1', 'user');


--
-- TOC entry 5175 (class 0 OID 16516)
-- Dependencies: 228
-- Data for Name: simulations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5176 (class 0 OID 16528)
-- Dependencies: 229
-- Data for Name: solar_panels; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.solar_panels (id, brand, model, power_watt, efficiency_percentage, area_m2, price_unit, degradation_rate_year, lifespan_years, created_at, noct_celsius, temp_coefficient, inverter_efficiency_pct, wiring_losses_pct) VALUES ('a764d8ab-0887-49de-a652-2d30c46b8158', 'SunPower', 'Maxeon 3 400W', 400.00, 22.60, 1.69, 320.00, 0.25, 25, '2026-04-01 02:03:49.774306+02', 45.00, -0.0029, 97.00, 2.00);
INSERT INTO public.solar_panels (id, brand, model, power_watt, efficiency_percentage, area_m2, price_unit, degradation_rate_year, lifespan_years, created_at, noct_celsius, temp_coefficient, inverter_efficiency_pct, wiring_losses_pct) VALUES ('a7f3f3e1-9142-47c3-a003-11be6db2eb66', 'Jinko Solar', 'Tiger Neo 420W', 420.00, 21.60, 1.88, 180.00, 0.40, 25, '2026-04-01 02:07:26.447545+02', 43.00, -0.0030, 97.00, 2.00);
INSERT INTO public.solar_panels (id, brand, model, power_watt, efficiency_percentage, area_m2, price_unit, degradation_rate_year, lifespan_years, created_at, noct_celsius, temp_coefficient, inverter_efficiency_pct, wiring_losses_pct) VALUES ('f3401b29-9cee-41c6-ae37-5a0925038124', 'Canadian Solar', 'HiHero 430W', 430.00, 22.80, 1.72, 210.00, 0.40, 25, '2026-04-01 02:07:26.447545+02', 44.00, -0.0030, 97.00, 2.00);
INSERT INTO public.solar_panels (id, brand, model, power_watt, efficiency_percentage, area_m2, price_unit, degradation_rate_year, lifespan_years, created_at, noct_celsius, temp_coefficient, inverter_efficiency_pct, wiring_losses_pct) VALUES ('fa3bad34-48c9-4abc-9117-6651a2f9481b', 'Longi Solar', 'Hi-MO 6 440W', 440.00, 22.80, 1.92, 160.00, 0.40, 25, '2026-04-01 02:07:26.447545+02', 45.00, -0.0032, 97.00, 2.00);


--
-- TOC entry 5177 (class 0 OID 16544)
-- Dependencies: 230
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, name, email, created_at, updated_at, deleted_at, firebase_uid, role) VALUES ('8f432ca1-ea50-4382-a117-08fbbed23ca8', 'test', 'test@gmail,.com', '2026-02-14 03:50:30.916964+01', '2026-04-20 00:06:38.439392+02', NULL, '8f432ca1-ea50-4382-a117-08fbbed23ca8', 'user');
INSERT INTO public.users (id, name, email, created_at, updated_at, deleted_at, firebase_uid, role) VALUES ('4c4e5758-172e-4f43-9943-faf0eb5e3d62', 'Test User', 'test@example.com', '2026-04-20 00:06:59.046945+02', '2026-04-20 00:06:59.046945+02', NULL, 'test-user-123', 'user');
INSERT INTO public.users (id, name, email, created_at, updated_at, deleted_at, firebase_uid, role) VALUES ('f0ef8c1b-73c9-4b3a-a8a1-e068de7a5661', 'Orlando', 'orlando@test.com', '2026-04-02 03:21:15.754185+02', '2026-04-20 00:06:38.439392+02', NULL, 'f0ef8c1b-73c9-4b3a-a8a1-e068de7a5661', 'admin');


--
-- TOC entry 4975 (class 2606 OID 16557)
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- TOC entry 4977 (class 2606 OID 16559)
-- Name: energy_consumptions energy_consumptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.energy_consumptions
    ADD CONSTRAINT energy_consumptions_pkey PRIMARY KEY (id);


--
-- TOC entry 4982 (class 2606 OID 16561)
-- Name: installation_plans installation_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installation_plans
    ADD CONSTRAINT installation_plans_pkey PRIMARY KEY (id);


--
-- TOC entry 4984 (class 2606 OID 16563)
-- Name: installations installations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installations
    ADD CONSTRAINT installations_pkey PRIMARY KEY (id);


--
-- TOC entry 4986 (class 2606 OID 16565)
-- Name: inversores inversores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inversores
    ADD CONSTRAINT inversores_pkey PRIMARY KEY (id);


--
-- TOC entry 4988 (class 2606 OID 16567)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 4991 (class 2606 OID 16569)
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- TOC entry 4993 (class 2606 OID 16571)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 4995 (class 2606 OID 16573)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4997 (class 2606 OID 16575)
-- Name: simulations simulations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simulations
    ADD CONSTRAINT simulations_pkey PRIMARY KEY (id);


--
-- TOC entry 4999 (class 2606 OID 16577)
-- Name: solar_panels solar_panels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solar_panels
    ADD CONSTRAINT solar_panels_pkey PRIMARY KEY (id);


--
-- TOC entry 4980 (class 2606 OID 16579)
-- Name: energy_consumptions unique_property_month_year; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.energy_consumptions
    ADD CONSTRAINT unique_property_month_year UNIQUE (property_id, month, year);


--
-- TOC entry 5002 (class 2606 OID 16581)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5004 (class 2606 OID 16583)
-- Name: users users_firebase_uid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_firebase_uid_key UNIQUE (firebase_uid);


--
-- TOC entry 5006 (class 2606 OID 16585)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4978 (class 1259 OID 16586)
-- Name: idx_energy_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_energy_user_id ON public.energy_consumptions USING btree (user_id);


--
-- TOC entry 4989 (class 1259 OID 16587)
-- Name: idx_properties_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_properties_user_id ON public.properties USING btree (user_id);


--
-- TOC entry 5000 (class 1259 OID 16588)
-- Name: idx_users_firebase_uid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_firebase_uid ON public.users USING btree (firebase_uid);


--
-- TOC entry 5007 (class 2606 OID 16589)
-- Name: energy_consumptions energy_consumptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.energy_consumptions
    ADD CONSTRAINT energy_consumptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5008 (class 2606 OID 16594)
-- Name: energy_consumptions fk_energy_property; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.energy_consumptions
    ADD CONSTRAINT fk_energy_property FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- TOC entry 5011 (class 2606 OID 16599)
-- Name: installations fk_install_plan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installations
    ADD CONSTRAINT fk_install_plan FOREIGN KEY (installation_plan_id) REFERENCES public.installation_plans(id);


--
-- TOC entry 5012 (class 2606 OID 16604)
-- Name: installations fk_install_project; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installations
    ADD CONSTRAINT fk_install_project FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- TOC entry 5009 (class 2606 OID 16609)
-- Name: installation_plans fk_plan_project; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installation_plans
    ADD CONSTRAINT fk_plan_project FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- TOC entry 5010 (class 2606 OID 16614)
-- Name: installation_plans fk_plan_sim; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installation_plans
    ADD CONSTRAINT fk_plan_sim FOREIGN KEY (simulation_id) REFERENCES public.simulations(id);


--
-- TOC entry 5013 (class 2606 OID 16619)
-- Name: projects fk_project_company; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_project_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE RESTRICT;


--
-- TOC entry 5014 (class 2606 OID 16624)
-- Name: projects fk_project_property; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_project_property FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- TOC entry 5015 (class 2606 OID 16629)
-- Name: projects fk_project_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_project_user FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- TOC entry 5016 (class 2606 OID 16634)
-- Name: properties fk_property_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT fk_property_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5017 (class 2606 OID 16639)
-- Name: simulations fk_sim_panel; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simulations
    ADD CONSTRAINT fk_sim_panel FOREIGN KEY (panel_id) REFERENCES public.solar_panels(id);


--
-- TOC entry 5018 (class 2606 OID 16644)
-- Name: simulations fk_sim_project; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simulations
    ADD CONSTRAINT fk_sim_project FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- TOC entry 5019 (class 2606 OID 16649)
-- Name: simulations fk_sim_property; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simulations
    ADD CONSTRAINT fk_sim_property FOREIGN KEY (property_id) REFERENCES public.properties(id);


-- Completed on 2026-04-25 21:07:42

--
-- PostgreSQL database dump complete
--

\unrestrict lowU1BmVl8B2P2p1yJOQnpueuVLU4azHh1dlEvPiFZDShwOoIVKSMs1dKb32qkb

