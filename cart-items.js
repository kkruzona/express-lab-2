const express = require("express");
const pool = require("./pg-connection-pool");
const cart = express.Router();

async function getTable(req, res){
      const results = await pool.query(`select * from shopping_cart;`)
      res.json(results.rows);
  }

 cart.get("/", (req, res) => {
    // getTable(req, res);
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
 });

 cart.get("/:id", async (req, res) => {
    // let id = req.params.id;
    // let found = await pool.query("SELECT * FROM shopping_cart WHERE id=$1", [id]);
    // if(found){
    //     res.json(result.rows);
    // }else {
    //     res.status(404).send('ID Not Found');
    // }
    // res.json(found);
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

 cart.post("/", (req, res) => {

 });

 cart.put("/:id", (req, res) => {

 });

 cart.delete("/", (req, res) => {

 });

 module.exports = cart; 