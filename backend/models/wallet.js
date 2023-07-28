const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletSchema = new Schema({
    balance: {
        type: Number,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
		transactionId: {
			type: String,
			required: true
		},
		createdDate: {
			type: Date,
			default: Date.now
		}
})
module.exports = mongoose.model("Wallet", walletSchema, "wallets")