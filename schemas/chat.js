var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ChatSchema = new Schema({
	userId: {
		type:ObjectId,
		ref: 'User'
	},
	username: String,
	count: {
		type:Number,
		default: 0
	},
	messages:[{
		message: String,
		name: String,
		createAt: {
			type: Date,
			default: Date.now()
		}
	}]
});

ChatSchema.pre('save', function(next){
	
	this.messages[0].createAt = Date.now();
	this.count++;
	next();
});

ChatSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);
	},
	findById: function(id, cb) {
    	return this
      		.findOne({_id: id})
      		.exec(cb);
  	}
}

module.exports = ChatSchema;