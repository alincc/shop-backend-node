'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.connect(_config2.default.database.url);
_mongoose2.default.Promise = require('bluebird');

var db = exports.db = _mongoose2.default.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  console.log('Connection with database succeeded');
});