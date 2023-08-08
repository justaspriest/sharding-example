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

const insertGood = async (name, price) => {
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

insertGood('Good#1', 32).then((result) => console.log(result));
insertGood('Good#2', 666.0).then((result) => console.log(result));

