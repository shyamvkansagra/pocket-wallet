import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom"
import LandingPage from "./Components/Wallet/Home";
import Transactions from "./Components/Transactions/Transactions";
import { getLocal } from "./Utils/utils";

const endpoint = "https://pocket-wallet-xlet.onrender.com";
// const endpoint =  "http://localhost:5000";

const App = () => {
	const [walletId, setWalletId] = useState("");

	useEffect(() => {
		const walletId = getLocal("walletId");
		if (walletId) {
			setWalletId(walletId);
		}
	}, [walletId])
	return (
		<div className="App">
      <Routes>
        <Route path="/" element={ <LandingPage walletId={walletId} setWalletId={setWalletId} endpoint={endpoint} /> } />
        <Route path="transactions" element={ <Transactions walletId={walletId} endpoint={endpoint} /> } />
      </Routes>
    </div>
	);
}

export default App;