'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Payment = require('../models/Payment');

var _Payment2 = _interopRequireDefault(_Payment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var load = function load(req, res, next, id) {
  _Payment2.default.get(id).then(function (payment) {
    req.payment = payment;
    return next();
  }).catch(function (e) {
    return next(e);
  });
};

var create = function create(req, res, next) {
  var payment = new _Payment2.default({
    name: req.body.name,
    image: req.body.image
  });

  payment.save().then(function (payment) {
    return res.json({ message: 'Payment created!', data: payment });
  }).catch(function (e) {
    return next(e);
  });
};

var list = function list(req, res, next) {
  _Payment2.default.list().then(function (payment) {
    return res.json(payment);
  }).catch(function (e) {
    return next(e);
  });
};

var get = function get(req, res) {
  return res.json(req.payment);
};

var remove = function remove(req, res, next) {
  var payment = req.payment;

  payment.remove().then(function () {
    return res.json({ message: 'Successfully deleted!' });
  }).catch(function (e) {
    return next(e);
  });
};

var update = function update(req, res, next) {
  var body = req.body || {};

  _Payment2.default.findByIdAndUpdate(req.params.id, body, { new: true }).exec().then(function (payment) {
    return res.json({ message: 'Payment updated!', data: payment });
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