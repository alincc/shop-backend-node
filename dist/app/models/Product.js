'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var ProductSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  name: String,
  description: String,
  image: String,
  price: Number
});

exports.default = _mongoose2.default.model('Product', ProductSchema);