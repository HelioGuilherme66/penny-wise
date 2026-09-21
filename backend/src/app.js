const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const coursesRouter = require('./routes/courses');
const mongoose = require('mongoose');
const studio = require('@mongoosejs/studio/express');
const authRoutes = require('./routes/auth');

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/courses', coursesRouter);

  const connection = mongoose.createConnection(
    'mongodb://service_mongo:27017/pennywise_db',
  );
  // 3. Mount Mongoose Studio UI and API handlers
  // Note: Wrap the setup in an async context or mount via a custom wrapper route since studio() returns a Promise
  app.use('/studio', async (req, res, next) => {
    try {
      const studioMiddleware = await studio('/studio/api', connection, {
        bindIp: '127.0.0.1,192.168.4.182',
      });
      studioMiddleware(req, res, next);
    } catch (err) {
      next(err);
    }
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
