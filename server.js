import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import httpStatus from 'http-status';

import config from './app/config/config';
import db from './app/config/db'; // eslint-disable-line no-unused-vars
import routes from './app/routes/route';

const app = express();

const port = process.env.PORT || 9000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/api', routes);

app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  })
);

app.listen(port);
console.log(`Server listening on port ${port}`); // eslint-disable-line no-console
