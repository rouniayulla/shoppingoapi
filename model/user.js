const mongoose = require('mongoose');

const Shcema = mongoose.Schema;

const userShcema = new Shcema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	income: {
		type: Number,
		default: 0
	},
	totalBalance: {
		type: Number,
		default: 0
	},
	totalPayments: {
		type: Number,
		default: 0
	},
	status: {
		type: Boolean,
		default: false
	},
	payments: [
		{
			type: Shcema.Types.ObjectId,
			ref: 'Payment'
		}
	],
	paymentsReq: [
		{
			type: Shcema.Types.ObjectId,
			ref: 'PaymentReq'
		}
	],
	showpayment: [ { type: Object } ],
	showreqpayment: [ { type: Object,
	default:[] },
	],
	showfivepayment: [ { type: Object,
		default:[]
	 } ],
	showfivereqpayment: [ { type: Object,
	default:[] },
	],
    dashboard:[
		{
			type:Object,
			default:[]
		}
	],
	food:{
		type:Number,
		default:0
	},
	clothes:{
		type:Number,
		default:0
	}


});
module.exports = mongoose.model('User', userShcema);
