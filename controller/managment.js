const Payment = require('../model/payment');
const PaymentReq = require('../model/paymentReq');
const User = require('../model/user');
const { validationResult } = require('express-validator');
const payment = require('../model/payment');

exports.addPayment = (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		const error = new Error('enter valid things');
		error.statusCode = 422;
		throw error;
	}
	const name = req.body.name;
	const value = +req.body.value;
	const type = req.body.type;
	const date = req.body.date;

	const payment = new Payment({
		name: name,
		value: value,
		type: type,
		date: date
	});
	payment.save();

	User.findById(req.user.user)
		.then((user) => {
			user.payment.push(payment._id);
			user.save();
		})
		.catch((err) => {
			err.statusCode = 422;
			throw err;
		});
	res.status(201).json({ message: 'user payment added' });
};

exports.getpayments = async (req, res, next) => {
	const user = await User.findById(req.user.user)
		.then(async (user) => {
			const arrayPayments = user.payment;
			var all = [];
			var all2 = [];
			async function t() {
				for (let i in arrayPayments) {
					var id = await arrayPayments[i].toString();
					await Payment.findById(id)
						.then(async (result) => {
							await User.findById(user._id)
								.then(async (resu1) => {
									const flog = await resu1.showpayment.some((id) => id.name === result.name);
									if (!flog)
										await User.findByIdAndUpdate(
											user._id,
											{ $push: { showpayment: result } },
											async function(err, managerparent) {
												if (err) throw err;
											}
										);
								})
								.catch((err) => {});
						})
						.catch((err) => {});
				}
			}
			await t();
		})
		.catch((err) => {
			err.statusCode = 422;
			throw err;
		});
	const user1 = User.findById(req.user.user).then((user) => {
		var arrayToString = JSON.stringify(Object.assign({}, user.showpayment)); // convert array to string
		var stringToJsonObject = JSON.parse(arrayToString); // convert string to json object

		res.json(stringToJsonObject);
	});
};

exports.addPaymentReq = (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		const error = new Error('enter valid things');
		error.statusCode = 422;
		throw error;
	}
	const name = req.body.name;
	const value = parseInt(req.body.value);
	const date = req.body.date;
	const isRepeater = req.body.isRepeater;
	let year,
		month,
		dateNow,
		numOfMonthRepeater = 0,
		everyPaidValueRepeater = 0;
	if (isRepeater == true) {
		year = parseInt(date.split('/')[2]);
		month = parseInt(date.split('/')[1]);
		dateNow = new Date();
		numOfMonthRepeater =
			12 * (year - parseInt(dateNow.getFullYear())) + Math.abs(month - (parseInt(dateNow.getMonth()) + 1));
		everyPaidValueRepeater = value / numOfMonthRepeater;
	}
	const paymentReq = new PaymentReq({
		name: name,
		value: value,
		date: date,
		isRepeater: isRepeater,
		numOfMonthRepeater: numOfMonthRepeater,
		everyPaidValueRepeater: everyPaidValueRepeater
	});
	paymentReq.save();
	User.findById(req.user.user)
		.then((user) => {
			user.paymentReq.push(paymentReq._id);
			user.save();
		})
		.catch((err) => {
			err.statusCode = 422;
			throw err;
		});
	res.status(201).json({ message: 'user payment Required added' });
};
