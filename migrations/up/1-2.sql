--
-- Name: users; Type: TABLE; Schema: public 
--

CREATE TABLE users (
    id serial,
    username character varying(100) NOT NULL,
    password character varying(400) NOT NULL,
    email character varying(200) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT pk_users PRIMARY KEY (id)
);

ALTER TABLE users
  ADD UNIQUE ("username"),
  ADD UNIQUE ("email");

--
-- Name: user_tokens; Type: TABLE; Schema: public
--

CREATE TABLE user_tokens (
    id serial,
    user_id integer NOT NULL,
    token character varying(400) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone DEFAULT now(),
    CONSTRAINT pk_user_tokens PRIMARY KEY (id),
    CONSTRAINT fk_user_tokens_user_id FOREIGN KEY (user_id) REFERENCES "users" (id) ON UPDATE RESTRICT ON DELETE CASCADE
);

CREATE INDEX "user_tokens.token" ON user_tokens (token ASC NULLS LAST);