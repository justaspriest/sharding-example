const { Pool } = require('pg');

const pool = new Pool({
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME
});

const createGood = async (name, price) => {
	const client = await pool.connect();
	
	try {
		const query = `INSERT INTO "goods" ("name", "price") VALUES ($1,$2)`;
		return await client.query(query, [ name, price ]);
	} finally {
		await client.release();
	}

	return null;
};

const createOrder = async (shopId) => {
	const client = await pool.connect();

	try {
		const timestamp = new Date().toISOString();
		const query = `INSERT INTO "orders" ("shop_id", "created_at") VALUES ($1,$2)`;
		await client.query(query, [ shopId, timestamp ]);
	} catch (err) {
		console.error(err);
		return false;
	} finally {
		await client.release();
	}

	return true;
};

const getGoods = async () => {
	const client = await pool.connect();

	try {
		const query = 'SELECT * FROM "goods"';
		const data = await client.query(query);
		return data.rows;
	} finally {
		await client.release();
	}

	return [];
};

const create = (data) => {
	return Promise.resolve(createGood(data.name, data.price));
};

const get = () => {
	return Promise.resolve(getGoods());
};

module.exports = { create, get };

