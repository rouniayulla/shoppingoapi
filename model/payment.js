const mongoose = require('mongoose');

const Shcema = mongoose.Schema;

const paymentShcema = new Shcema({
	name: {
		type: String,
		required: true
	},
	value: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	date:{
		type:String,
		required:true
	}
});
module.exports = mongoose.model('Payment', paymentShcema);
