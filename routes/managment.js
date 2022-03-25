const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');
const managmentController = require('../controller/managment');

const { check, validationResult } = require('express-validator');

//router for Add payment
router.post(
	'/addpayment',
	isAuth,
	[
		check('name', 'name is required').not().isEmpty(),
		check('value', 'value is required').not().isEmpty(),
		check('type', 'type is required').not().isEmpty()
	
	],
	managmentController.addPayment
);
//router for Post Payment Require
router.post(
	'/addPaymentReq',
	isAuth,
	[ check('name', 'name is required').not().isEmpty(), check('value', 'value is required').not().isEmpty() ],
	managmentController.addPaymentReq
);
// router for post addicome
router.post(
	'/addIncome',
	isAuth,
	[ check('value', 'name is required').not().isEmpty() ],
	managmentController.addIncome
);

//router for get all payments
router.get('/getallpayments', isAuth, managmentController.getpayments);
//router for get all reqpayments
router.get('/getallreqpayments', isAuth, managmentController.getreqpayments);

module.exports = router;
