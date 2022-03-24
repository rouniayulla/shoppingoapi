const mongoose = require('mongoose');

const Shcema = mongoose.Schema;

const paymentReqShcema = new Shcema({
	name: {
		type: String,
		required: true
	},
	value: {
		type: Number,
		required: true
	},
	remaining: {
		type: Number,
		default: 0
	},
	paided: {
		type: Number,
		default: 0
	},
	date: {
		type: String,
		required: true
	},
	isRepeater: {
		type: Boolean,
		required: true
	},
	numOfMonthRepeater: {
		type: Number,
		default: 0
	},
	everyPaidValueRepeater: {
		type: Number,
		default: 0
	}
});
module.exports = mongoose.model('PaymentReq', paymentReqShcema);
