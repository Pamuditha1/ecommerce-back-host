const express = require('express');
const app = express();
const mongoose = require('mongoose')

const addProduct = require('./routes/addProductRoute')

mongoose.connect(env.mongoDB)
    .then(() => {console.log('Connected to mongoDB')})
    .catch((err) => {console.log('Could not Connect to mongoDB', err)})


app.use('/ninetees/api/admin/addproduct/', addProduct)

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Listening on port ${port} ...`));