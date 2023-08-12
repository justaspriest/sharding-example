const path = require('path');
require('dotenv').config({
	override: true,
	path: path.join(__dirname, 'dev.env')
});
const { Pool } = require('pg');
const express = require('express');

const goodsUtils = require('./goods-utils');
const ordersUtils = require('./orders-utils');

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get('/api/v1/goods', (req, res) => {
	goodsUtils.get().then((data, err) => {
		if (err) {
			console.log('error', err);
		}

		res.send(data);
	});
});

server.post('/api/v1/goods', (req, res) => {
	goodsUtils.create(req.body).then((data, err) => {
		if (err) {
			console.log('error', err);
		}

		res.send(data);
	});
});

server.get('/api/v1/orders', (req, res) => {
	ordersUtils.get().then((data, err) => {
		if (err) {
			console.log('error', err);
		}

		res.send(data);
	});
});

server.post('/api/v1/orders', (req, res) => {
	ordersUtils.create(req.body).then((data, err) => {
		if (err) {
			console.log('error', err);
		}

		res.send(data);
	});
});


const port = process.env.API_PORT;
server.listen(port, () => {
	console.log(`Server started on port ${port}`);
});


