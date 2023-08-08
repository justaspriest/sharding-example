CREATE TABLE IF NOT EXISTS public.goods
(
	id SERIAL,
	name TEXT,
	price NUMERIC
)
PARTITION BY RANGE (price);

CREATE TABLE IF NOT EXISTS public.orders
(
	id SERIAL,
	shop_id integer,
	created_at timestamp
)
PARTITION BY HASH (shop_id);


CREATE EXTENSION IF NOT EXISTS postgres_fdw;

GRANT USAGE ON FOREIGN DATA WRAPPER postgres_fdw TO johndoe;

-- SHARD01

-- - CONNECTION

CREATE SERVER IF NOT EXISTS shard01
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (dbname 'sharding_test', host '172.18.0.3', port '5432');

CREATE USER MAPPING IF NOT EXISTS FOR johndoe
SERVER shard01
OPTIONS (user 'johndoe', password 'secret');

-- - DATA

CREATE FOREIGN TABLE IF NOT EXISTS public.goods_shard01
PARTITION OF public.goods
FOR VALUES FROM (0) TO (50)
SERVER shard01
OPTIONS (schema_name 'public', table_name 'goods');

CREATE FOREIGN TABLE IF NOT EXISTS public.orders_shard01
PARTITION OF public.orders
FOR VALUES WITH (modulus 2, remainder 0)
SERVER shard01
OPTIONS (schema_name 'public', table_name 'orders');

-- SHARD02

-- - CONNECTION

CREATE SERVER IF NOT EXISTS shard02
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (dbname 'sharding_test', host '172.18.0.4', port '5432');

CREATE USER MAPPING IF NOT EXISTS FOR johndoe
SERVER shard02
OPTIONS (user 'johndoe', password 'secret');

-- - DATA

CREATE FOREIGN TABLE IF NOT EXISTS public.goods_shard02
PARTITION OF public.goods
FOR VALUES FROM (50) TO (MAXVALUE)
SERVER shard02
OPTIONS (schema_name 'public', table_name 'goods');

CREATE FOREIGN TABLE IF NOT EXISTS public.orders_shard02
PARTITION OF public.orders
FOR VALUES WITH (modulus 2, remainder 1)
SERVER shard02
OPTIONS (schema_name 'public', table_name 'orders');


-- COMMON RULES



