'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Product = require('../models/Product');

var _Product2 = _interopRequireDefault(_Product);

var _Category = require('../models/Category');

var _Category2 = _interopRequireDefault(_Category);

var _idValidator = require('../common/id-validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use('/:id', function (req, res, next) {
  if (!(0, _idValidator.isValid)(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The product was not found', status: 404 });
  }

  next();
});

router.route('/search').get(function (req, res) {
  if (!req.param('query')) {
    return res.json([]);
  }

  _Product2.default.find({ name: new RegExp(req.query.query, 'i') }, function (err, products) {
    if (err) {
      return res.status(500).send(err);
    }

    return res.json(products);
  });
});

router.route('/').get(function (req, res) {
  _Product2.default.find(function (err, products) {
    if (err) return res.status(500).send(err);
    if (!products) return res.status(404).send({ data: null, message: 'No products found', status: 404 });

    res.json(products);
  });
}).post(function (req, res) {

  var product = new _Product2.default();
  product.name = req.body.name;
  product.category = req.body.category;
  product.description = req.body.description;
  product.image = req.body.image;
  product.price = req.body.price;

  product.save(function (err) {
    if (err) return res.send(err);

    var categoryId = req.body.category;
    // Get category
    if (categoryId !== null) {
      _Category2.default.findById(categoryId, function (err, category) {
        if (err) return res.send(err);

        category.products.push(product);

        category.save(function (err) {
          if (err) return res.send(err);

          res.json({ message: 'Product created!' });
        });
      });
    }
  });
});

router.route('/:id').get(function (req, res) {
  _Product2.default.findById(req.params.id).populate('category').exec(function (err, product) {
    if (err) return res.status(500).send(err);
    if (!product) return res.status(404).send({ data: null, message: 'The product was not found', status: 404 });

    res.json(product);
  });
}).put(function (req, res) {
  _Product2.default.findById(req.params.id, function (err, product) {
    if (err) return res.send(err);

    product.name = req.body.name;

    product.save(function (err) {
      if (err) return res.send(err);

      res.json({ message: 'Product updated!' });
    });
  });
}).delete(function (req, res) {
  _Product2.default.remove({
    _id: req.params.id
  }, function (err, product) {
    if (err) return res.send(err);

    res.json({ message: 'Successfully deleted!' });
  });
});

exports.default = router;