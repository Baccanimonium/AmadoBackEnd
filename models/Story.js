const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = Schema({
	author: { type: Schema.Types.ObjectId, ref: 'Person' },
	title: String,
});

module.exports = mongoose.model('Story', storySchema);
