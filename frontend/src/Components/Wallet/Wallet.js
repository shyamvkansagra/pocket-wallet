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
	Stack,
	Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import "./walletStyles.css";
import axios from "axios";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Wallet = ({ walletId, endpoint }) => {
	const [walletInfo, setWalletInfo] = useState({ userName: "", balance: "Loading" });
	const [type, setType] = useState("credit");
	const [amount, setAmount] = useState(undefined);
	const [description, setDescription] = useState(undefined);
	const [snackbarInfo, setSnackbarInfo] = useState({});
	const [isAmountEmpty, setIsAmountEmpty] = useState(false);
	const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(false);
	const [showLoading, setShowLoading] = useState(false);
	const handleAmountChange = e => {
		const amountVal = e.target.value < 0 ? 0 : e.target.value;
		setAmount(amountVal);
		setIsAmountEmpty(!e.target.value);
	}
	const handleDescriptionChange = e => {
		setDescription(e.target.value);
		setIsDescriptionEmpty(!e.target.value.trim());
	}
	const handleTypeChange = (e) => setType(e.target.value);

	const fetchWalletData = (endpoint, walletId) => {
		axios
			.get(`${endpoint}/wallet/${walletId}`).then((response) => {
				if (response.status === 200) {
					const [walletData] = response.data;
					setWalletInfo({
						userName: walletData.userName,
						balance: walletData.balance
					});
				}
			})
			.catch((err) => {
				console.log(err)
				setShowLoading(false);
			});
	}

	useEffect(() => {
		fetchWalletData(endpoint, walletId);
	}, [walletId, endpoint]);

	const handleSubmit = () => {
		if (!amount || !description.trim()) {
			setSnackbarInfo({
				open: true,
				severity: "error",
				message: "Please fill all required data"
			});
			return;
		}
		setShowLoading(true);
		axios
			.post(`${endpoint}/transact/${walletId}`, {
				amount: +amount,
				description,
				type
			})
			.then(res => {
				const resJson = res.data;
				if (resJson.status === 200) {
					setWalletInfo({
						...walletInfo,
						balance: resJson.data.balance
					});
					setAmount("");
					setDescription("");
					setIsAmountEmpty(false);
					setIsDescriptionEmpty(false);
					setSnackbarInfo({
						open: true,
						severity: "success",
						message: "Your transaction was successful!"
					});
					setShowLoading(false);
				} else if (resJson.error) {
					setSnackbarInfo({
						open: true,
						severity: "error",
						message: resJson.message
					});
					setShowLoading(false);
				}
			})
			.catch(err => {
				console.error(err);
				setShowLoading(false);
			})
	}

	const handleSnackbarClose = () => {
		setSnackbarInfo({ ...snackbarInfo, open: false });
	}

	return (
		<div className="set-wallet-container">
			<Stack direction="row" spacing={2} sx={{ marginBottom: "20px", display: "flex", justifyContent: "space-around" }}>
				<Typography variant="h6" sx={{fontWeight: "bold"}}>{`Username: ${walletInfo.userName || "Loading"}`}</Typography>
				<Typography variant="h6" sx={{fontWeight: "bold"}}>{`Balance: ${walletInfo.balance}`}</Typography>
			</Stack>
			<Card>
				<CardContent>
					<Box>
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
								error={isAmountEmpty}
							/>
							<TextField
								required
								fullWidth
								id="outlined-required"
								label="Description"
								margin="normal"
								onChange={handleDescriptionChange}
								value={description}
								error={isDescriptionEmpty}
								inputProps={{maxlength: 30}}
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
								disabled={showLoading || !walletInfo.userName}
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

export default Wallet;