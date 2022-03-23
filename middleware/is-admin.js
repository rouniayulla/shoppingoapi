module.exports = (req, res, next) => {
	try {
		if (req.user.status == false) {
			const error = new Error('you are not allowed to edit you need to be an admin');
			error.statusCode = 401;
			throw error;
		}
		next();
	} catch (error) {
		error.statusCode = 500;
		throw error;
	}
};
