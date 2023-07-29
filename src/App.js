// import React, {useState, useEffect} from 'react'
// import axios from 'axios';

// const App = function () {
// 	const [users, setUsers] = useState(null);

// 	const [username, setUsername] = useState("");
// 	const [email, setEmail] = useState("");
// 	useEffect(() => {
// 		if (!users) {
// 			axios
// 				.get("/api/users")
// 				.then((users) => setUsers(users))
// 				.catch((err) => console.log(err));
// 		}
// 	}, [users]);

// 	function submitForm() {
// 		if (username === "") {
// 			alert("Please fill the username field");
// 			return;
// 		}
// 		if (email === "") {
// 			alert("Please fill the email field");
// 			return;
// 		}
// 		axios
// 			.post("/api/users", {
// 				name: username,
// 				email: email,
// 			})
// 			.then(function () {
// 				alert("Account created successfully");
// 				// window.location.reload();
// 			})
// 			.catch(function () {
// 				alert("Could not creat account. Please try again");
// 			});
// 	}
// 	return (
// 		<>
// 			<h1>My Project</h1>
// 			{users === null ? (
// 				<p>Loading...</p>
// 			) : users?.data?.length === 0 ? (
// 				<p>No user available</p>
// 			) : (
// 				<>
// 					<h2>Available Users</h2>
// 					<ol>
// 						{users?.data?.map((user, index) => (
// 							<li key={index}>
// 								Name: {user.name} - Email: {user.email}
// 							</li>
// 						))}
// 					</ol>
// 				</>
// 			)}

// 			<form onSubmit={submitForm}>
// 				<input
// 					onChange={(e) => setUsername(e.target.value)}
// 					type="text"
// 					placeholder="Enter your username"
// 				/>
// 				<input
// 					onChange={(e) => setEmail(e.target.value)}
// 					type="text"
// 					placeholder="Enter your email address"
// 				/>
// 				<input type="submit" />
// 			</form>
// 		</>
// 	);
// };
// export default App

import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom"
import LandingPage from "./components/Wallet/index";
import Transactions from "./components/Transactions/index";
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