const express = require('express');
const app = express();
const connectDB = require('./config/db');

const cors = require("cors");
app.use(express.json());
app.use(cors());

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/payment', require('./routes/api/payment'));
app.use('/api/video', require('./routes/api/video'));


// Set Static Folder
app.use('/uploads', express.static('uploads'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
