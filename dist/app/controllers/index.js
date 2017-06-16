'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _categoryController = require('./category.controller.js');

Object.defineProperty(exports, 'categoryCtrl', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_categoryController).default;
  }
});

var _customerController = require('./customer.controller.js');

Object.defineProperty(exports, 'customerCtrl', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_customerController).default;
  }
});

var _shippingController = require('./shipping.controller.js');

Object.defineProperty(exports, 'shippingCtrl', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_shippingController).default;
  }
});

var _orderController = require('./order.controller.js');

Object.defineProperty(exports, 'orderCtrl', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_orderController).default;
  }
});

var _paymentController = require('./payment.controller.js');

Object.defineProperty(exports, 'paymentCtrl', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_paymentController).default;
  }
});

var _userController = require('./user.controller.js');

Object.defineProperty(exports, 'userCtrl', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_userController).default;
  }
});

var _productController = require('./product.controller.js');

Object.defineProperty(exports, 'productCtrl', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_productController).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }