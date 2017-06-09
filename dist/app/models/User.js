'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var UserSchema = new Schema({
  admin: { type: Boolean, default: false },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  ip: String
}, {
  timestamps: true
});

exports.default = _mongoose2.default.model('User', UserSchema);