'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var CategorySchema = new Schema({
  name: String,
  image: String,
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
});

exports.default = _mongoose2.default.model('Category', CategorySchema);