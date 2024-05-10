const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config({ path: './config/config.env' })

// Route files
const bootcamps = require('./routes/bootcamps')

// MongoDB configuration
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Parse body
app.use(express.json());

// Dev middleware configuration
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Mount routers
app.use(process.env.APP_URL, bootcamps);

// error middleware
app.use(errorHandler);

const server = app.listen(
  PORT,
  () => console.log(`Server running in ${process.env.NODE_ENV.blue} mode on port ${PORT.green}`.bold),
);

// Handle promise errors
process.on('unhandledRejection', (err, promise) => {
  console.log(`ERROR: ${err.message}`.red);
  server.close(() => process.exit(1));
})