'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Module = require('./Module');

var Polyfill = function (_Module) {
  _inherits(Polyfill, _Module);

  function Polyfill(options) {
    _classCallCheck(this, Polyfill);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Polyfill).call(this, options));

    _this._id = options.id;
    _this._dependencies = options.dependencies;
    return _this;
  }

  _createClass(Polyfill, [{
    key: 'isHaste',
    value: function isHaste() {
      return Promise.resolve(false);
    }
  }, {
    key: 'getName',
    value: function getName() {
      return Promise.resolve(this._id);
    }
  }, {
    key: 'getPackage',
    value: function getPackage() {
      return null;
    }
  }, {
    key: 'getDependencies',
    value: function getDependencies() {
      return Promise.resolve(this._dependencies);
    }
  }, {
    key: 'isJSON',
    value: function isJSON() {
      return false;
    }
  }, {
    key: 'isPolyfill',
    value: function isPolyfill() {
      return true;
    }
  }]);

  return Polyfill;
}(Module);

module.exports = Polyfill;