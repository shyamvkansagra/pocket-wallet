import React from 'react';
import AppWrapper from '../AppWrapper/AppWrapper';

const Transactions = ({ walletId }) => {
	return (
		<AppWrapper walletId={walletId}>
			<>Transactions</>
		</AppWrapper>
	);
}

export default Transactions;