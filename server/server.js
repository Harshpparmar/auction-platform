const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db/db');
const createDefaultAdmin = require('./utils/defaultAdmin')

// loading the env variables
dotenv.config();

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in .env file');
    process.exit(1);
}


// createDefaultAdmin()
connectDB().then(() => {
    console.log('Connected to MongoDB');
    return createDefaultAdmin();
}).then( () => {
    console.log('Default admin created successfully');
}).catch((error) => {
    console.error('Error during startup:', error);
})

//express app creation
const app = express();

// middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "https://auction-platform-nu.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
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