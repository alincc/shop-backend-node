'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Shipping = require('../models/Shipping');

var _Shipping2 = _interopRequireDefault(_Shipping);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var load = function load(req, res, next, id) {
  _Shipping2.default.get(id).then(function (shipping) {
    req.shipping = shipping;
    return next();
  }).catch(function (e) {
    return next(e);
  });
};

var create = function create(req, res, next) {
  var shipping = new _Shipping2.default({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description
  });

  shipping.save().then(function (shipping) {
    return res.json({ message: 'Shipping created!', data: shipping });
  }).catch(function (e) {
    return next(e);
  });
};

var list = function list(req, res, next) {
  _Shipping2.default.list().then(function (shipping) {
    return res.json(shipping);
  }).catch(function (e) {
    return next(e);
  });
};

var get = function get(req, res) {
  return res.json(req.shipping);
};

var remove = function remove(req, res, next) {
  var shipping = req.shipping;

  shipping.remove().then(function () {
    return res.json({ message: 'Successfully deleted!' });
  }).catch(function (e) {
    return next(e);
  });
};

var update = function update(req, res, next) {
  var body = req.body || {};

  _Shipping2.default.findByIdAndUpdate(req.params.id, body, { new: true }).exec().then(function (shipping) {
    return res.json({ message: 'Shipping updated!', data: shipping });
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