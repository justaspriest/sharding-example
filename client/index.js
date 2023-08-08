const path = require('path');
require('dotenv').config({
	override: true,
	path: path.join(__dirname, 'dev.env')
});
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
		await client.query(query, [ name, price ]);
	} catch(err) {
		console.error(err);
		return false;
	} finally {
		await client.release();
	}

	return true;
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

createGood('Good#1', 32).then(console.log);
createGood('Good#2', 666.0).then(console.log);

createOrder(1).then(console.log);
createOrder(2).then(console.log);
createOrder(1).then(console.log);
createOrder(3).then(console.log);

