require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

const authRoute = require('./routes/auth');
const managmentRoute = require('./routes/managment');
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});
app.use('/auth', authRoute);

app.use((error, req, res, next) => {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message;
	res.status(status).json({ message: message });
});
app.use('/managment', managmentRoute);

mongoose.connect(process.env.MONGODB_URI, (result) => {
	app.listen(8080, () => {
		console.log('heeeesy i am on port 8080');
	});
});
