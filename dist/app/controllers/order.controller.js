'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Order = require('../models/Order');

var _Order2 = _interopRequireDefault(_Order);

var _Customer = require('../models/Customer');

var _Customer2 = _interopRequireDefault(_Customer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var load = function load(req, res, next, id) {
  _Order2.default.get(id).then(function (order) {
    req.order = order;
    return next();
  }).catch(function (e) {
    return next(e);
  });
};

var create = function create(req, res, next) {
  var order = new _Order2.default({
    total: req.body.total,
    customer: req.body.customer,
    items: req.body.items,
    shipping: req.body.shipping,
    payment: req.body.payment,
    shippingAddress: req.body.shippingAddress,
    status: 0
  });

  order.statusLog.push({ status: 0 });

  order.save().then(function (order) {
    return _Customer2.default.findById(order.customer).exec().then(function (customer) {
      return [order, customer];
    });
  }).then(function (result) {
    var order = result[0];
    var customer = result[1];

    customer.orders.push(order);

    return customer.save().then(function (customer) {
      return [order, customer];
    });
  }).then(function () {
    return res.json({ message: 'Order created!', data: order });
  }).catch(function (e) {
    return next(e);
  });
};

var list = function list(req, res, next) {
  _Order2.default.list().then(function (order) {
    return res.json(order);
  }).catch(function (e) {
    return next(e);
  });
};

var get = function get(req, res) {
  return res.json(req.order);
};

var remove = function remove(req, res, next) {
  var order = req.order;

  order.remove().then(function () {
    return res.json({ message: 'Successfully deleted!' });
  }).catch(function (e) {
    return next(e);
  });
};

var update = function update(req, res, next) {
  var body = req.body || {};

  _Order2.default.findOneAndUpdate({ _id: req.params.id }, body, { new: true }).populate('customer items.product shipping.value payment').exec().then(function (order) {
    if (!order.statusLog.find(function (log) {
      return log.status === body.status;
    }) && body.status !== null && typeof body.status !== 'undefined') {
      order.statusLog.push({
        status: body.status
      });

      return order.save();
    }

    return order;
  }).then(function (order) {
    return res.json({ message: 'Order updated!', data: order });
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