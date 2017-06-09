import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './app/config/db';

const app     = express();

const port = process.env.PORT || 9000;

import routes from './app/routes/route';

import User from './app/models/User';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use('/api', routes);

app.listen(port);
console.log('Server listening on port ' + port);
