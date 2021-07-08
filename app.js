// require the Express module
const express = require("express");
const cart = require('./cart-items');
// creates an instance of an Express server
const app = express();
// define the port
const port = 3000;
app.use(express.json());
app.use('/cart-items',cart);

// run the server
app.listen(port, () => console.log(`Listening on port: ${port}.`)); 