-- SHARD DATABASE SCHEMA

CREATE TABLE IF NOT EXISTS public.goods (
	id SERIAL PRIMARY KEY,
	name TEXT,
	price NUMERIC
);

