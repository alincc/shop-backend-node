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

var PaymentSchema = new Schema({
  name: { type: String, required: true },
  image: String,
  active: { type: Boolean, default: true }
});

PaymentSchema.statics = {
  get: function get(id) {
    return this.findById(id).exec().then(function (payment) {
      if (payment) {
        return payment;
      }
      var err = new _APIError2.default('No such payment exists!', _httpStatus2.default.NOT_FOUND, true);
      return _bluebird2.default.reject(err);
    });
  },
  list: function list() {
    return this.find().exec();
  }
};

exports.default = _mongoose2.default.model('Payment', PaymentSchema);