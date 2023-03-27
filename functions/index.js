const functions = require('firebase-functions');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const { errorHandler } = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');

const app = express();
const { DB = 'mongodb://localhost:27017/blogdb' } = process.env;
mongoose.connect(DB);

// Боди-парсер
app.use(bodyParser.json());

// CORS
app.use(cors());

// Логгер запросов
app.use(requestLogger);

// Роуты
app.use('/', routes);

// Логгер ошибок
app.use(errorLogger);

// Обработчик ошибок celebrate
app.use(errors());

// Централизованный обработчик ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(3000);
exports.app = functions.https.onRequest(app);
