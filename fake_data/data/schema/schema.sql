--
-- PostgreSQL database dump
--

-- Dumped from database version 14.9 (Ubuntu 14.9-1.pgdg22.04+1)
-- Dumped by pg_dump version 16.0 (Ubuntu 16.0-1.pgdg22.04+1)

-- Started on 2023-09-28 16:26:21 IST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 3408 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 212 (class 1259 OID 26001)
-- Name: forms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forms (
    id bigint NOT NULL,
    author_id bigint NOT NULL,
    title character varying(100) DEFAULT 'Untitled Form'::character varying NOT NULL,
    description character varying(300) DEFAULT ''::character varying NOT NULL,
    quiz_setting jsonb DEFAULT '{"is_quiz": true, "default_points": 1}'::jsonb NOT NULL,
    response_setting jsonb DEFAULT '{"collect_email": false, "send_res_copy": false, "allow_edit_res": false}'::jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT chk_forms_title CHECK ((char_length((title)::text) > 5))
);


ALTER TABLE public.forms OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 26000)
-- Name: forms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.forms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.forms_id_seq OWNER TO postgres;

--
-- TOC entry 3410 (class 0 OID 0)
-- Dependencies: 211
-- Name: forms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.forms_id_seq OWNED BY public.forms.id;


--
-- TOC entry 216 (class 1259 OID 26046)
-- Name: que_seqs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.que_seqs (
    id bigint NOT NULL,
    author_id bigint NOT NULL,
    form_id bigint NOT NULL,
    question_seq integer[] DEFAULT ARRAY[]::integer[],
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.que_seqs OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 26045)
-- Name: que_seqs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.que_seqs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.que_seqs_id_seq OWNER TO postgres;

--
-- TOC entry 3411 (class 0 OID 0)
-- Dependencies: 215
-- Name: que_seqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.que_seqs_id_seq OWNED BY public.que_seqs.id;


--
-- TOC entry 214 (class 1259 OID 26016)
-- Name: questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questions (
    id bigint NOT NULL,
    is_required boolean DEFAULT true NOT NULL,
    ques_type text DEFAULT 'mcq'::text NOT NULL,
    title character varying(100) DEFAULT 'Untitled question'::character varying NOT NULL,
    description character varying(200) DEFAULT ''::character varying NOT NULL,
    options text[],
    correct_ans text[],
    points bigint DEFAULT 1,
    author_id bigint NOT NULL,
    form_id bigint NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT chk_questions_correct_ans CHECK ((array_length(correct_ans, 1) < 100)),
    CONSTRAINT chk_questions_options CHECK ((array_length(options, 1) < 100)),
    CONSTRAINT chk_questions_points CHECK ((points > 0)),
    CONSTRAINT chk_questions_ques_type CHECK ((ques_type = ANY (ARRAY['mcq'::text, 'checkbox'::text, 'short'::text, 'long'::text, 'dropdown'::text, 'date'::text, 'time'::text]))),
    CONSTRAINT chk_questions_title CHECK ((char_length((title)::text) > 0))
);


ALTER TABLE public.questions OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 26015)
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.questions_id_seq OWNER TO postgres;

--
-- TOC entry 3412 (class 0 OID 0)
-- Dependencies: 213
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;


--
-- TOC entry 218 (class 1259 OID 27263)
-- Name: responses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.responses (
    id bigint NOT NULL,
    user_email text,
    form_id bigint,
    answers bytea,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.responses OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 27262)
-- Name: responses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.responses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.responses_id_seq OWNER TO postgres;

--
-- TOC entry 3413 (class 0 OID 0)
-- Dependencies: 217
-- Name: responses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.responses_id_seq OWNED BY public.responses.id;


--
-- TOC entry 210 (class 1259 OID 25823)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(20) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    CONSTRAINT chk_users_email CHECK (((email)::text ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'::text))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 25822)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3414 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3226 (class 2604 OID 26004)
-- Name: forms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forms ALTER COLUMN id SET DEFAULT nextval('public.forms_id_seq'::regclass);


--
-- TOC entry 3237 (class 2604 OID 26049)
-- Name: que_seqs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.que_seqs ALTER COLUMN id SET DEFAULT nextval('public.que_seqs_id_seq'::regclass);


--
-- TOC entry 3231 (class 2604 OID 26019)
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);


--
-- TOC entry 3239 (class 2604 OID 27266)
-- Name: responses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.responses ALTER COLUMN id SET DEFAULT nextval('public.responses_id_seq'::regclass);


--
-- TOC entry 3225 (class 2604 OID 25826)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3251 (class 2606 OID 26009)
-- Name: forms forms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_pkey PRIMARY KEY (id);


--
-- TOC entry 3256 (class 2606 OID 26053)
-- Name: que_seqs que_seqs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.que_seqs
    ADD CONSTRAINT que_seqs_pkey PRIMARY KEY (id);


--
-- TOC entry 3253 (class 2606 OID 26032)
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- TOC entry 3259 (class 2606 OID 27270)
-- Name: responses responses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.responses
    ADD CONSTRAINT responses_pkey PRIMARY KEY (id);


--
-- TOC entry 3249 (class 2606 OID 25829)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3254 (class 1259 OID 26059)
-- Name: idx_que_seqs_form_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_que_seqs_form_id ON public.que_seqs USING btree (form_id);


--
-- TOC entry 3257 (class 1259 OID 27770)
-- Name: idx_response_multi; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_response_multi ON public.responses USING btree (user_email, form_id);


--
-- TOC entry 3247 (class 1259 OID 27764)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 3263 (class 2606 OID 26054)
-- Name: que_seqs fk_forms_que_seq; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.que_seqs
    ADD CONSTRAINT fk_forms_que_seq FOREIGN KEY (id) REFERENCES public.forms(id);


--
-- TOC entry 3261 (class 2606 OID 26033)
-- Name: questions fk_forms_questions; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT fk_forms_questions FOREIGN KEY (form_id) REFERENCES public.forms(id);


--
-- TOC entry 3260 (class 2606 OID 26010)
-- Name: forms fk_users_forms; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT fk_users_forms FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- TOC entry 3262 (class 2606 OID 26038)
-- Name: questions fk_users_questions; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT fk_users_questions FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- TOC entry 3409 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2023-09-28 16:26:21 IST

--
-- PostgreSQL database dump complete
--

