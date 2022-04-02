require('dotenv').config();
const User = require('../model/user');
const { validationResult } = require('express-validator');
const bycrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
	const error = validationResult(req);
	// console.log(error);
	if (!error.isEmpty()) {
		const error = new Error('enter valid things');
		error.statusCode = 422;
		throw error;
	}
	const email = req.body.email;
	const name = req.body.name;
	const password = req.body.password;
	try {
		User.findOne({ email: email })
			.then((userdb) => {
				if (userdb) {
					const error = new Error('user already exists');
					error.statusCode = 422;
					throw error;
				}
				const salt = bycrpt.genSalt(12);
				bycrpt
					.hash(password, 12)
					.then((hashedPassword) => {
						const user = new User({
							name: name,
							email: email,
							password: hashedPassword
						});
						return user.save();
					})
					.then((user) => {
						const userId = { user: user._id };
						jwt.sign(userId, process.env.JWT_SECRET_KEY, (err, token) => {
							if (err) {
								const error = new Error(err.message);
								error.statusCode = 422;
								throw error;
							}
							res
								.status(201)
								.json({ message: 'user Created!!', user: user, token });
						});
					});
			})
			.catch((err) => {
				if (!err.statusCode) {
					err.statusCode = 500;
				}
				next(err);
			});
	} catch (error) {
		error.statusCode = 422;
		throw error;
	}
};

/////////////////////////////////////LOGIN controlller///////////////////////////////////////

exports.login = (req, res, next) => {
	const error = validationResult(req);
	console.log(error);
	if (!error.isEmpty()) {
		const error = new Error('enter valid things');
		error.statusCode = 422;
		throw error;
	}
	const email = req.body.email;
	const password = req.body.password;

	try {
		User.findOne({ email: email })
			.then((user) => {
				if (!user) {
					const error = new Error('Email is not exist');
					error.statusCode = 422;
					throw error;
				}
				bycrpt
					.compare(password, user.password)
					.then((isEqual) => {
						if (!isEqual) {
							const error = new Error('password is not correct');
							error.statusCode = 401;
							throw error;
						}
						const userId = user._id.toString();
						jwt.sign(userId, process.env.JWT_SECRET_KEY, (err, token) => {
							if (err) {
								const error = new Error(err.message);
								error.statusCode = 422;
								throw error;
							}
							res.status(201).json({ message: 'user Login!!', userId: userId, token: token });
						});
					})
					.catch((err) => {
						if (!err.statusCode) {
							err.statusCode = 500;
						}
						next(err);
					});
			})
			.catch((err) => {
				if (!err.statusCode) {
					err.statusCode = 500;
				}
				next(err);
			});
	} catch (error) {
		error.statusCode = 500;
		throw error;
	}
};
