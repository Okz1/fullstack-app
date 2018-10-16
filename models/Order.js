const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	date: {
		type: Date,
		default: Date.now
	},
	order: {
		type: Number,
		required: true
	},
	user: {
		ref: 'users',
		type: Schema.Types.ObjectId
	},
	list: [
		{
			name: {
				type: String,
			},
			quantity: {
				type : Number,
			},
			cost: {
				type: Number
			}
		}
	]
});

module.exports = mongoose.model('users', userSchema);