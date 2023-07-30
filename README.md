Welcome to Pocket Wallet app. It is a digital wallet web application.

## App URL
https://pocket-wallet-ylp6.onrender.com/

## What can this app do?
- Setup your wallet with your name and with optional initial balance
- Remembers your set wallet if you revisit
- View your balance
- Debit/Credit some amount on your balance with easy to use UI
- View all transactions in table format
- Sort table according to date and amount
- Pagination of data
- Download all transaction data as CSV
- Data validations as applicable

## Tech stack
- ReactJS
- MUI
- Node/ExpressJS
- MongoDB

## Run Locally
Clone the repo using 
`git clone https://github.com/shyamvkansagra/pocket-wallet.git`

Make sure you have `node` available on your system.

In root directory, run commands in terminal
For installing backend: `npm run install-server`
For installing frontend: `npm run install-client`

To start the app, you need to start backend server as well as frontend app. Stay in root directory and run following commands in terminal:

For starting backend: `npm run start-server`
(It starts a server on port 5000 and also connects to MongoDB if it shows "Database connected successfully" in your terminal console)

For starting frontend: `npm run start-client`
(It will open up localhost:3000 in your browser and should show the landing page)

## Deployment
App is deployed using `https://render.com/`'s free hosting services. 
Created a web server(node - backend) and static site (node - frontend) and added the appropriate commands. Deployment automatically triggers if we push code to `main` branch.

Database is created using MongoDB Atlas cloud service. A cluster was created and collections were added in it to store data. render.com's IP was added to whitelist to allow the access. Storage limit is 512 MB on my free plan.

Deployed frontend URL: https://pocket-wallet-ylp6.onrender.com
Deployed backend URL: https://pocket-wallet-xlet.onrender.com

Mongo cluster URL: https://cloud.mongodb.com/v2/64c29bd8771e8e34c9128167#/clusters

"Render" dashboard: https://dashboard.render.com/

##### I have chosen "Free" plans while creating accounts, so some delay in API calls is expected.

## Technical design
### Folder structure
A separate folders have been used for frontend and backend. Backend covers APIs and Database connection related code and Frontend covers UI related code. 

Backend folder has "api" and "models" folder to store API endpoint definitions and database schema respectively.

Frontend folder has its own package file to run and install frontend specific libraries. 

Apart from this, .env and .gitignore have been added in root folder.

### API endpoints
**Wallet APIs**
Setup a wallet
```
Endpoint: "/setup"
Type: POST
Payload: {
	"balance": 560,
	"userName": "Testqwerty"
}
Response: {
	code: 200,
	data: {
		"balance": 560,
		"createdDate": "2023-07-30T08:32:40.884Z",
		"transactionId": "1690705960881",
		"userName": "Testqwerty",
		"_id": "64c62028a6c9c0248dc6c0d4"
	}
}
```
Fetch Wallet
```
Endpoint: "/wallet/:walletId"
Type: GET
Params: walletId
Response: [{
	"balance": 560
	"createdDate": "2023-07-30T08:32:40.884Z"
	"transactionId": "1690705960881"
	"userName": "Testqwerty"
	"_id": "64c62028a6c9c0248dc6c0d4"
}]
```

**Transaction APIs**
Make a transaction
```
Endpoint: "/transact/:walletId"
Type: POST
Params: walletId
Payload: {
    "amount": 3746,
    "description": "oiuo",
    "type": "credit"
}
Response: {
    "status": 200,
    "data": {
        "balance": 4306,
        "transactionId": "1690706353301"
    }
}
```
Fetch your transactions
```
Endpoint: "/transactions?walletId=walletId&skip=0&limit=10&sortBy=amount&sortOrder=1"
Type: GET
Query: walletId,skip, limit, sortBy, sortOrder
Response: [
    {
        "totalData": [
            {
                "_id": "64c621b1a6c9c0248dc6c0d9",
                "walletId": "64c62028a6c9c0248dc6c0d4",
                "amount": 3746,
                "balance": 4306,
                "description": "oiuo",
                "type": "credit",
                "transactionId": "1690706353301",
                "createdDate": "2023-07-30T08:39:13.301Z"
            }
        ],
        "totalCount": [
            {
                "count": 1
            }
        ]
    }
]
```

### Database design
Database: MongoDB Atlas
Cluster: ClusterPocketWallet
Collections: wallets, transactions

**Wallet schema**
```
| Key | Data type | Required? | Default |
|--|--|--|--|
| balance | Number | Yes |  |
| userName | String | Yes |  |
| transactionId | String | Yes |  |
| createdDate | Date | Yes | Date.now |
```
**Transaction schema**
```
| Key | Data type | Required? | Default |
|--|--|--|--|
| walletId | String | Yes |  |
| amount | Number | Yes |  |
| balance | Number | Yes |  |
| description | String | Yes |  |
| type | String | Yes |  |
| transactionId | String | Yes |  |
| createdDate | Date | Yes | Date.now |
```

### UI Design
CSS Library: Material UI

2 routes: 
- Home: "/",
- Transactions: "/transactions"

Local storage: For saving wallet ID

UI Components:
- App wrapper
- Wallet
- Transactions
- Util

## Next Steps
This application can be enhanced and scaled with the following:
- Auth Layer
- Aria accessibility
- Error capturing and Logging (frontend & backend)
- Unit/Integration Tests with frameworks
- Instrumentation and analytics (GA/MS-Clarity)
- Data caching in frontend & backend
- Code refactoring / UX enhancements
- Log writing to store data in DB in case of large number of writes per second
- Data cleanup to delete older data from DB
- Backup of DB and servers