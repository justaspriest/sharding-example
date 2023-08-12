const { Pool } = require('pg');

const pool = new Pool({
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME
});

const createOrder = async (shopId) => {
	const client = await pool.connect();

	try {
		const timestamp = new Date().toISOString();
		const query = `INSERT INTO "orders" ("shop_id", "created_at") VALUES ($1,$2) RETURNING *`;
		const result = await client.query(query, [ shopId, timestamp ]);
		return result.rows[0];
	} finally {
		await client.release();
	}

	return null;
};

const getOrders = async () => {
	const client = await pool.connect();

	try {
		const query = 'SELECT * FROM "orders"';
		const data = await client.query(query);
		return data.rows;
	} finally {
		await client.release();
	}

	return [];
};

const create = (data) => {
	return Promise.resolve(createOrder(data.shopId));
};

const get = () => {
	return Promise.resolve(getOrders());
};

module.exports = { create, get };

