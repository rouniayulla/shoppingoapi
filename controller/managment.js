const Payment = require('../model/payment');
const PaymentReq = require('../model/paymentReq');
const User = require('../model/user');
const { validationResult } = require('express-validator');
const payment = require('../model/payment');
const { all } = require('../routes/managment');
const categories={
	food:0,
	clothes:0,
	others:0
}
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

			// console.log(value,user.income)
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
//@desc   get all payments
// //@view   public
exports.getpayments= async (req,res,next)=>{
	const pay=await User.findById(req.userId).populate("payments");
	var arrayToString = JSON.stringify(Object.assign({}, pay.payments)); // convert array to string
	var  JSONFORPAYMENTs = JSON.parse(arrayToString); // convert string to json object
	res.json( JSONFORPAYMENT);
}
//@router get
//@desc   get all reqapayments
//@view   public
exports.getreqpayments = async (req, res, next) => {
	const payreq=await User.findById(req.userId).populate("paymentsReq");
	var arrayToString = JSON.stringify(Object.assign({}, payreq.paymentsReq)); // convert array to string
	var  JSONFORREQPAYMENTs = JSON.parse(arrayToString); // convert string to json object
	res.json( JSONFORREQPAYMENT);

};
//@router get
//@desc   get data for dashboard
//@view   public
exports.getdatadashboard=async(req,res,next)=>{
	let all=[];
	const user=await User.findById(req.userId);
	user.totalPayments=0;
	const pay=await User.findById(req.userId).populate("payments");
	const payreq=await User.findById(req.userId).populate("paymentsReq");  
	
	pay.payments.forEach(payment=>{
		user.totalPayments=user.totalPayments+(+payment.value);
	})
	user.totalBalance=user.income-user.totalPayments;
	user.save();
	// count percent for every category
	pay.payments.forEach(payment=>{
	categories[payment.type]=categories[payment.type]+1;
		})
	// get five by five 
	pay.payments.sort((a,b)=>{
		if((+a.value)<(+b.value))
		return 1;
		if((+a.value)>(+b.value))
		return -1;
		return 0;
	})
	payreq.paymentsReq.sort((a,b)=>{
		if((+a.value)<(+b.value))
		return 1;
		if((+a.value)>(+b.value))
		return -1;
		return 0;
	})
    all.push({
		totalBalance:user.totalBalance,
		totalPayments:user.totalPaymentss,
		income:user.income
	});
	all.push(categories);
	all.push(pay.payments.slice(0,5))
	all.push(payreq.paymentsReq.slice(0,5))
	var arrayToString = JSON.stringify(Object.assign({}, all)); // convert array to string
	var  JSONDASHBOARD = JSON.parse(arrayToString); // convert string to json object
	res.json(JSONDASHBOARD);


}