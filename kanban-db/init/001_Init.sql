--
-- PostgreSQL database dump
--

\restrict EvxnvH1M1EluaeGTbhlYf7Dq3HvRKtNXtyhBjk0ehZyWXVv8hgjSICXHveTwwX0

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-10-05 12:33:56

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
-- TOC entry 238 (class 1255 OID 16479)
-- Name: delete_board(integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.delete_board(IN p_board_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM boards WHERE id = p_board_id;
END;
$$;


ALTER PROCEDURE public.delete_board(IN p_board_id integer) OWNER TO postgres;

--
-- TOC entry 240 (class 1255 OID 16468)
-- Name: get_all_boards(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_all_boards() RETURNS json
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN (
    SELECT json_agg(
      json_build_object(
        'id', b.id,
        'name', b.name,
        'columns', COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', c.id,
                'name', c.name,
                'color', c.color,
                'tasks', COALESCE(
                  (
                    SELECT json_agg(
                      json_build_object(
                        'id', t.id,
                        'title', t.title,
                        'description', t.description,
                        'status', t.status,
                        'subtasks', COALESCE(
                          (
                            SELECT json_agg(
                              json_build_object(
                                'id', st.id,
                                'title', st.title,
                                'isCompleted', st.is_completed
                              )
                            )
                            FROM subtasks st
                            WHERE st.task_id = t.id
                          ), '[]'::json
                        )
                      )
                    )
                    FROM tasks t
                    WHERE t.column_id = c.id
                  ), '[]'::json
                )
              )
            )
            FROM board_columns c
            WHERE c.board_id = b.id
          ), '[]'::json
        )
      )
    )
    FROM boards b
  );
END;
$$;


ALTER FUNCTION public.get_all_boards() OWNER TO postgres;

--
-- TOC entry 236 (class 1255 OID 16451)
-- Name: get_full_board(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_full_board(p_board_id integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'id', b.id,
      'name', b.name,
      'columns', (
        SELECT COALESCE(json_agg(
          json_build_object(
            'id', c.id,
            'name', c.name,
            'color', c.color,
            'tasks', (
              SELECT COALESCE(json_agg(
                json_build_object(
                  'id', t.id,
                  'title', t.title,
                  'description', t.description,
                  'subtasks', (
                    SELECT COALESCE(json_agg(
                      json_build_object(
                        'id', s.id,
                        'title', s.title,
                        'isCompleted', s.is_completed
                      )
                    ), '[]'::json)
                    FROM subtasks s
                    WHERE s.task_id = t.id
                  )
                )
              ), '[]'::json)
              FROM tasks t
              WHERE t.column_id = c.id
            )
          )
        ), '[]'::json)
        FROM board_columns c
        WHERE c.board_id = b.id
      )
    )
    FROM boards b
    WHERE b.id = p_board_id
  );
END;
$$;


ALTER FUNCTION public.get_full_board(p_board_id integer) OWNER TO postgres;

--
-- TOC entry 237 (class 1255 OID 16453)
-- Name: save_board(integer, text, json); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.save_board(p_id integer DEFAULT NULL::integer, p_name text DEFAULT NULL::text, p_columns json DEFAULT '[]'::json) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_board_id INT;
BEGIN
  IF p_id IS NULL THEN
    INSERT INTO boards (name)
    VALUES (p_name)
    RETURNING id INTO v_board_id;
  ELSE
    UPDATE boards
    SET name = p_name
    WHERE id = p_id;

    v_board_id := p_id;
  END IF;

  IF json_array_length(p_columns) >= 0 THEN
	  DELETE FROM board_columns
	  WHERE board_id = v_board_id;
		
	  INSERT INTO board_columns (board_id, name, color)
	  SELECT
		v_board_id,
		col->>'name',
		col->>'color'
	  FROM json_array_elements(p_columns) AS col;	
  END IF;

  RETURN (
    SELECT json_build_object(
      'id', b.id,
      'name', b.name,
      'columns', COALESCE(
        (SELECT json_agg(
            json_build_object(
              'id', c.id,
              'name', c.name,
              'color', c.color
            )
          )
          FROM board_columns c
          WHERE c.board_id = b.id
        ), '[]'::json
      )
    )
    FROM boards b
    WHERE b.id = v_board_id
  );
END;
$$;


ALTER FUNCTION public.save_board(p_id integer, p_name text, p_columns json) OWNER TO postgres;

