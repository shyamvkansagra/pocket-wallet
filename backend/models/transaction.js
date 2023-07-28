const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transitionSchema = new Schema({
    walletId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
		balance: {
			type: Number,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		type: {
			type: String,
			required: true
		},
		createdDate: {
			type: Date,
			default: Date.now
		}
})
module.exports = mongoose.model("Transaction", transitionSchema, "transactions")