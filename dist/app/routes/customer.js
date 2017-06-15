'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Customer = require('../models/Customer');

var _Customer2 = _interopRequireDefault(_Customer);

var _idValidator = require('../common/id-validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use('/:id', function (req, res, next) {
  if (!(0, _idValidator.isValid)(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The customer was not found', status: 404 });
  }

  next();
});

router.route('/').get(function (req, res) {
  _Customer2.default.find(function (err, customers) {
    if (err) return res.send(err);

    res.json(customers);
  });
}).post(function (req, res) {
  var customer = new _Customer2.default();

  customer.firstname = req.body.firstname;
  customer.lastname = req.body.lastname;
  customer.address = req.body.address;
  customer.postnumber = req.body.postnumber;
  customer.country = req.body.country;
  customer.phone = req.body.phone;
  customer.email = req.body.email;
  customer.note = req.body.note;

  customer.save(function (err) {
    if (err) return res.send(err);

    res.json({ message: 'Customer created!', data: customer });
  });
});

router.route('/:id').get(function (req, res) {
  _Customer2.default.findById(req.params.id)
  // .populate('orders orders.payment')
  .populate({
    path: 'orders',
    model: 'Order',
    populate: {
      path: 'payment',
      model: 'Payment'
    }
  }).exec(function (err, customer) {
    if (err) return res.status(500).send(err);
    if (!customer) return res.status(404).send({ data: null, message: 'The customer was not found', status: 404 });

    res.json(customer);
  });
}).put(function (req, res) {
  var body = req.body || {};

  _Customer2.default.findByIdAndUpdate(req.params.id, body, { new: true }, function (err, customer) {
    if (err) return res.send(err);

    customer.populate({
      path: 'orders',
      model: 'Order',
      populate: {
        path: 'payment',
        model: 'Payment'
      }
    }, function (err, customer) {
      if (err) return res.send(err);

      res.json({ message: 'Customer updated!', data: customer });
    });
  });
}).delete(function (req, res) {
  _Customer2.default.remove({
    _id: req.params.id
  }, function (err, customer) {
    if (err) return res.send(err);

    res.json({ message: 'Successfully deleted!' });
  });
});

exports.default = router;