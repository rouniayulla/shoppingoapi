require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../model/user');
module.exports = (req, res, next) => {
	const token = req.get('Authorization').split(' ')[2];
	// console.log(token)
	if (!token) {
		res.status(422).json({ message: 'no token access' });
	}
	try {
		const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
		req.user = String(decoded);
		//  console.log(req.user);
		next();
	} catch (error) {
		res.status(422).json({ message: 'token is not valid' });
	}
};
