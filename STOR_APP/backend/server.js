require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

let mongodInstance = null;

async function start() {
  // Lazy-require routers so the file can be read before DB is ready
  const appointmentsRouter = require('./routes/appointments');
  const authRouter = require('./routes/auth');

  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRouter);
  app.use('/api/appointments', appointmentsRouter);

  let mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongodInstance = mongod;
      mongoUri = mongod.getUri();
      console.log('Using in-memory MongoDB');
    } catch (err) {
      console.error('Failed to start in-memory MongoDB:', err);
    }
  }

  try {
    await mongoose.connect(mongoUri || 'mongodb://localhost:27017/citas');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}

start();

process.on('SIGINT', async () => {
  if (mongodInstance) await mongodInstance.stop();
  process.exit(0);
});
