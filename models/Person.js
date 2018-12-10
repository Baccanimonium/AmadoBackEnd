const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = Schema({
	name: String,
	stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

module.exports = mongoose.model('Person', personSchema);
