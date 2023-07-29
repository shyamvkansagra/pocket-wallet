const express = require('express');
const router = express.Router()

const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');

router.post('/transact/:walletId', (req, res) => {
	const walletId = req.params.walletId;
	const { amount, description, type } = req.body;
	const formattedAmount = Math.round((amount + Number.EPSILON) * 10000) / 10000;
	Wallet.find({ "_id": walletId })
			.then(wallet => {
				let accBalance = wallet[0].balance;
				if (type === "credit") {
					accBalance = accBalance + formattedAmount;
				} else if (type === "debit") {
					if (formattedAmount > accBalance) {
						return res.json({ message: "Insufficient balance", error: true })
					}
					accBalance = accBalance - formattedAmount;
				}
				const formattedBalance = Math.round((accBalance + Number.EPSILON) * 10000) / 10000;
				Wallet.updateOne({ "_id": walletId }, { $set: { balance: formattedBalance } })
					.then(() => {
						const newTransaction = new Transaction({
							walletId,
							amount,
							description,
							balance: formattedBalance,
							type,
							transactionId: +new Date()
						});
						newTransaction.save()
							.then(data => {
								return res.json({
									status: 200,
									data: {
										balance: data.balance,
										transactionId: data.transactionId
									}
								})
							})
							.catch(err => console.log(err));
					})
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err))
});

router.get('/transactions', (req, res) => {
	const { walletId, skip, limit, sortBy } = req.query;
	if (sortBy) {
		const sortByVal = {};
		sortByVal[sortBy.key] = sortBy.type;
		Transaction.aggregate([
			{ "$facet": {
				"totalData": [
					{ "$match": { "walletId": walletId }},
					{ "$skip": +skip },
					{ "$limit": +limit },
					{ "$sort": sortByVal }
				],
				"totalCount": [
					{ "$match": { "walletId": walletId }},
					{ "$count": "count" }
				]
			}}
		])
		// Transaction.find({ "walletId": walletId }).sort(sortByVal).skip(skip).limit(limit)
		.then(transactions => res.json(transactions))
		.catch(err => console.log(err));
	} else if (limit && skip) {
		Transaction.aggregate([
			{ "$facet": {
				"totalData": [
					{ "$match": { "walletId": walletId }},
					{ "$skip": +skip },
					{ "$limit": +limit },
				],
				"totalCount": [
					{ "$match": { "walletId": walletId }},
					{ "$count": "count" }
				]
			}}
		])
		// Transaction.find({ "walletId": walletId }).skip(skip).limit(limit)
			.then(transactions => res.json(transactions))
			.catch(err => console.log(err));
	} else {
		Transaction.find({ "walletId": walletId })
			.then(transactions => res.json(transactions))
			.catch(err => console.log(err));
	}
});

module.exports = router