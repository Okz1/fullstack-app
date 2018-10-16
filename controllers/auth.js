const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const erroreHandler = require('../utils/errorhandler');

module.exports.login = async function (req, res) {
	const candidate = await User.findOne({email: req.body.email});
	if(candidate) {
		//check password
		const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
		if(passwordResult){
			// generate token
			const token = jwt.sign({
				email: candidate.email,
				userId: candidate._id
			}, keys.jwt, {expiresIn: 60 * 60});
			res.status(200).json({
				token: `Bearer ${token}`
			})
		}else {
			// password not same
			res.status(401).json({
				message: 'password not same'
			})
		}
	}else {
		// user not found
		res.status(404).json({
			message: 'User with this email not found'
		})
	}
};

module.exports.register = async function (req, res) {
	const candidate =  await User.findOne({email: req.body.email});
	if(candidate) {
		// USER true its error
		res.status(409).json({
			message: 'This email already use. Try other;'
		})
	} else {
		//create user
		const salt = bcrypt.genSaltSync(10);
	 	const password = req.body.password;
		const user = new User({
			email: req.body.email,
			password: bcrypt.hashSync(password, salt),
		});
		try{
			await user.save();
			res.status(201).json(user);
		}catch(e) {
			//show error
			erroreHandler(res, e)
		}
	}
};
