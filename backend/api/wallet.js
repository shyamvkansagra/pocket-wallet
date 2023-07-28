const express = require('express');
const router = express.Router()

const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');

router.post('/setup', (req, res) => {
	const { userName, balance } = req.body;
    const newWallet = new Wallet({
        userName,
				balance: balance || 0,
				transactionId: `${userName}-${+new Date()}`
    });
		console.log(newWallet);
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

// router.post('/', (req, res) => {
//     const { name, email } = req.body;
//     const newUser = new Wallet({
//         name: name, email: email
//     });
//     console.log(newUser);
//     newUser.save()
//         .then(() => res.json({
//             message: "Created account successfully"
//         }))
//         .catch(err => res.status(400).json({
//             "error": err,
//             "message": "Error creating account"
//         }))
// })
module.exports = router