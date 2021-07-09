const express = require("express");
const pool = require("./pg-connection-pool");
const cart = express.Router();

async function getTable(req, res){
      const results = await pool.query(`select * from shopping_cart;`)
      res.json(results.rows);
  }

 cart.get("/", (req, res) => {
    let maxPrice = req.query.maxPrice;
    if (maxPrice){
        pool.query("select * from shopping_cart where price<=$1", [maxPrice]).then(result =>{
        res.json(result.rows);
    })}
    let prefix = req.query.prefix;
    if (prefix){
        pool.query("SELECT * FROM shopping_cart WHERE product iLIKE $1", [prefix + "%"]).then(result =>{
        res.json(result.rows);
    })}
    let pageSize = req.query.pageSize;
    if (pageSize){
        pool.query("SELECT * FROM shopping_cart LIMIT $1", [pageSize]).then(result =>{
        res.json(result.rows);
    })}
    getTable(req, res);
 });

//Chris's extended challege BEGINNING - to get total of cart items
  cart.get("/total", async (req, res) => {
    let price = req.params.price;
    let quantity = req.params.quantity;
    let product = req.params.product;
    let itemTotal = await pool.query("SELECT product, SUM(price * quantity) AS total FROM shopping_cart GROUP BY product ORDER BY product ASC");
    let grandTotal = await pool.query("SELECT SUM(price * quantity) AS total FROM shopping_cart");
    let totalItems = await pool.query("SELECT SUM(quantity) AS count FROM shopping_cart");
    res.json({"Total Items": totalItems.rows, "Total by Product": itemTotal.rows, "Grand Total": grandTotal.rows});
});
//extended challege END

 cart.get("/:id", async (req, res) => {
    let id = req.params.id;
    try {
        let result = await pool.query("SELECT * FROM shopping_cart WHERE id=$1", [id]);
        if (result.rows.length == 0) {
            res.status(404).json('ID Not Found');
        } else {
            res.json(result.rows);
        }
    } catch (error) {
        console.log(error);
        res.status(404).json('ID Not Found');
    }
 });

 cart.post("/", async (req, res) => {
    const { product, price, quantity } = req.body;
    await pool.query('INSERT INTO shopping_cart(product, price, quantity) VALUES($1, $2, $3)', [product, price, quantity])
    let newItem = await pool.query('SELECT * FROM shopping_cart WHERE product=$1 ORDER BY id DESC LIMIT 1',[product])
    res.status(201).json(newItem.rows);
});

 cart.put("/:id", async (req, res) => {
    let updatedItem = req.body;
    await pool.query('UPDATE shopping_cart SET "product"=$1, "price"=$2, "quantity"=$3 WHERE id=$4',[req.body.product, req.body.price, req.body.quantity, req.params.id])
    let newItem = await pool.query('SELECT * FROM shopping_cart WHERE id=$1',[req.params.id])
    res.json(newItem.rows);
 });

 cart.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let results = await pool.query('DELETE FROM shopping_cart WHERE id=$1', [id])
    res.status(204).json(results);
 });

 module.exports = cart; 