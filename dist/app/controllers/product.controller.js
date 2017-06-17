'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Product = require('../models/Product');

var _Product2 = _interopRequireDefault(_Product);

var _Category = require('../models/Category');

var _Category2 = _interopRequireDefault(_Category);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var load = function load(req, res, next, id) {
  _Product2.default.get(id).then(function (product) {
    req.product = product;
    return next();
  }).catch(function (e) {
    return next(e);
  });
};

var create = function create(req, res, next) {
  var product = new _Product2.default({
    name: req.body.name,
    category: req.body.category,
    description: req.body.description,
    image: req.body.image,
    price: req.body.price,
    quantity: req.body.quantity,
    active: req.body.active
  });

  product.save().then(function () {
    var categoryId = req.body.category;

    return _Category2.default.findById(categoryId).exec();
  }).then(function (category) {
    if (req.body.category) {
      category.products.push(product);

      return category.save();
    }
    return product;
  }).then(function () {
    return res.json({ message: 'Product created!', data: product });
  }).catch(function (e) {
    return next(e);
  });
};

var list = function list(req, res, next) {
  var _req$query = req.query,
      _req$query$limit = _req$query.limit,
      limit = _req$query$limit === undefined ? 50 : _req$query$limit,
      _req$query$skip = _req$query.skip,
      skip = _req$query$skip === undefined ? 0 : _req$query$skip,
      _req$query$query = _req$query.query,
      query = _req$query$query === undefined ? '' : _req$query$query;


  _Product2.default.list({ limit: limit, skip: skip, query: query }).then(function (product) {
    return res.json(product);
  }).catch(function (e) {
    return next(e);
  });
};

var get = function get(req, res) {
  return res.json(req.product);
};

var remove = function remove(req, res, next) {
  var product = req.product;

  product.remove().then(function () {
    return res.json({ message: 'Successfully deleted!' });
  }).catch(function (e) {
    return next(e);
  });
};

var update = function update(req, res, next) {
  var body = req.body || {};

  _Product2.default.findByIdAndUpdate(req.params.id, body, { new: true }).populate('category').exec().then(function (product) {
    return res.json({ message: 'Product updated!', data: product });
  }).catch(function (e) {
    return next(e);
  });
};

exports.default = {
  create: create,
  list: list,
  get: get,
  load: load,
  remove: remove,
  update: update
};