const Payment = require('../model/payment');
const PaymentReq = require('../model/paymentReq');
const User = require('../model/user');
const { validationResult } = require('express-validator');
const payment = require('../model/payment');
//@router post
//@desc   enter full income
//@view   public
exports.addIncome = (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		const error = new Error('enter valid things');
		error.statusCode = 422;
		throw error;
	}
	const value = parseInt(req.body.value);
	User.findById(req.userId)
		.then((user) => {
			user.income += value;
			user.totalBalance += value;
			user.save();
			res.status(201).json({ msg: 'income is added' });
		})
		.catch((err) => {
			err.statusCode = 422;
			throw err;
		});
};
//@router post
//@desc   add a new payment 
//@view   public
exports.addPayment = (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		const error = new Error('enter valid things');
		error.statusCode = 422;
		throw error;
	}
	const name = req.body.name;
	const value = parseInt(req.body.value);
	const type = req.body.type;
	const date = req.body.date;
	User.findById(req.userId)
		.then((user) => {
			if (value > user.totalBalance) {
				res.status(401).json({ msg: 'you cant make payment the cost of it more than the total Balance' });
			} else {
				const payment = new Payment({
					name: name,
					value: value,
					type: type,
					date: date
				});

				payment.save();
				user.payments.push(payment._id);
				user.totalBalance -= value;
				user.totalPayments += value;
				user.save();
				res.status(201).json({ message: 'user payment added' });
			}
		})
		.catch((err) => {
			err.statusCode = 422;
			throw err;
		});
};
//@router get
//@desc   get all payments
//@view   public
exports.getpayments = async (req, res, next) => {
	const user = await User.findById(req.userId)
		.then(async (user) => {
			const arrayPayments = user.payments;
			console.log(arrayPayments)
			var all = [];
			var all2 = [];
			async function t() {
				for (let i in arrayPayments) {
					var id = await arrayPayments[i].toString();
					await Payment.findById(id)
						.then(async (result) => {
							await User.findById(user._id)
								.then(async (resu1) => {
									const flog = await resu1.showpayment.some((id) => id._id.toString() === result._id.toString());
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
	const user1 = User.findById(req.userId).then((user) => {
		var arrayToString = JSON.stringify(Object.assign({}, user.showpayment)); // convert array to string
		var  JSONFORPAYMENT = JSON.parse(arrayToString); // convert string to json object

		res.json( JSONFORPAYMENT);
	});
};
//@router post
//@desc   add a new reqpayment
//@view   public
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
	User.findById(req.userId)
		.then((user) => {
			user.paymentsReq.push(paymentReq._id);
			user.save();
		})
		.catch((err) => {
			err.statusCode = 422;
			throw err;
		});
	res.status(201).json({ message: 'user payment Required added' });
};
//@router get
//@desc   get all reqapayments
//@view   public
exports.getreqpayments = async (req, res, next) => {
	const user = await User.findById(req.userId)
		.then(async (user) => {
			const arrayReqPayments = user.	paymentsReq;
	
			async function t() {
				for (let i in arrayReqPayments) {
					var id = await arrayReqPayments[i].toString();
					await PaymentReq.findById(id)
						.then(async (result) => {
							await User.findById(user._id)
								.then(async (resu1) => {
									const flog = await resu1.showreqpayment.some((id) => id._id.toString() === result._id.toString());
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
	const user1 = User.findById(req.userId).then((user) => {
		var arrayToString = JSON.stringify(Object.assign({}, user.showreqpayment)); // convert array to string
		var  JSONFORPAYMENT = JSON.parse(arrayToString); // convert string to json object

		res.json( JSONFORPAYMENT);
	});
};