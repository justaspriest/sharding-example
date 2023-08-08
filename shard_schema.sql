-- SHARD DATABASE SCHEMA

CREATE TABLE IF NOT EXISTS public.goods (
	id SERIAL PRIMARY KEY,
	name TEXT,
	price NUMERIC
);

CREATE TABLE IF NOT EXISTS public.orders (
	id SERIAL PRIMARY KEY,
	shop_id integer,
	created_at timestamp
);
