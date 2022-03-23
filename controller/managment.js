const Payment = require('../model/payment');
const User = require('../model/user');
const { validationResult } = require('express-validator');

exports.addPayment = (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		const error = new Error("enter valid things");
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
	User.findOne({_id:'623b17824336b720d98ee487'}).then(user=>{
		 user.payment.push(payment);
		 user.save();
	}).catch(err=>{
		err.statusCode =422;
		throw err;
	})
	res.status(201).json({message:"user payment added"});
};
