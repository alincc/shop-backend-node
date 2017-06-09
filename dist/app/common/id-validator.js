'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValid = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isValid = exports.isValid = function isValid(id) {
  return _mongoose2.default.Types.ObjectId.isValid(id);
};