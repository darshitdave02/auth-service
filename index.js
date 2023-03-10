require('dotenv').config();
const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(express.json());
app.use(cors());

const authRouter = require('./src/routes/authRoutes');

app.use('/', authRouter);

app.listen(port, () => {
  console.log(`started listening on port ${port}`);
});