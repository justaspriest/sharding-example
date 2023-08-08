CREATE TABLE IF NOT EXISTS public.goods
(
	id SERIAL,
	name TEXT,
	price NUMERIC
	--CONSTRAINT goods_partiotin_pkey PRIMARY KEY (price)
)
PARTITION BY RANGE (price);

CREATE EXTENSION IF NOT EXISTS postgres_fdw;

GRANT USAGE ON FOREIGN DATA WRAPPER postgres_fdw TO johndoe;

-- SHARD01

CREATE SERVER IF NOT EXISTS shard01
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (dbname 'sharding_test', host '172.18.0.3', port '5432');

CREATE USER MAPPING IF NOT EXISTS FOR johndoe
SERVER shard01
OPTIONS (user 'johndoe', password 'secret');

CREATE FOREIGN TABLE IF NOT EXISTS public.goods_shard01
PARTITION OF public.goods
FOR VALUES FROM (0) TO (50)
SERVER shard01
OPTIONS (schema_name 'public', table_name 'goods');

-- SHARD02

CREATE SERVER IF NOT EXISTS shard02
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (dbname 'sharding_test', host '172.18.0.4', port '5432');

CREATE USER MAPPING IF NOT EXISTS FOR johndoe
SERVER shard02
OPTIONS (user 'johndoe', password 'secret');

CREATE FOREIGN TABLE IF NOT EXISTS public.goods_shard02
PARTITION OF public.goods
FOR VALUES FROM (50) TO (MAXVALUE)
SERVER shard02
OPTIONS (schema_name 'public', table_name 'goods');

-- COMMON RULES



