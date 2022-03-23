const express = require('express');

const router = express.Router();

const authController = require('../controller/auth');
const { check, validationResult } = require('express-validator');

router.post(
	'/signup',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'please insert valid Email').not().isEmpty().isEmail(),
		check('password', 'please insert password with 6 charchter or more').not().isEmpty().isLength({
			min: 6
		})
	],
	authController.signup
);

router.post('/login', [ check('email', 'please insert valid Email').not().isEmpty().isEmail() ], authController.login);
module.exports = router;
