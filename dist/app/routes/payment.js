'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Payment = require('../models/Payment');

var _Payment2 = _interopRequireDefault(_Payment);

var _idValidator = require('../common/id-validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use('/:id', function (req, res, next) {
  if (!(0, _idValidator.isValid)(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The payment was not found', status: 404 });
  }

  next();
});

router.route('/').get(function (req, res) {
  _Payment2.default.find(function (err, payments) {
    if (err) return res.send(err);

    return res.json(payments);
  });
}).post(function (req, res) {
  var payment = new _Payment2.default();

  payment.name = req.body.name;
  payment.image = req.body.image;

  payment.save().then(function (payment) {

    return res.json({ message: 'Payment created!', data: payment });
  }).catch(function (err) {
    return res.send(err);
  });
});

router.route('/:id').get(function (req, res) {
  _Payment2.default.findById(req.params.id).exec(function (err, payment) {
    if (err) return res.status(500).send(err);
    if (!payment) return res.status(404).send({ data: null, message: 'The payment was not found', status: 404 });

    return res.json(payment);
  });
}).put(function (req, res) {
  _Payment2.default.findById(req.params.id, function (err, payment) {
    if (err) return res.send(err);

    payment.name = req.body.name;
    payment.image = req.body.image;

    payment.save(function (err) {
      if (err) return res.send(err);

      return res.json({ message: 'Payment updated!' });
    });
  });
}).delete(function (req, res) {
  _Payment2.default.remove({
    _id: req.params.id
  }, function (err, payment) {
    if (err) return res.send(err);

    return res.json({ message: 'Successfully deleted!' });
  });
});

exports.default = router;