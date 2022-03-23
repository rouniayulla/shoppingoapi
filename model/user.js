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
	status: {
		type: Boolean,
		default: false
	},
	payment: [
		{
			type: Shcema.Types.ObjectId,
			ref: 'Payemnet'
		}
	]
});
module.exports = mongoose.model('User', userShcema);
