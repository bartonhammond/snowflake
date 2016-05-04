'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Module = require('./Module');
var getAssetDataFromName = require('./lib/getAssetDataFromName');

var AssetModule = function (_Module) {
  _inherits(AssetModule, _Module);

  function AssetModule(args) {
    _classCallCheck(this, AssetModule);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AssetModule).call(this, args));

    var _getAssetDataFromName = getAssetDataFromName(_this.path);

    var resolution = _getAssetDataFromName.resolution;
    var name = _getAssetDataFromName.name;
    var type = _getAssetDataFromName.type;

    _this.resolution = resolution;
    _this._name = name;
    _this._type = type;
    _this._dependencies = args.dependencies || [];
    return _this;
  }

  _createClass(AssetModule, [{
    key: 'isHaste',
    value: function isHaste() {
      return Promise.resolve(false);
    }
  }, {
    key: 'getDependencies',
    value: function getDependencies() {
      return Promise.resolve(this._dependencies);
    }
  }, {
    key: 'read',
    value: function read() {
      return Promise.resolve({});
    }
  }, {
    key: 'getName',
    value: function getName() {
      var _this2 = this;

      return _get(Object.getPrototypeOf(AssetModule.prototype), 'getName', this).call(this).then(function (id) {
        return id.replace(/\/[^\/]+$/, '/' + _this2._name + '.' + _this2._type);
      });
    }
  }, {
    key: 'hash',
    value: function hash() {
      return 'AssetModule : ' + this.path;
    }
  }, {
    key: 'isJSON',
    value: function isJSON() {
      return false;
    }
  }, {
    key: 'isAsset',
    value: function isAsset() {
      return true;
    }
  }]);

  return AssetModule;
}(Module);

module.exports = AssetModule;