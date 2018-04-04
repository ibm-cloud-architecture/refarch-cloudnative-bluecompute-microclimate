const express = require('express');
const rp = require('request-promise');
const localConfig = require('./../config/local.json');

module.exports = function(app) {
	var router = express.Router();

	router.get('/', function(req, res, next) {
		getCatalogItems().then(function(items) {
			res.json(items);

		}).catch(function(err) {
		    res.status(500).send({ error: 'Something failed!' });
		});
	});

	app.use("/catalog", router);
}

function getCatalogEndpoint() {
	const protocol = process.env.CATALOG_PROTOCOL || localConfig.catalog.protocol;
	const host = process.env.CATALOG_HOST || localConfig.catalog.host;
	const port = process.env.CATALOG_PORT || localConfig.catalog.port;

	return `${protocol}://${host}:${port}`;
}

function getCatalogItems() {
	const catalogEndpoint = getCatalogEndpoint();
	const options = {
		uri: `${catalogEndpoint}/micro/items`,
		json: true
	};
	return rp.get(options);
}