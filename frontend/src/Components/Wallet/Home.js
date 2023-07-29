import React from "react";
import AppWrapper from "../AppWrapper/AppWrapper";
import Wallet from "./Wallet";
import SetWallet from "./SetWallet";
import Typography from '@mui/material/Typography';
import "./walletStyles.css";

const LandingPage = ({ walletId, setWalletId, endpoint }) => {
  return (
      <AppWrapper walletId={walletId}>
        <div className="wallet-container">
          <Typography variant="h6" noWrap component="div">Welcome to Pocket Wallet!</Typography>
          {walletId ? <Wallet endpoint={endpoint} walletId={walletId} /> : <SetWallet endpoint={endpoint} setWalletId={setWalletId} />}
        </div>
      </AppWrapper>
  );
}

export default LandingPage;