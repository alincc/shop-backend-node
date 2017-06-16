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

CustomerSchema.statics = {
  get: function get(id) {
    return this.findById(id).populate({
      path: 'orders',
      model: 'Order',
      populate: {
        path: 'payment',
        model: 'Payment'
      }
    }).exec().then(function (customer) {
      if (customer) {
        return customer;
      }
      var err = new _APIError2.default('No such customer exists!', _httpStatus2.default.NOT_FOUND, true);
      return _bluebird2.default.reject(err);
    });
  },
  list: function list() {
    return this.find().exec();
  }
};

exports.default = _mongoose2.default.model('Customer', CustomerSchema);