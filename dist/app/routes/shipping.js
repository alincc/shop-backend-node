'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Shipping = require('../models/Shipping');

var _Shipping2 = _interopRequireDefault(_Shipping);

var _idValidator = require('../common/id-validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use('/:id', function (req, res, next) {
  if (!(0, _idValidator.isValid)(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The shipping was not found', status: 404 });
  }

  next();
});

router.route('/').get(function (req, res) {
  _Shipping2.default.find(function (err, shipping) {
    if (err) return res.send(err);

    res.json(shipping);
  });
}).post(function (req, res) {
  var shipping = new _Shipping2.default();

  shipping.name = req.body.name;
  shipping.price = req.body.price;
  shipping.description = req.body.description;

  shipping.save(function (err) {
    if (err) return res.send(err);

    res.json({ message: 'Shipping created!', data: shipping });
  });
});

router.route('/:id').get(function (req, res) {
  _Shipping2.default.findById(req.params.id, function (err, shipping) {
    if (err) return res.status(500).send(err);
    if (!shipping) return res.status(404).send({ data: null, message: 'The shipping was not found', status: 404 });

    res.json(shipping);
  });
}).put(function (req, res) {
  _Shipping2.default.findById(req.params.id, function (err, shipping) {
    if (err) return res.send(err);

    shipping.name = req.body.name;
    shipping.price = req.body.price;
    shipping.description = req.body.description;

    shipping.save(function (err) {
      if (err) return res.send(err);

      res.json({ message: 'Shipping updated!', data: shipping });
    });
  });
}).delete(function (req, res) {
  _Shipping2.default.remove({
    _id: req.params.id
  }, function (err, shipping) {
    if (err) return res.send(err);

    res.json({ message: 'Successfully deleted!' });
  });
});

exports.default = router;