--
-- TOC entry 239 (class 1255 OID 16465)
-- Name: save_task(integer, text, text, text, integer, json); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.save_task(p_id integer DEFAULT NULL::integer, p_title text DEFAULT NULL::text, p_description text DEFAULT NULL::text, p_status text DEFAULT NULL::text, p_column_id integer DEFAULT NULL::integer, p_subtasks json DEFAULT '[]'::json) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_task_id INT;
BEGIN
  IF p_id IS NULL THEN
    INSERT INTO tasks (title, description, status, column_id)
    VALUES (p_title, p_description, p_status, p_column_id)
    RETURNING id INTO v_task_id;
  ELSE
    UPDATE tasks
    SET title = p_title,
        description = p_description,
        status = p_status,
        column_id = p_column_id
    WHERE id = p_id;

    v_task_id := p_id;
  END IF;

	IF json_array_length(p_subtasks) >= 0 THEN
		DELETE FROM subtasks
		WHERE task_id = v_task_id;
		
		INSERT INTO subtasks (task_id, title, is_completed)
		SELECT
			v_task_id,
			s->>'title',
			COALESCE((s->>'isCompleted')::BOOLEAN, FALSE)
		FROM json_array_elements(p_subtasks) s;
  END IF;

  -- Return updated/created task with subtasks
  RETURN (
    SELECT json_build_object(
      'id', t.id,
      'title', t.title,
      'description', t.description,
      'status', t.status,
      'subtasks', COALESCE(
        (SELECT json_agg(
            json_build_object(
              'id', st.id,
              'title', st.title,
              'isCompleted', st.is_completed
            )
          )
          FROM subtasks st
          WHERE st.task_id = t.id
        ), '[]'::json
      )
    )
    FROM tasks t
    WHERE t.id = v_task_id
  );
END;
$$;


ALTER FUNCTION public.save_task(p_id integer, p_title text, p_description text, p_status text, p_column_id integer, p_subtasks json) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16400)
-- Name: board_columns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.board_columns (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    color character varying(255) NOT NULL,
    board_id integer NOT NULL
);


ALTER TABLE public.board_columns OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16399)
-- Name: board_column_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.board_column_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.board_column_id_seq OWNER TO postgres;

--
-- TOC entry 4927 (class 0 OID 0)
-- Dependencies: 219
-- Name: board_column_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.board_column_id_seq OWNED BY public.board_columns.id;


--
-- TOC entry 222 (class 1259 OID 16409)
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    status character varying(255) NOT NULL,
    column_id integer NOT NULL
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16408)
-- Name: board_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.board_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.board_tasks_id_seq OWNER TO postgres;

--
-- TOC entry 4928 (class 0 OID 0)
-- Dependencies: 221
-- Name: board_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.board_tasks_id_seq OWNED BY public.tasks.id;


--
-- TOC entry 218 (class 1259 OID 16390)
-- Name: boards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.boards (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.boards OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16389)
-- Name: boards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.boards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.boards_id_seq OWNER TO postgres;

--
-- TOC entry 4929 (class 0 OID 0)
-- Dependencies: 217
-- Name: boards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.boards_id_seq OWNED BY public.boards.id;


--
-- TOC entry 224 (class 1259 OID 16433)
-- Name: subtasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subtasks (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    is_completed boolean NOT NULL,
    task_id integer NOT NULL
);


ALTER TABLE public.subtasks OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16432)
-- Name: task_subtasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.task_subtasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.task_subtasks_id_seq OWNER TO postgres;

--
-- TOC entry 4930 (class 0 OID 0)
-- Dependencies: 223
-- Name: task_subtasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.task_subtasks_id_seq OWNED BY public.subtasks.id;


--
-- TOC entry 4763 (class 2604 OID 16403)
-- Name: board_columns id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board_columns ALTER COLUMN id SET DEFAULT nextval('public.board_column_id_seq'::regclass);


--
-- TOC entry 4762 (class 2604 OID 16393)
-- Name: boards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boards ALTER COLUMN id SET DEFAULT nextval('public.boards_id_seq'::regclass);


--
-- TOC entry 4765 (class 2604 OID 16436)
-- Name: subtasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subtasks ALTER COLUMN id SET DEFAULT nextval('public.task_subtasks_id_seq'::regclass);


--
-- TOC entry 4764 (class 2604 OID 16412)
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.board_tasks_id_seq'::regclass);


--
-- TOC entry 4769 (class 2606 OID 16407)
-- Name: board_columns board_column_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board_columns
    ADD CONSTRAINT board_column_pkey PRIMARY KEY (id);


--
-- TOC entry 4771 (class 2606 OID 16416)
-- Name: tasks board_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT board_tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 4767 (class 2606 OID 16395)
-- Name: boards boards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boards
    ADD CONSTRAINT boards_pkey PRIMARY KEY (id);


--
-- TOC entry 4773 (class 2606 OID 16438)
-- Name: subtasks task_subtasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subtasks
    ADD CONSTRAINT task_subtasks_pkey PRIMARY KEY (id);


--
-- TOC entry 4774 (class 2606 OID 16454)
-- Name: board_columns board_columns_board_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board_columns
    ADD CONSTRAINT board_columns_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.boards(id) ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4776 (class 2606 OID 16460)
-- Name: subtasks subtasks_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subtasks
    ADD CONSTRAINT subtasks_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4775 (class 2606 OID 16474)
-- Name: tasks tasks_column_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_column_id_fkey FOREIGN KEY (column_id) REFERENCES public.board_columns(id) ON DELETE CASCADE NOT VALID;


-- Completed on 2025-10-05 12:33:56

--
-- PostgreSQL database dump complete
--

\unrestrict EvxnvH1M1EluaeGTbhlYf7Dq3HvRKtNXtyhBjk0ehZyWXVv8hgjSICXHveTwwX0

