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

var CategorySchema = new Schema({
  name: String,
  image: String,
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
});

CategorySchema.statics = {
  get: function get(id) {
    return this.findById(id).populate('products').exec().then(function (category) {
      if (category) {
        return category;
      }
      var err = new _APIError2.default('No such category exists!', _httpStatus2.default.NOT_FOUND, true);
      return _bluebird2.default.reject(err);
    });
  },
  list: function list() {
    return this.find().exec();
  }
};

exports.default = _mongoose2.default.model('Category', CategorySchema);