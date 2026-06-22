--
-- PostgreSQL database dump
--

\restrict IVtcCkYvdrBU5zR1a4qWAktbP3MJyIoDTfFWvrQFd28F97TVVaJox5YFbXedlfL

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-06-22 05:11:06

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 26041)
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
-- TOC entry 220 (class 1259 OID 26051)
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
-- TOC entry 221 (class 1259 OID 26063)
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
-- TOC entry 222 (class 1259 OID 26074)
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
-- TOC entry 223 (class 1259 OID 26084)
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
-- TOC entry 224 (class 1259 OID 26093)
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
-- TOC entry 225 (class 1259 OID 26106)
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
    deleted_at timestamp with time zone,
    CONSTRAINT properties_check CHECK ((area_usable_m2 <= area_total_m2)),
    CONSTRAINT properties_orientation_degree_check CHECK (((orientation_degree >= (0)::numeric) AND (orientation_degree <= (360)::numeric))),
    CONSTRAINT properties_roof_area_total_m2_check CHECK ((area_total_m2 > (0)::numeric)),
    CONSTRAINT properties_shading_factor_check CHECK (((shading_factor >= (0)::numeric) AND (shading_factor <= (1)::numeric))),
    CONSTRAINT properties_tilt_angle_degree_check CHECK (((tilt_angle_degree >= (0)::numeric) AND (tilt_angle_degree <= (90)::numeric)))
);


ALTER TABLE public.properties OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 26128)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 26134)
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
-- TOC entry 228 (class 1259 OID 26146)
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
    wiring_losses_pct numeric(5,2) DEFAULT 2,
    cost_per_watt_eur numeric(6,4),
    link_buy text,
    technical_sheet text
);


ALTER TABLE public.solar_panels OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 26162)
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
-- TOC entry 5129 (class 0 OID 26041)
-- Dependencies: 219
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, name, contact_email, phone, service_area, rating, created_at) FROM stdin;
\.


--
-- TOC entry 5130 (class 0 OID 26051)
-- Dependencies: 220
-- Data for Name: energy_consumptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.energy_consumptions (id, property_id, month, year, consumption_kwh, energy_source, created_at, user_id, annual_kwh) FROM stdin;
\.


--
-- TOC entry 5131 (class 0 OID 26063)
-- Dependencies: 221
-- Data for Name: installation_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.installation_plans (id, project_id, simulation_id, company_id, total_cost, estimated_install_days, status, created_at) FROM stdin;
\.


--
-- TOC entry 5132 (class 0 OID 26074)
-- Dependencies: 222
-- Data for Name: installations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.installations (id, project_id, installation_plan_id, start_date, end_date, notes, created_at) FROM stdin;
\.


--
-- TOC entry 5133 (class 0 OID 26084)
-- Dependencies: 223
-- Data for Name: inversores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inversores (id, brand, model, efficiency_pct, price_unit, created_at) FROM stdin;
\.


--
-- TOC entry 5134 (class 0 OID 26093)
-- Dependencies: 224
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, property_id, created_by_user_id, company_id, project_name, status, estimated_budget, final_budget, start_date, expected_end_date, completed_at, created_at, updated_at, currency) FROM stdin;
\.


--
-- TOC entry 5135 (class 0 OID 26106)
-- Dependencies: 225
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.properties (id, user_id, address, latitude, longitude, area_total_m2, area_usable_m2, surface_type, orientation_degree, tilt_angle_degree, shading_factor, created_at, roof_material, electricity_price_eur_kwh, compensation_price_eur_kwh, annual_maintenance_eur, deleted_at) FROM stdin;
d72588c9-58d1-439c-918c-8a3345e75290	f0ef8c1b-73c9-4b3a-a8a1-e068de7a5661	Calle Gran Vía 1, Madrid	40.4168	-3.7038	80.00	50.00	building	180.00	30.00	0.05	2026-04-02 03:24:13.375536+02	concrete	0.3000	0.1500	200.00	\N
ee1c9f4f-e6f9-4846-ab94-30fa0fa9524c	a1e78346-84fd-49e4-90bd-78e1eeff1bab	Calle Mayor 1, Madrid	40.4168	-3.7038	120.00	80.00	building	180.00	35.00	0.05	2026-06-11 00:04:38.732798+02	simple	0.3000	0.1500	200.00	\N
\.


--
-- TOC entry 5136 (class 0 OID 26128)
-- Dependencies: 226
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
e5a19688-0b47-4b4e-861b-187ef3f107b1	user
\.


