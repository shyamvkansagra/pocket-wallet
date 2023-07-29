import React, { useState } from "react";
import axios from 'axios';
import {
	Box,
	Card,
	CardContent,
	Typography,
	TextField,
	Button,
	Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import { setLocal } from "../../Utils/utils";
import "./walletStyles.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SetWallet = ({ setWalletId, endpoint }) => {
	const [userName, setUserName] = useState("");
	const [balance, setBalance] = useState("");
	const [isUserNameEmpty, setIsUserNameEmpty] = useState(false);
	const [snackbarInfo, setSnackbarInfo] = useState({});
	const submitWalletData = () => {
		if (!userName) {
			setSnackbarInfo({
				open: true,
				severity: "error",
				message: "Please fill all required data"
			})
			return;
		}
		axios
			.post(`${endpoint}/setup`, {
				userName,
				balance: +balance,
			})
			.then(function (d) {
				const resData = d.data;
				if (resData.code === 200) {
					setLocal("walletId", resData.data._id);
					setWalletId(resData.data._id);
					setIsUserNameEmpty(false);
				}
			})
			.catch(function () {
				alert("Could not create wallet. Please try again");
			});
	}
	const handleUserNameChange = (e) => {
		setUserName(e.target.value);
		setIsUserNameEmpty(!e.target.value);
	}
	const handleBalanceChange = (e) => {
		const balanceVal = e.target.value < 0 ? 0 : e.target.value;
		setBalance(balanceVal);
	}
	const handleSnackbarClose = () => {
		setSnackbarInfo({ ...snackbarInfo, open: false });
	}
	
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
								error={isUserNameEmpty}
								value={userName}
							/>
							<TextField
								fullWidth
								id="outlined-required"
								label="Initial Balance"
								margin="normal"
								type="number"
								onChange={handleBalanceChange}
								inputProps={{min: 0}}
								value={balance}
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
			<Snackbar open={snackbarInfo.open} autoHideDuration={3000} onClose={handleSnackbarClose}>
				<Alert onClose={handleSnackbarClose} severity={snackbarInfo.severity} sx={{ width: '100%' }}>
          {snackbarInfo.message}
        </Alert>
      </Snackbar>
		</div>
	);
}

export default SetWallet;