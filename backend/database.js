const mongoose = require('mongoose');
const connection = "mongodb+srv://shyamkansagra:KYHDWvIK4pOm2iad@clusterpocketwallet.6fdjheq.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(connection,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));