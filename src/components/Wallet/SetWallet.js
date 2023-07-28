import React from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import "./WalletStyles.css";

const SetWallet = () => {
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
							/>
							<TextField
								fullWidth
								id="outlined-required"
								label="Initial Balance"
								margin="normal"
							/>
							<Button sx={{ marginTop: "20px" }} fullWidth variant="contained">Submit</Button>
						</CardContent>
					</Box>
				</CardContent>
			</Card>
		</div>
	);
}

export default SetWallet;