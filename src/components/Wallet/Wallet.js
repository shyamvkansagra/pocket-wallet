import React, { useEffect, useState } from "react";
import {
	ToggleButtonGroup,
	ToggleButton,
	TextField,
	Typography,
	CardContent,
	Card,
	Button,
	Box,
	Stack
} from '@mui/material';

import "./walletStyles.css";
import axios from "axios";

const Wallet = ({ walletId }) => {
	const [walletInfo, setWalletInfo] = useState({});
	const [type, setType] = useState("credit");
	const [amount, setAmount] = useState(undefined);
	const [description, setDescription] = useState("");
	const handleAmountChange = e => setAmount(e.target.value);
	const handleDescriptionChange = e => setDescription(e.target.value);
	const handleTypeChange = (e) => setType(e.target.value);

	useEffect(() => {
		axios
			.get(`/wallet/${walletId}`).then((response) => {
				// setUsers(users)
				if (response.status === 200) {
					const [walletData] = response.data;
					setWalletInfo({
						userName: walletData.userName,
						balance: walletData.balance
					});
				}
			})
			.catch((err) => console.log(err));
	}, [walletId]);

	const handleSubmit = () => {
		axios
			.post(`/transact/${walletId}`, {
				amount: +amount,
				description,
				type
			})
			.then(res => {
				const resJson = res.data;
				console.log(resJson);
				if (resJson.status === 200) {
					setWalletInfo({
						...walletInfo,
						balance: resJson.data.balance
					});
					setAmount(0);
					setDescription("");
				}
				// console.log(res);
			})
			.catch(err => {
				console.error(err);
			})
	}

	return (
		<div className="set-wallet-container">
			<Stack direction="row" spacing={2} sx={{ marginBottom: "20px", display: "flex", justifyContent: "space-around" }}>
						<Typography variant="h6" sx={{fontWeight: "bold"}}>{`Username: ${walletInfo.userName}`}</Typography>
						<Typography variant="h6" sx={{fontWeight: "bold"}}>{`Balance: ${walletInfo.balance}`}</Typography>
					</Stack>
			<Card>
				<CardContent>
					<Box
						sx={{
							width: "auto",
							minWidth: 300,
						}}
					>
						<span className="setup-form-heading">
							<Typography>Make a transaction</Typography>
						</span>
						<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
							<TextField
								required
								fullWidth
								id="outlined-required"
								label="Amount"
								type="number"
								inputProps={{min: 0}}
								onChange={handleAmountChange}
								value={amount}
							/>
							<TextField
								required
								fullWidth
								id="outlined-required"
								label="Description"
								margin="normal"
								onChange={handleDescriptionChange}
								value={description}
							/>
							<ToggleButtonGroup
								color="primary"
								value={type}
								exclusive
								onChange={handleTypeChange}
								aria-label="Transaction-Type"
								sx={{ marginTop: "20px" }}
							>
								<ToggleButton sx={{ minWidth: "80px" }} value="credit">Credit</ToggleButton>
								<ToggleButton sx={{ minWidth: "80px" }} value="debit">Debit</ToggleButton>
							</ToggleButtonGroup>
							<Button
								sx={{ marginTop: "20px" }}
								fullWidth
								variant="contained"
								onClick={handleSubmit}
							>Submit</Button>
						</CardContent>
					</Box>
				</CardContent>
			</Card>
		</div>
	);
}

export default Wallet;