'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var CustomerSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  address: { type: String, required: true },
  postnumber: { type: String, required: true },
  email: { type: String, required: true }, // TODO: should be required
  country: { type: String, required: true },
  phone: { type: String, required: true },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  active: { type: Boolean, default: true },
  note: { type: String, default: '' }
}, {
  timestamps: true
});

exports.default = _mongoose2.default.model('Customer', CustomerSchema);