const express = require('express');
const router = express.Router()

const Wallet = require('../models/wallet');

router.post('/setup', (req, res) => {
	const { userName, balance } = req.body;
	const formattedBalance = Math.round((balance + Number.EPSILON) * 10000) / 10000;
    const newWallet = new Wallet({
        userName,
				balance: formattedBalance || 0,
				transactionId: +new Date()
    });
		newWallet.save()
			.then((data) => res.json({
				code: 200,
				data
			}))
			.catch(err => res.status(400).json({
				"error": err,
				"message": "Error saving wallet"
			}))
});

router.get('/wallet/:id', (req, res) => {
	const walletId = req.params.id;
	Wallet.find({ "_id": walletId })
			.then(wallet => res.json(wallet))
			.catch(err => console.log(err))
})

module.exports = router