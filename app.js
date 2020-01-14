const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { Mongo } = require("./infra/Mongo");

// Initialize mongo db
Mongo.connect();

const inventoriesRouter = require('./routes/inventories');
const ordersRouter = require('./routes/orders');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Initialize routes
app.use('/inventories', inventoriesRouter);
app.use('/orders', ordersRouter);

module.exports = app;
