'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = undefined;

var _identity = require('ramda/src/identity');

var _identity2 = _interopRequireDefault(_identity);

var _map = require('ramda/src/map');

var _map2 = _interopRequireDefault(_map);

var _reduce = require('ramda/src/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _curry = require('ramda/src/curry');

var _curry2 = _interopRequireDefault(_curry);

var _filter = require('ramda/src/filter');

var _filter2 = _interopRequireDefault(_filter);

var _equals = require('ramda/src/equals');

var _equals2 = _interopRequireDefault(_equals);

var _all = require('ramda/src/all');

var _all2 = _interopRequireDefault(_all);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 *
 * @param {Function} successFn callback function in case of valid input
 * @param {Function} failFn callback function in case of invalid input
 * @param {Array} input
 * @returns {*}
 */
var transform = function transform(successFn, failFn, input) {
  var valid = (0, _all2.default)((0, _equals2.default)(true), input);
  return valid ? successFn() : failFn((0, _filter2.default)(function (a) {
    return a !== true;
  }, input));
};

/**
 *
 * @param {Function} predicate validation function to apply inputs on
 * @param {String|Function} errorMsg error message to return in case of fail
 * @param {*} value the actual value
 * @param {Object} inputs the input object - in case the predicate function needs access to dependent values
 * @returns {Boolean}
 */

var runPredicate = function runPredicate(_ref, value, inputs, globalInput, field) {
  var _ref2 = _slicedToArray(_ref, 2),
      predicate = _ref2[0],
      errorMsg = _ref2[1];

  return predicate(value, inputs, globalInput // eslint-disable-line no-nested-ternary
  ) ? true : typeof errorMsg === 'function' ? errorMsg(value, field) : errorMsg;
};

/**
 *
 * @param {Function} successFn callback function in case of valid input
 * @param {Function} failFn callback function in case of invalid input
 * @param {Object} spec the rule object
 * @param {Object|Function} input the validation input data
 * @returns {{}}
 */
var validate = exports.validate = (0, _curry2.default)(function (successFn, failFn, spec, input) {
  var initialInput = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

  var inputFn = typeof input === 'function' ? input : function (key) {
    return key ? input : input;
  };
  var globalInput = initialInput || input;
  var keys = Object.keys(inputFn());
  return (0, _reduce2.default)(function (result, key) {
    var inputObj = inputFn(key);
    var value = inputObj[key];
    var predicates = spec[key];
    if (Array.isArray(predicates)) {
      return _extends({}, result, _defineProperty({}, key, transform(function () {
        return successFn(value);
      }, failFn, (0, _map2.default)(function (f) {
        return runPredicate(f, value, inputObj, globalInput, key);
      }, predicates))));
    } else if ((typeof predicates === 'undefined' ? 'undefined' : _typeof(predicates)) === 'object') {
      return _extends({}, result, _defineProperty({}, key, validate(successFn, failFn, predicates, value, globalInput)));
    } else if (typeof predicates === 'function') {
      var rules = predicates(value);
      return _extends({}, result, _defineProperty({}, key, validate(successFn, failFn, rules, value, globalInput)));
    } else {
      return _extends({}, result, _defineProperty({}, key, successFn([])));
    }
  }, {}, keys);
}

/**
 *
 * @param {Object} spec the rule object
 * @param {Object} input the validation input data
 * @returns {{}}
 */
);var spected = validate(function () {
  return true;
}, _identity2.default);

exports.default = spected;