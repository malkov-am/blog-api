require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3000 } = process.env;
const { DB = "mongodb://localhost:27017/blogdb" } = process.env;
mongoose.connect(DB);

app.use(bodyParser.json());

app.use(cors());

app.use(errorLogger);

app.listen(PORT);
