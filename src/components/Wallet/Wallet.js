import React from "react";
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

import "./WalletStyles.css";

const Wallet = () => {
	return (
		<div className="set-wallet-container">
			<Stack direction="row" spacing={2} sx={{ marginBottom: "20px", display: "flex", justifyContent: "space-around" }}>
						<Typography sx={{fontWeight: "bold"}}>Username: Shyam</Typography>
						<Typography sx={{fontWeight: "bold"}}>Balance: 30.0045</Typography>
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
							<Typography>Make a transition</Typography>
						</span>
						<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
							<TextField
								required
								fullWidth
								id="outlined-required"
								label="Amount"
							/>
							<ToggleButtonGroup
								color="primary"
								value="credit"
								exclusive
								onChange={() => {}}
								aria-label="Transaction-Type"
								sx={{ marginTop: "20px" }}
							>
								<ToggleButton value="credit">Credit</ToggleButton>
								<ToggleButton value="debit">Debit</ToggleButton>
							</ToggleButtonGroup>
							<Button sx={{ marginTop: "20px" }} fullWidth variant="contained">Submit</Button>
						</CardContent>
					</Box>
				</CardContent>
			</Card>
		</div>
	);
}

export default Wallet;