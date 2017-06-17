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

var ProductSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  name: String,
  description: String,
  image: String,
  quantity: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  price: Number
});

ProductSchema.statics = {
  get: function get(id) {
    return this.findById(id).populate('category').exec().then(function (product) {
      if (product) {
        return product;
      }
      var err = new _APIError2.default('No such product exists!', _httpStatus2.default.NOT_FOUND, true);
      return _bluebird2.default.reject(err);
    });
  },
  list: function list() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$skip = _ref.skip,
        skip = _ref$skip === undefined ? 0 : _ref$skip,
        _ref$limit = _ref.limit,
        limit = _ref$limit === undefined ? 50 : _ref$limit,
        _ref$query = _ref.query,
        query = _ref$query === undefined ? '' : _ref$query;

    return this.find({
      name: new RegExp(query, 'i')
    }).sort({
      createdAt: -1
    }).skip(+skip).limit(+limit).exec();
  }
};

exports.default = _mongoose2.default.model('Product', ProductSchema);