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
function sortDate(arraypayments,typedate)
{
	// console.log(arraypayments);
	if(typedate==="high"){
	arraypayments.sort((a,b)=>{
		if(new Date(a.date)<new Date(b.date))
		return 1;
		else 
		if(new Date(a.date)>new Date(b.date))
		return -1;
		else 
		return 0;
	})}
	else
	{
		arraypayments.sort((a,b)=>{
			if(new Date(a.date)>new Date(b.date))
			return 1;
			else 
			if(new Date(a.date)<new Date(b.date))
			return -1;
			else 
			return 0;
		})

	}
}
function sortValue(arraypayments,typedate)
{
	if(typedate==="high"){
	arraypayments.sort((a,b)=>{
		if((+a.value)<(+b.value))
		return 1;
		else 
		if((+a.value)>(+b.value))
		return -1;
		else 
		return 0;
	})}
	else
	{
		arraypayments.sort((a,b)=>{
			if((+a.value)>(+b.value))
			return 1;
			else 
			if((+a.value)<(+b.value))
			return -1;
			else 
			return 0;
		})

	}
}
function sortDateAndValue(arraypayments,typedate,typevalue)
{
	
	
	if(typedate==="high"&&typevalue==="high"){
	
    	arraypayments.sort((a,b)=>{
		if(new Date(a.date)<new Date(b.date)&&(+a.value)<(+b.value))
		{console.log("l");return 1;}
		else if(new Date(a.date)>new Date(b.date)&&(+a.value)>(+b.value))
		{return -1;}
		else return 0;


	})}
	else if(typedate==="low"&&typevalue==="low"){
		arraypayments.sort((a,b)=>{
			if(new Date(a.date)>new Date(b.date)&&(+a.value)>(+b.value))
			return 1;
			else if(new Date(a.date)<new Date(b.date)&&(+a.value)<(+b.value))
			return -1;
			else return 0;
	
	
		})}
	
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
	res.json({
		pay:pay.payments

	});

}
//@router get
//@desc   get all reqapayments
//@view   public
exports.getreqpayments = async (req, res, next) => {
	const payreq=await User.findById(req.userId).populate("paymentsReq");
	
	res.json({
		payreq:payreq.paymentsReq

	});

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
		totalPayments:user.totalPayments,
		income:user.income
	});
	all.push(categories);
	all.push(pay.payments.slice(0,5))
	all.push(payreq.paymentsReq.slice(0,5))
	
	res.json({dash:all});


}
exports.filterPayments=async (req,res,next)=>{
	const user=await User.findById(req.userId);
	const pay=await User.findById(req.userId).populate("payments");
	
	const filterbydate=req.body.filterbydate;
	const filterbytype=req.body.filterbytype;
	if(filterbydate==="high"&&!filterbytype)
	{
		sortDate(pay.payments,filterbydate);
		res.json({
			filterHigh:pay.payments
		})

	}
	else if(filterbydate==="low"&&!filterbytype)
	{
		sortDate(pay.payments,filterbydate);
		res.json({
			filterHigh:pay.payments
		})

	}
	else if(filterbytype&&!filterbydate){
		const filterpayments=pay.payments.filter(payment=>{
			payment.type===filterbytype
		})
		res.json({
			filterpayments:filterpayments
		})
	}
	else if(filterbytype&&filterbydate==="high"){
		const filterpayments=pay.payments.filter(payment=>{
			return payment.type===filterbytype
		})
		sortDate(filterpayments,filterbydate);
		res.json({
			filterpayments:filterpayments
		})
		
	}
	else if(filterbytype&&filterbydate==="low"){
		// console.log(filterbytype);
		const filterpayments=pay.payments.filter(payment=>{
			return payment.type===filterbytype
		})
		sortDate(filterpayments,filterbydate);
		res.json({
			filterpayments:filterpayments
		})
		
	}


}
exports.filterReqPayments=async (req,res,next)=>{
	const payreq=await User.findById(req.userId).populate("paymentsReq");
	const filterbydate=req.body.filterbydate;
	const filterbyvalue=req.body.filterbyvalue;
	if(filterbydate==="high"&&!filterbyvalue){
		// console.log(payreq.paymentsReq)
		sortDate(payreq.paymentsReq,filterbydate);
		res.json({
			filterReqPayments:payreq.paymentsReq
		})
	}
	else if(filterbydate==="low"&&!filterbyvalue){
		sortDate(payreq.paymentsReq,filterbydate);
		res.json({
			filterReqPayments:payreq.paymentsReq
		})
	}
	else if(!filterbydate&&!filterbyvalue==="high"){
		sortValue(payreq.paymentsReq,filterbyvalue);
		res.json({
			filterReqPayments:payreq.paymentsReq
		})
	}
	else if(!filterbydate&&!filterbyvalue==="low"){
		sortValue(payreq.paymentsReq,filterbyvalue);
		res.json({
			filterReqPayments:payreq.paymentsReq
		})
	}
	else if(filterbydate==="high"&&filterbyvalue==="high"){
		sortDateAndValue(payreq.paymentsReq,filterbydate,filterbyvalue)
		res.json({
			filterReqPayments:payreq.paymentsReq
		})
	}	else if(filterbydate==="low"&&filterbyvalue==="low"){
		sortDateAndValue(payreq.paymentsReq,filterbydate,filterbyvalue)
		res.json({
			filterReqPayments:payreq.paymentsReq
		})
	}
	
}