--
-- TOC entry 5137 (class 0 OID 26134)
-- Dependencies: 227
-- Data for Name: simulations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.simulations (id, project_id, property_id, panel_id, number_of_panels, installed_power_kw, annual_generation_kwh, annual_savings, roi_years, coverage_percentage, co2_offset_kg_year, result_metadata, created_at, "optimal_azimuth_degree ", "optimal_tilt_degree ") FROM stdin;
\.


--
-- TOC entry 5138 (class 0 OID 26146)
-- Dependencies: 228
-- Data for Name: solar_panels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.solar_panels (id, brand, model, power_watt, efficiency_percentage, area_m2, price_unit, degradation_rate_year, lifespan_years, created_at, noct_celsius, temp_coefficient, inverter_efficiency_pct, wiring_losses_pct, cost_per_watt_eur, link_buy, technical_sheet) FROM stdin;
a764d8ab-0887-49de-a652-2d30c46b8158	SunPower	Maxeon 3 400W	400.00	22.60	1.69	320.00	0.25	25	2026-04-01 02:03:49.774306+02	45.00	-0.0029	97.00	2.00	\N	\N	\N
a7f3f3e1-9142-47c3-a003-11be6db2eb66	Jinko Solar	Tiger Neo 420W	420.00	21.60	1.88	180.00	0.40	25	2026-04-01 02:07:26.447545+02	43.00	-0.0030	97.00	2.00	\N	\N	\N
f3401b29-9cee-41c6-ae37-5a0925038124	Canadian Solar	HiHero 430W	430.00	22.80	1.72	210.00	0.40	25	2026-04-01 02:07:26.447545+02	44.00	-0.0030	97.00	2.00	\N	\N	\N
fa3bad34-48c9-4abc-9117-6651a2f9481b	Longi Solar	Hi-MO 6 440W	440.00	22.80	1.92	160.00	0.40	25	2026-04-01 02:07:26.447545+02	45.00	-0.0032	97.00	2.00	\N	\N	\N
761218dd-0025-480a-a4d9-3392cc9ddbd4	LONGi	Hi-MO X6 Explorer LR5-54HTH 440M	440.00	22.50	1.96	185.00	0.40	25	2026-05-04 12:52:06.273422+02	45.00	-0.0030	97.50	1.50	0.4205	https://efectosolar.es/tienda/paneles-solares/longi-solar-scientist-hi-mo6-440w-marco-negro/	https://www.longi.com/en/products/modules/hi-mo-6-explorer/
33299ba2-1897-4a19-93c6-41c813260b8d	JA Solar	JAM54D40-420/LB	420.00	21.50	1.95	165.00	0.40	25	2026-05-04 12:52:06.273422+02	45.00	-0.0030	97.50	1.50	0.3929	https://www.jasolar.com/html/en/product/JAM54D40/	https://www.jasolar.com/uploadfiles/2023/06/JAM54D40-410-435MB_EN.pdf
2b39a966-8cd2-4df8-bb33-f48c6b6a47f5	Trina Solar	Vertex S+ TSM-NEG9R.28 430W	430.00	22.30	1.93	175.00	0.40	25	2026-05-04 12:52:06.273422+02	45.00	-0.0029	97.50	1.50	0.4070	https://www.trinasolar.com/en-glb/product/vertex-s-plus	https://www.trinasolar.com/sites/default/files/2023-10/Vertex_S%2B_TSM-NEG9R.28_EN.pdf
80717fa5-93a9-4be6-8e7e-306c02158230	REC	Alpha Pure-RX 430W	430.00	22.30	1.93	280.00	0.25	25	2026-05-04 12:52:06.273422+02	43.00	-0.0024	97.50	1.50	0.6512	https://www.recgroup.com/es/products/rec-alpha-pure-rx-series	https://www.recgroup.com/sites/default/files/documents/ds_rec_alpha_pure-rx_en.pdf
e7f37df2-a6f8-460f-b782-26709317c414	SunPower	Maxeon 7 AC 440W	440.00	22.80	1.93	420.00	0.25	40	2026-05-04 12:52:06.273422+02	45.00	-0.0027	97.50	1.50	0.9545	https://sunpower.com/en-us/residential/panels-technology/maxeon-solar-panels/	https://us.sunpower.com/sites/default/files/sunpower-maxeon-7-panel-datasheet.pdf
dca19139-2270-4f7c-beca-5969b502adba	Jinko Solar	Tiger Neo JKM440N-54HL4R-V	440.00	22.02	2.00	170.00	0.40	30	2026-05-04 12:52:06.273422+02	45.00	-0.0029	97.50	1.50	0.3864	https://www.jinkosolar.com/en/site/productDetail?id=1	https://www.jinkosolar.com/uploads/Tiger_Neo_N-type_54HL4R_EN.pdf
ce7406e2-ff92-4772-a970-2fbf5c9f7aa6	Canadian Solar	HiHero CS6R-430H	430.00	22.50	1.91	230.00	0.30	25	2026-05-04 12:52:06.273422+02	44.00	-0.0026	97.50	1.50	0.5349	https://www.canadiansolar.com/hihero/	https://www.canadiansolar.com/wp-content/uploads/2023/09/Canadian_Solar-Datasheet-HiHero_CS6R-MS_EN.pdf
e193c901-d54c-432f-98b1-df435b874849	Qcells	Q.TRON BFR-G2+ 420W	420.00	21.40	1.96	145.00	0.45	25	2026-05-04 12:52:06.273422+02	45.00	-0.0034	97.50	1.50	0.3452	https://www.q-cells.es/productos/	https://www.q-cells.com/uploads/tx_abdownloads/files/Datasheet_Q.TRON_BFR-G2_plus_2023_Rev01_EN.pdf
2810148f-b9f2-4769-88e5-da11b971b98f	Panasonic	EverVolt HK Black EVPV410HK	410.00	21.20	1.93	320.00	0.26	25	2026-05-04 12:52:06.273422+02	43.00	-0.0026	97.50	1.50	0.7805	https://eu.panasonic.com/es/professional/building-products-solutions/solar/solar-panels.html	https://eu.panasonic.com/content/dam/pew/en/professional/building-products-solutions/solar/solar-panels/evervolt-hk-black/EVPV_HK_Black_Series_Datasheet_EN.pdf
9290bd66-1c92-493c-9e44-2990ccf4399d	Risen Energy	Hyper-ion RSM40-8-400M	400.00	20.80	1.92	135.00	0.40	25	2026-05-04 12:52:06.273422+02	45.00	-0.0026	97.50	1.50	0.3375	https://www.risen-energy.com/products/hyper-ion-series/	https://www.risen-energy.com/uploads/Hyper-ion_RSM40-8_EN.pdf
\.


