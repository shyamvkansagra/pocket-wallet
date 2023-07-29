import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom"
import LandingPage from "./Components/Wallet/Index.js";
import Transactions from "./Components/Transactions/Index.js";
import { getLocal } from "./Utils/utils";

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