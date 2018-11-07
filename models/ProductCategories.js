const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductCategoriesSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	products: {
		type: Schema.Types.ObjectId,
		ref: 'productCategories'
	},
});

module.exports = mongoose.model('productCategories', ProductCategoriesSchema);
