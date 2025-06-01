const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db/db');
const createDefaultAdmin = require('./utils/defaultAdmin')

// loading the env variables
dotenv.config();

connectDB();

createDefaultAdmin()

//express app creation
const app = express();

// middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const bidRoutes = require('./routes/bidRoutes');
const adminRoutes = require('./routes/adminRoutes');

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/admin', adminRoutes);
// test route
app.get('/api/test', (req, res) => {
    res.send('Welcome to the Auction Platform API');
});

// server start 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})