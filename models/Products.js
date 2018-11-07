const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: String,
		required: true,
	},
	image: {
		type: [String],
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	lastPurchase: {
		type: Date,
		default: Date.now
	},
	comments: [
		{
			body: String,
			date: {
				type: Date,
				default: Date.now
			}
		}
	]
});

module.exports = mongoose.model('products', ProductsSchema);
