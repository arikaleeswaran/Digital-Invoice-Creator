const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const pool = require('../db');
const cors = require('cors');
require('dotenv').config()

//Middlewares



// const cors = require('cors');

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://invoicegenerator-tawny.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// app.use(cors());

app.get('/',(req,res)=>{
    res.send("Working!");
})

//INVOICE NUMBER GENERATOR TRANSACTION
app.get('/generate-invoice-number', async (req,res)=>{
    try{
        await pool.query('BEGIN');

        const result = await pool.query("SELECT * FROM invoice_sequence FOR UPDATE");
        const {prefix,year,sequence,padding_length,invoice_num} = result.rows[0];

        const currentYear = new Date().getFullYear();
        //const randomString = Math.random().toString(36).substring(2,6).toUpperCase();
        let seq = parseInt(sequence);
        const newSequence = seq+1;
        const InvoiceNumber = `INV-${currentYear}-${newSequence.toString().padStart(padding_length,'0')}`;

        await pool.query('UPDATE invoice_sequence SET sequence = $1, invoice_num = $2',[newSequence,InvoiceNumber]);

        await pool.query('COMMIT');

        res.json({InvoiceNumber});

    }catch (error){
        //console.log(error);
        await pool.query('ROLLBACK');
        return res.status(500).json({error});
    }
})

//ADD USER 
app.post('/users', async (req,res)=>{

    const {custData,invoiceNum,invoiceDate} = req.body;

    try{
        
        //console.log(custData);
        const customer_id = custData.CustId;
        const name = custData.CustName;
        const email = custData.CustEmail;
        const phone = custData.CustPhone;
        const address = custData.CustAddress;

        console.log(customer_id,name,email,phone,address);
        console.log(invoiceNum,customer_id,invoiceDate);

        await pool.query('BEGIN');
        
       const newUser = await pool.query("INSERT INTO customer (customer_id,name,email,phone,address) VALUES($1,$2,$3,$4,$5) RETURNING *",[customer_id,name,email,phone,address]);
        
       const insertInvoice = await pool.query("INSERT INTO invoice (invoice_id,customer_id,invoice_date) VALUES($1,$2,$3) RETURNING *",[invoiceNum,customer_id,invoiceDate]);

       await pool.query('COMMIT');

    //    console.log(insertInvoice.rows[0]);
    //    console.log(newUser.rows[0]);
       return res.json(newUser.rows[0]);

    }catch(error){
        console.log(error);
        await pool.query('ROLLBACK');
       return res.status(500).json({error});
    }
})

//POST PRODUCT
app.post("/products",async (req,res)=>{

    try{
        const newItem = req.body;
        //console.log(newItem);
        const product_id = newItem.Item_id;
        const pd_name = newItem.ItemName;
        const Quantity = newItem.Quantity;
        const price = newItem.Rate;
        //const Amount = newItem.Amount;
        //const GST = newItem.GST;
        const Total = newItem.Total;
        const InvoiceNum = newItem.InvoiceNumber;
        const Customer_Id = newItem.CustomerId;

        console.log(product_id,pd_name,price,InvoiceNum);

        await pool.query('BEGIN');

        const newProd = await pool.query("INSERT INTO products (product_id,pd_name,price) VALUES($1,$2,$3) RETURNING *",[product_id,pd_name,price]);
        const Newitem = await pool.query("INSERT INTO invoice_items (invoice_item_id,invoice_id,customer_id,quantity,total) VALUES($1,$2,$3,$4,$5) RETURNING *",[product_id,InvoiceNum,Customer_Id,Quantity,Total])

        await pool.query('COMMIT');
        
        console.log(Newitem.rows[0]);
        return res.json(newProd.rows[0]);

    }catch(error) {
        console.log(error);
        await pool.query('ROLLBACK');
        return res.status(500).json({error});
    }
})

//POST INVOICE
app.post('/invoice',async (req,res)=>{
    try{
        const {invoice_id, invoice_date,customer_id,total} = req.body;

        const newInvoice = await pool.query("INSERT INTO invoice (invoice_id, invoice_date, customer_id, total) VALUES ($1,$2,$3,$4) RETURNING *",[invoice_id,invoice_date,customer_id,total]);

        return res.json(newInvoice.rows[0]);

    }catch(error){
        return res.status(500).json({error})
    }
})

//POST INVOICE_ITEM
app.post('/invoiceItem', async (req,res)=>{
    try{
        const {invoice_id,customer_id,product_id,quantity,total} = req.body;

        const newItem = await pool.query("INSERT INTO invoice_items (invoice_id,customer_id,product_id,quantity,total) VALUES ($1,$2,$3,$4,$5) RETURNING *",[invoice_id,customer_id,product_id,quantity,total]);
        
        return res.json(newItem.rows[0]);

    }catch(error) {
        return res.status(500).json({error})
    }
})

//DELETE INVOICE_ITEM
app.delete('/:id',async (req,res)=>{
    try{
        const {id} = req.params;

        await pool.query('BEGIN');

        const deleteVal = await pool.query("DELETE FROM invoice_items WHERE invoice_item_id=$1",[id]);
        const deleteProd = await pool.query("DELETE FROM products WHERE product_id=$1",[id]);

        await pool.query('COMMIT');

        res.sendStatus(200);
    }catch(error){
        await pool.query('ROLLBACK');
        return res.status(500).json({error})
    }
})

//UPDATE INVOICE_ITEM
app.put('/products/:id',async (req,res)=>{
    try{
        const {id} = req.params;
        const data = req.body;
        console.log(data);
        const product_id = data.Item_id;
        const pd_name = data.ItemName; 
        const quantity = data.Quantity;
        const price = data.Rate;
        const total = data.Total;

        console.log("put",data);
        console.log("quant",quantity,price,total);

        await pool.query('BEGIN');

        const updateVal = await pool.query("UPDATE invoice_items SET quantity = $1 ,total = $2 WHERE invoice_item_id=$3 RETURNING *",[quantity,total,product_id]);

        const updateProd = await pool.query("UPDATE products SET pd_name = $1, price = $2 WHERE product_id = $3 RETURNING *",[pd_name,price,product_id]);

        await pool.query('COMMIT');
        res.json(updateVal.rows[0]);

    }catch(error){
        console.log(error);
        await pool.query('ROLLBACK');
        return res.status(500).json({error})
    }
})

//UPDATE INVOICE TOTAL
app.put('/invoice/:id',async (req,res)=>{
    try{
        const {id} = req.params;
        const {overallTotal} = req.body;
        //const total = data.overallTotal;
        console.log(overallTotal);

        const updateTot = await pool.query("UPDATE invoice SET total = $1 WHERE invoice_id = $2 RETURNING *",[overallTotal,id]);

        res.json(updateTot.rows[0]);

    }catch(error){
        console.log(error);
        return res.status(500).json(error)
    }
})

module.exports = app;
