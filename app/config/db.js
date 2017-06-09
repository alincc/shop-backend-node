import mongoose from 'mongoose';
import config from './config';

mongoose.connect(config.database.url);
mongoose.Promise = require('bluebird');

export const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  console.log('Connection with database succeeded');
});
