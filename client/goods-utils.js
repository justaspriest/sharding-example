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
		const query = `INSERT INTO "goods" ("name", "price") VALUES ($1,$2) RETURNING *`;
		const result = await client.query(query, [ name, price ]);
		return result.rows[0];
	} finally {
		await client.release();
	}

	return null;
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

