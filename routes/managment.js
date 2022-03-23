const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');
const managmentController = require('../controller/managment');

const { check, validationResult } = require('express-validator');

router.post(
	'/addpayment',
	isAuth,
	managmentController.addPayment
);

module.exports = router;
