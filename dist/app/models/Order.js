'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var OrderSchema = new Schema({
  total: Number,
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  status: Number,
  shipping: { type: Schema.Types.ObjectId, ref: 'Shipping' },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }],
  payment: { type: Schema.Types.ObjectId, ref: 'Payment' }
}, {
  timestamps: true
});

exports.default = _mongoose2.default.model('Order', OrderSchema);