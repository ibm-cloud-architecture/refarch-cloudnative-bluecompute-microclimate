const appName = require('./../../package').name;
const express = require('express');
const localConfig = require('./../config/local.json');
const log4js = require('log4js');
const rp = require('request-promise');

const logger = log4js.getLogger(appName);

module.exports = function(app) {
	var router = express.Router();
	logger.info("Enter");

	router.get('/', function(req, res, next) {
		getCatalogItems().then(function(items) {
			logger.info(`Obtained ${items.length} items:`);
			logger.info(items);
			res.json(items);

		}).catch(function(err) {
			logger.error("Something happened:");
			logger.error(err);
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

	logger.info(`Using endpoint: ${options.uri}`);
	return rp.get(options);
}