'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Customer = require('../models/Customer');

var _Customer2 = _interopRequireDefault(_Customer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var load = function load(req, res, next, id) {
  _Customer2.default.get(id).then(function (customer) {
    req.customer = customer;
    return next();
  }).catch(function (e) {
    return next(e);
  });
};

var create = function create(req, res, next) {
  var customer = new _Customer2.default({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    address: req.body.address,
    postnumber: req.body.postnumber,
    country: req.body.country,
    phone: req.body.phone,
    email: req.body.email,
    note: req.body.note
  });

  customer.save().then(function (customer) {
    return res.json({ message: 'Customer created!', data: customer });
  }).catch(function (e) {
    return next(e);
  });
};

var list = function list(req, res, next) {
  _Customer2.default.list().then(function (customer) {
    return res.json(customer);
  }).catch(function (e) {
    return next(e);
  });
};

var get = function get(req, res) {
  return res.json(req.customer);
};

var remove = function remove(req, res, next) {
  var customer = req.customer;

  customer.remove().then(function () {
    return res.json({ message: 'Successfully deleted!' });
  }).catch(function (e) {
    return next(e);
  });
};

var update = function update(req, res, next) {
  var body = req.body || {};

  _Customer2.default.findByIdAndUpdate(req.params.id, body, { new: true }).populate({
    path: 'orders',
    model: 'Order',
    populate: {
      path: 'payment',
      model: 'Payment'
    }
  }).exec().then(function (customer) {
    return res.json({ message: 'Customer updated!', data: customer });
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