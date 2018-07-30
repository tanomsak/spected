"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = warning;

/* eslint-disable no-console */

/**
 *
 * @param {String} message
 */
function warning(message) {
  if (console && console.warn) {
    console.warn(message);
  }
}