'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _order = require('./order');

var _order2 = _interopRequireDefault(_order);

var _product = require('./product');

var _product2 = _interopRequireDefault(_product);

var _category = require('./category');

var _category2 = _interopRequireDefault(_category);

var _customer = require('./customer');

var _customer2 = _interopRequireDefault(_customer);

var _shipping = require('./shipping');

var _shipping2 = _interopRequireDefault(_shipping);

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

var _payment = require('./payment');

var _payment2 = _interopRequireDefault(_payment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use('/user', _user2.default);
router.use('/order', _order2.default);
router.use('/product', _product2.default);
router.use('/category', _category2.default);
router.use('/customer', _customer2.default);
router.use('/shipping', _shipping2.default);
router.use('/auth', _auth2.default);
router.use('/payment', _payment2.default);

exports.default = router;