--
-- TOC entry 5139 (class 0 OID 26162)
-- Dependencies: 229
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, created_at, updated_at, deleted_at, firebase_uid, role) FROM stdin;
8f432ca1-ea50-4382-a117-08fbbed23ca8	test	test@gmail,.com	2026-02-14 03:50:30.916964+01	2026-04-20 00:06:38.439392+02	\N	8f432ca1-ea50-4382-a117-08fbbed23ca8	user
4c4e5758-172e-4f43-9943-faf0eb5e3d62	Test User	test@example.com	2026-04-20 00:06:59.046945+02	2026-04-20 00:06:59.046945+02	\N	test-user-123	user
f0ef8c1b-73c9-4b3a-a8a1-e068de7a5661	Orlando	orlando@test.com	2026-04-02 03:21:15.754185+02	2026-04-20 00:06:38.439392+02	\N	f0ef8c1b-73c9-4b3a-a8a1-e068de7a5661	admin
a1e78346-84fd-49e4-90bd-78e1eeff1bab	Orlando	orlando@gmail.com	2026-06-11 00:02:11.67585+02	2026-06-11 00:02:11.67585+02	\N	TuqvSFCuatTIFbVUoDRnpMmZXR32	user
d35fc8a5-62df-4131-89be-a55a6d5fa7d7	test	test@gmail.com	2026-06-20 01:55:15.361371+02	2026-06-20 01:55:15.361371+02	\N	KSAm3jY9ciSagTJ63RUgQlVI8Cr1	user
\.


--
-- TOC entry 4937 (class 2606 OID 26175)
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- TOC entry 4939 (class 2606 OID 26177)
-- Name: energy_consumptions energy_consumptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.energy_consumptions
    ADD CONSTRAINT energy_consumptions_pkey PRIMARY KEY (id);


--
-- TOC entry 4944 (class 2606 OID 26179)
-- Name: installation_plans installation_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installation_plans
    ADD CONSTRAINT installation_plans_pkey PRIMARY KEY (id);


