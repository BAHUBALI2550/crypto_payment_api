const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const db = require('./models'); // Import sequelize models

// Initialize Express app
const app = express();
app.use(bodyParser.json()); // Parse incoming JSON requests
const PORT = 3000;


// Home Route
app.get('/', (req, res) => {
  res.status(200).send('Crypto Payment API is running!');
});

/* =====================
   PRODUCT ROUTES
   ===================== */

// Create a Product
app.post('/products', async (req, res) => {
  try {
    const { name, description, price, coinType, imageUrl, sellerAddress } = req.body;

    // Create a new product
    const product = await db.Product.create({ name, description, price, coinType, imageUrl, sellerAddress });
    res.status(201).json({ message: 'Product created successfully!', product });
  } catch (error) {
    res.status(400).json({ error: 'Error creating product', details: error.message });
  }
});

// get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      error: "Error fetching products",
      details: error.message,
    });
  }
});

// Get all Products for a seller
app.get('/products/:sellerAddress', async (req, res) => {
  try {
    const { sellerAddress } = req.params;

    // Find all products for the seller
    const products = await db.Product.findAll({ where: { sellerAddress } });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching products', details: error.message });
  }
});

// Get a single Product by ID
app.get('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the product by ID
    const product = await db.Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching product', details: error.message });
  }
});

// Update a Product
app.put('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, coinType, imageUrl } = req.body;

    // Update the product
    const updatedProduct = await db.Product.update(
      { name, description, price, coinType, imageUrl },
      { where: { id }, returning: true }
    );

    if (!updatedProduct[0]) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully!', product: updatedProduct[1][0] });
  } catch (error) {
    res.status(400).json({ error: 'Error updating product', details: error.message });
  }
});

// Delete a Product
app.delete('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the product
    const deleted = await db.Product.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting product', details: error.message });
  }
});

/* =====================
   TRANSACTION ROUTES
   ===================== */

// Create a Transaction
app.post('/transactions', async (req, res) => {
  try {
    const { transactionHash, productId, sellerAddress, coinType, amount, message, status, confirmationCount } = req.body;

    // Create a new transaction
    const transaction = await db.Transaction.create({
      transactionHash,
      productId,
      sellerAddress,
      coinType,
      amount,
      message,
      status,
      confirmationCount,
    });

    res.status(201).json({ message: 'Transaction created successfully!', transaction });
  } catch (error) {
    res.status(400).json({ error: 'Error creating transaction', details: error.message });
  }
});

// Get all Transactions for a seller
app.get('/transactions/:sellerAddress', async (req, res) => {
  try {
    const { sellerAddress } = req.params;

    // Find all transactions for the seller
    const transactions = await db.Transaction.findAll({ where: { sellerAddress }, include: db.Product });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching transactions', details: error.message });
  }
});

// Get a single Transaction by transactionHash
app.get('/transaction/:transactionHash', async (req, res) => {
  try {
    const { transactionHash } = req.params;

    // Fetch the transaction by transactionHash
    const transaction = await db.Transaction.findOne({
      where: { transactionHash },
      include: db.Product,
    });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching transaction', details: error.message });
  }
});

// Update a Transaction's status
app.put('/transaction/:transactionHash', async (req, res) => {
  try {
    const { transactionHash } = req.params;
    const { status, confirmationCount } = req.body;

    // Update the transaction
    const updatedTransaction = await db.Transaction.update(
      { status, confirmationCount },
      { where: { transactionHash }, returning: true }
    );

    if (!updatedTransaction[0]) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction updated successfully!', transaction: updatedTransaction[1][0] });
  } catch (error) {
    res.status(400).json({ error: 'Error updating transaction', details: error.message });
  }
});

// Delete a Transaction
app.delete('/transaction/:transactionHash', async (req, res) => {
  try {
    const { transactionHash } = req.params;

    // Delete the transaction
    const deleted = await db.Transaction.destroy({ where: { transactionHash } });
    if (!deleted) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting transaction', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

db.sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully');
    // Sync models ONLY in development, avoid in production
    if (process.env.NODE_ENV === 'development') {
      db.sequelize.sync(); // Use { alter: true } if needed
    }
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });