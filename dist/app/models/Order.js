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

var OrderSchema = new Schema({
  total: Number,
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  status: Number,
  shipping: {
    value: { type: Schema.Types.ObjectId, ref: 'Shipping' },
    trackingNumber: String,
    price: Number,
    weight: Number
  },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number
  }],
  payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
  statusLog: [{
    status: Number,
    createdAt: { type: Date, default: Date.now }
  }],
  shippingAddress: {
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    firstname: { type: String, default: '' },
    lastname: { type: String, default: '' },
    postnumber: { type: String, default: '' },
    address: { type: String, default: '' },
    country: { type: String, default: '' }
  }
}, {
  timestamps: true
});

OrderSchema.pre('findOneAndUpdate', function (next) {
  // eslint-disable-line
  // console.log(this.getUpdate());
  next();
});

OrderSchema.pre('save', function (next) {
  // eslint-disable-line
  // console.log("this", this);
  next();
});

OrderSchema.methods = {
  addStatus: function addStatus(status) {
    undefined.statusLog.push({ status: status });

    return undefined.save();
  }
};

OrderSchema.statics = {
  get: function get(id) {
    return this.findById(id).populate('customer items.product shipping.value payment').exec().then(function (order) {
      if (order) {
        return order;
      }
      var err = new _APIError2.default('No such order exists!', _httpStatus2.default.NOT_FOUND, true);
      return _bluebird2.default.reject(err);
    });
  },
  list: function list() {
    return this.find().exec();
  }
};

exports.default = _mongoose2.default.model('Order', OrderSchema);