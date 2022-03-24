const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');
const managmentController = require('../controller/managment');

const { check, validationResult } = require('express-validator');

router.post(
	'/addpayment',
	isAuth,
	[
		check('name', 'name is required').not().isEmpty(),
		check('value', 'value is required').not().isEmpty(),
		check('type', 'type is required').not().isEmpty(),
		// check('Date', 'Date is required').not().isEmpty()
	],
	managmentController.addPayment
);

//router for get all payments 
router.get('/getallpayments',isAuth,managmentController.getpayments);

module.exports = router;
