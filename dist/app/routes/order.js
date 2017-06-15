'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Order = require('../models/Order');

var _Order2 = _interopRequireDefault(_Order);

var _Customer = require('../models/Customer');

var _Customer2 = _interopRequireDefault(_Customer);

var _idValidator = require('../common/id-validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use('/:id', function (req, res, next) {
  if (!(0, _idValidator.isValid)(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The order was not found', status: 404 });
  }

  next();
});

router.route('/').get(function (req, res) {
  _Order2.default.find(function (err, orders) {
    if (err) return res.send(err);

    return res.json(orders);
  });
}).post(function (req, res) {
  var order = new _Order2.default();

  order.total = req.body.total;
  order.customer = req.body.customer;
  order.items = req.body.items;
  order.shipping = req.body.shipping;
  order.payment = req.body.payment;
  order.status = 0;

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
  }).then(function (result) {
    return res.json({ message: 'Order created!', data: order });
  }).catch(function (err) {
    return res.send(err);
  });
});

router.route('/:id').get(function (req, res) {
  _Order2.default.findById(req.params.id).populate('customer items.product shipping.value payment').exec(function (err, order) {
    if (err) return res.status(500).send(err);
    if (!order) return res.status(404).send({ data: null, message: 'The order was not found', status: 404 });

    return res.json(order);
  });
}).put(function (req, res) {

  var body = req.body || {};

  _Order2.default.findByIdAndUpdate(req.params.id, body, { new: true }).populate('customer items.product shipping.value payment').exec(function (err, order) {
    if (err) return res.send(err);

    if (!order.statusLog.find(function (log) {
      return log.status === body.status;
    }) && body.status !== null && typeof body.status != 'undefined') {
      order.statusLog.push({
        status: body.status
      });

      order.save(function (err) {
        if (err) return res.send(err);
      });
    }

    return res.json({ message: 'Order updated!', data: order });
  });
}).delete(function (req, res) {
  _Order2.default.remove({
    _id: req.params.id
  }, function (err, order) {
    if (err) return res.send(err);

    return res.json({ message: 'Successfully deleted!' });
  });
});

exports.default = router;