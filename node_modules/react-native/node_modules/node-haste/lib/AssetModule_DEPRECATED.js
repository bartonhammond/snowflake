'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Module = require('./Module');
var getAssetDataFromName = require('./lib/getAssetDataFromName');

var AssetModule_DEPRECATED = function (_Module) {
  _inherits(AssetModule_DEPRECATED, _Module);

  function AssetModule_DEPRECATED() {
    var _Object$getPrototypeO;

    _classCallCheck(this, AssetModule_DEPRECATED);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(AssetModule_DEPRECATED)).call.apply(_Object$getPrototypeO, [this].concat(args)));

    var _getAssetDataFromName = getAssetDataFromName(_this.path);

    var resolution = _getAssetDataFromName.resolution;
    var name = _getAssetDataFromName.name;

    _this.resolution = resolution;
    _this.name = name;
    return _this;
  }

  _createClass(AssetModule_DEPRECATED, [{
    key: 'isHaste',
    value: function isHaste() {
      return Promise.resolve(false);
    }
  }, {
    key: 'getName',
    value: function getName() {
      return Promise.resolve('image!' + this.name);
    }
  }, {
    key: 'getDependencies',
    value: function getDependencies() {
      return Promise.resolve([]);
    }
  }, {
    key: 'hash',
    value: function hash() {
      return 'AssetModule_DEPRECATED : ' + this.path;
    }
  }, {
    key: 'isJSON',
    value: function isJSON() {
      return false;
    }
  }, {
    key: 'isAsset_DEPRECATED',
    value: function isAsset_DEPRECATED() {
      return true;
    }
  }, {
    key: 'resolution',
    value: function resolution() {
      return getAssetDataFromName(this.path).resolution;
    }
  }]);

  return AssetModule_DEPRECATED;
}(Module);

module.exports = AssetModule_DEPRECATED;