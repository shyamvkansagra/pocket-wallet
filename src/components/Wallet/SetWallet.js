import React, { useState } from "react";
import axios from 'axios';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';

import { setLocal } from "../../utils/utils";
import "./walletStyles.css";

const SetWallet = ({ setWalletId }) => {
	const [userName, setUserName] = useState("");
	const [balance, setBalance] = useState(0);
	const submitWalletData = () => {
		axios
			.post("/setup", {
				userName,
				balance: +balance,
			})
			.then(function (d) {
				const resData = d.data;
				if (resData.code === 200) {
					setLocal("walletId", resData.data._id);
					setWalletId(resData.data._id)
				}
			})
			.catch(function () {
				alert("Could not create wallet. Please try again");
			});
	}
	const handleUserNameChange = (e) => setUserName(e.target.value);
	const handleBalanceChange = (e) => setBalance(e.target.value);
	
	return (
		<div className="set-wallet-container">
			<Card>
				<CardContent>
					<Box
						sx={{
							width: "auto",
							minWidth: 300,
						}}
					>
						<span className="setup-form-heading">
							<Typography>Setup your wallet</Typography>
						</span>
						<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
							<TextField
								required
								fullWidth
								id="outlined-required"
								label="Username"
								onChange={handleUserNameChange}
							/>
							<TextField
								fullWidth
								id="outlined-required"
								label="Initial Balance"
								margin="normal"
								type="number"
								onChange={handleBalanceChange}
							/>
							<Button
								sx={{ marginTop: "20px" }}
								fullWidth
								variant="contained"
								onClick={() => {
									submitWalletData();
								}}
							>Submit</Button>
						</CardContent>
					</Box>
				</CardContent>
			</Card>
		</div>
	);
}

export default SetWallet;