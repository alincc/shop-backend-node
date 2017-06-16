'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _APIError = require('../helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

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

UserSchema.statics = {
  get: function get(id) {
    return this.findById(id).populate('customer').exec().then(function (user) {
      if (user) {
        return user;
      }
      var err = new _APIError2.default('No such user exists!', _httpStatus2.default.NOT_FOUND, true);
      return _bluebird2.default.reject(err);
    });
  },
  list: function list() {
    return this.find().exec();
  }
};

exports.default = _mongoose2.default.model('User', UserSchema);