import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom"
import LandingPage from "./components/Wallet/index";
import Transactions from "./components/Transactions/index";
import { getLocal } from "./utils/utils";

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
        <Route path="/" element={ <LandingPage walletId={walletId} setWalletId={setWalletId} /> } />
        <Route path="transactions" element={ <Transactions walletId={walletId} /> } />
      </Routes>
    </div>
	);
}

export default App;