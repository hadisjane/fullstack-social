const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	conversationId: {
		type: String
	},
	sender: {
		type: String,
		required: true
	},
	text: {
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
},
	{ timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema)