'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var PaymentSchema = new Schema({
  name: { type: String, required: true },
  image: String,
  active: { type: Boolean, default: true }
});

exports.default = _mongoose2.default.model('Payment', PaymentSchema);