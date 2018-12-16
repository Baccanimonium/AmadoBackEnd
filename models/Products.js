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
		type: Number,
		required: true,
	},
	image: {
		type: [String],
		required: true,
	},
	colors: {
		type: [String],
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	brand: {
		type: Array,
		required: true,
	},
	lastPurchase: {
		type: Date,
		default: Date.now()
	},
	categoryId: {
		type: Schema.Types.ObjectId,
		ref: 'productCategories'
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

// ProductsSchema.index({ name: 'text' });
// ProductsSchema.index({
// 	"$**": "text",
// });
ProductsSchema.index({
	name: 'text',
}, { weights: {name: 2 } });
module.exports = mongoose.model('products', ProductsSchema);
