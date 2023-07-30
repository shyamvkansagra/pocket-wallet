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
	const [showLoading, setShowLoading] = useState(false);
	const submitWalletData = () => {
		if (!userName.trim()) {
			setSnackbarInfo({
				open: true,
				severity: "error",
				message: "Please fill all required data"
			})
			return;
		}
		setShowLoading(true);
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
				setShowLoading(false);
			})
			.catch(function () {
				setSnackbarInfo({
					open: true,
					message: "Could not create wallet. Please try again",
					severity: "error"
				});
				setShowLoading(false);
			});
	}
	const handleUserNameChange = (e) => {
		setUserName(e.target.value);
		setIsUserNameEmpty(!e.target.value.trim());
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
								inputProps={{maxlength: 12}}
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
								disabled={showLoading}
							>{showLoading ? "Submitting..." : "Submit"}</Button>
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