const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
var port = 3000;

let products = [];
let captureValue = false;
let orders = [];
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/product', (req, res) => {
    const product = req.body;
    const { id, name, price, unit, taken, payable } = product;
  
    // Convert taken and payable from strings to numbers and add them together
    const takenNum = parseInt(taken);
    const payableNum = parseInt(payable);
    const takenSum = products.reduce((acc, product) => acc + parseInt(product.taken), 0) + takenNum;
    const payableSum = products.reduce((acc, product) => acc + parseInt(product.payable), 0) + payableNum;
  
    // Check if product already exists
    const existingProductIndex = products.findIndex(product => product.id === id);
    if (existingProductIndex !== -1) {
      // If product already exists, update its taken and payable fields
      products[existingProductIndex].taken = takenSum.toString();
      products[existingProductIndex].payable = payableSum.toString();
      res.json({ message: `Product with ID ${id} updated successfully.` });
    } else {
      // If product does not exist, add it to the products array
      products.push(product);
      res.json({ message: `Product with ID ${id} added successfully.` });
    }
});

app.get('/product', (req, res) => {
    res.json(products);
});

app.get('/product/:id', (req, res) => {
    // reading id from the URL
    const id = req.params.id;

    // searching products for the id
    for (let product of products) {
        if (product.id === id) {
            res.json(product);
            return;
        }
    }

    // sending 404 when not found something is a good practice
    res.status(404).send('Product not found');
});

app.delete('/product/:id', (req, res) => {
    // reading id from the URL
    const id = req.params.id;

    // remove item from the products array
    products = products.filter(i => {
        if (i.id !== id) {
            return true;
        }

        return false;
    });

    // sending 404 when not found something is a good practice
    res.send('Product is deleted');
});

app.post('/product/:id', (req, res) => {
    // reading id from the URL
    const id = req.params.id;
    const newProduct = req.body;

    // remove item from the products array
    for (let i = 0; i < products.length; i++) {
        let product = products[i]

        if (product.id === id) {
            products[i] = newProduct;
        }
    }

    // sending 404 when not found something is a good practice
    res.send('Product is edited');
});

app.post('/checkout', (req, res) => {
    const order = req.body;

    // output the product to the console for debugging
    orders.push(order);
    res.redirect(302, 'https://autobillingdesk.github.io/');
});

app.get('/checkout', (req, res) => {
    res.json(orders);

});

app.post('/capture', (req, res) => {
  captureValue = req.body.capture
  console.log('Capture:', captureValue)
  res.send('POST request received')
})

app.get('/capture', (req, res) => {
  res.json({ capture: captureValue });
});

app.listen(port, () => {
    console.log(`Server listening on port https://localhost:${port}`);
});