--
-- TOC entry 4946 (class 2606 OID 26181)
-- Name: installations installations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installations
    ADD CONSTRAINT installations_pkey PRIMARY KEY (id);


--
-- TOC entry 4948 (class 2606 OID 26183)
-- Name: inversores inversores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inversores
    ADD CONSTRAINT inversores_pkey PRIMARY KEY (id);


--
-- TOC entry 4950 (class 2606 OID 26185)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 4953 (class 2606 OID 26187)
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- TOC entry 4955 (class 2606 OID 26189)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 4957 (class 2606 OID 26191)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4959 (class 2606 OID 26193)
-- Name: simulations simulations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simulations
    ADD CONSTRAINT simulations_pkey PRIMARY KEY (id);


--
-- TOC entry 4961 (class 2606 OID 26195)
-- Name: solar_panels solar_panels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solar_panels
    ADD CONSTRAINT solar_panels_pkey PRIMARY KEY (id);


--
-- TOC entry 4942 (class 2606 OID 26197)
-- Name: energy_consumptions unique_property_month_year; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.energy_consumptions
    ADD CONSTRAINT unique_property_month_year UNIQUE (property_id, month, year);


--
-- TOC entry 4964 (class 2606 OID 26199)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4966 (class 2606 OID 26201)
-- Name: users users_firebase_uid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_firebase_uid_key UNIQUE (firebase_uid);


--
-- TOC entry 4968 (class 2606 OID 26203)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4940 (class 1259 OID 26204)
-- Name: idx_energy_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_energy_user_id ON public.energy_consumptions USING btree (user_id);


--
-- TOC entry 4951 (class 1259 OID 26205)
-- Name: idx_properties_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_properties_user_id ON public.properties USING btree (user_id);


--
-- TOC entry 4962 (class 1259 OID 26206)
-- Name: idx_users_firebase_uid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_firebase_uid ON public.users USING btree (firebase_uid);


--
-- TOC entry 4969 (class 2606 OID 26207)
-- Name: energy_consumptions energy_consumptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.energy_consumptions
    ADD CONSTRAINT energy_consumptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4970 (class 2606 OID 26212)
-- Name: energy_consumptions fk_energy_property; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.energy_consumptions
    ADD CONSTRAINT fk_energy_property FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- TOC entry 4973 (class 2606 OID 26217)
-- Name: installations fk_install_plan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installations
    ADD CONSTRAINT fk_install_plan FOREIGN KEY (installation_plan_id) REFERENCES public.installation_plans(id);


--
-- TOC entry 4974 (class 2606 OID 26222)
-- Name: installations fk_install_project; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installations
    ADD CONSTRAINT fk_install_project FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- TOC entry 4971 (class 2606 OID 26227)
-- Name: installation_plans fk_plan_project; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installation_plans
    ADD CONSTRAINT fk_plan_project FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- TOC entry 4972 (class 2606 OID 26232)
-- Name: installation_plans fk_plan_sim; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installation_plans
    ADD CONSTRAINT fk_plan_sim FOREIGN KEY (simulation_id) REFERENCES public.simulations(id);


--
-- TOC entry 4975 (class 2606 OID 26237)
-- Name: projects fk_project_company; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_project_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE RESTRICT;


--
-- TOC entry 4976 (class 2606 OID 26242)
-- Name: projects fk_project_property; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_project_property FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- TOC entry 4977 (class 2606 OID 26247)
-- Name: projects fk_project_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_project_user FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);


--
-- TOC entry 4978 (class 2606 OID 26252)
-- Name: properties fk_property_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT fk_property_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4979 (class 2606 OID 26257)
-- Name: simulations fk_sim_panel; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simulations
    ADD CONSTRAINT fk_sim_panel FOREIGN KEY (panel_id) REFERENCES public.solar_panels(id);


--
-- TOC entry 4980 (class 2606 OID 26262)
-- Name: simulations fk_sim_project; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simulations
    ADD CONSTRAINT fk_sim_project FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- TOC entry 4981 (class 2606 OID 26267)
-- Name: simulations fk_sim_property; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simulations
    ADD CONSTRAINT fk_sim_property FOREIGN KEY (property_id) REFERENCES public.properties(id);


-- Completed on 2026-06-22 05:11:07

--
-- PostgreSQL database dump complete
--

\unrestrict IVtcCkYvdrBU5zR1a4qWAktbP3MJyIoDTfFWvrQFd28F97TVVaJox5YFbXedlfL

