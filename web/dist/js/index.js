(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":8}],2:[function(require,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],3:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  value = Object(value);
  return (symToStringTag && symToStringTag in value)
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":1,"./_getRawTag":6,"./_objectToString":7}],4:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    arrayMap = require('./_arrayMap'),
    isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

},{"./_Symbol":1,"./_arrayMap":2,"./isArray":9,"./isSymbol":11}],5:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],6:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":1}],7:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],8:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":5}],9:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],10:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],11:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;

},{"./_baseGetTag":3,"./isObjectLike":10}],12:[function(require,module,exports){
var baseToString = require('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

},{"./_baseToString":4}],13:[function(require,module,exports){
var toString = require('./toString');

/** Used to generate unique IDs. */
var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString(prefix) + id;
}

module.exports = uniqueId;

},{"./toString":12}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Scene = require('./Scene.js');

var _Scene2 = _interopRequireDefault(_Scene);

var _Renderer = require('./Renderer.js');

var _Renderer2 = _interopRequireDefault(_Renderer);

var _Map = require('./Map/Map.js');

var _Map2 = _interopRequireDefault(_Map);

var _Game = require('./Game.js');

var _Game2 = _interopRequireDefault(_Game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.THREE = THREE;

/**
 * @type {Bootstrap}
 */
var instance = null;

/**
 * @class Bootstrap
 */

var Bootstrap = function () {
    /**
     * @returns {Bootstrap}
     */
    function Bootstrap() {
        _classCallCheck(this, Bootstrap);

        if (!instance) {
            console.debug('Booting…');
            instance = this;

            this.initialize();
        }

        return instance;
    }

    /**
     */


    _createClass(Bootstrap, [{
        key: 'initialize',
        value: function initialize() {
            window.onload = this.onLoad.bind(this);
        }

        /**
         * on window laoded
         */

    }, {
        key: 'onLoad',
        value: function onLoad() {
            this.scene = _Scene2.default;
            _Renderer2.default.addAxis();

            this.map = _Map2.default;
            this.map.createTerrain(this.onMapLoaded);
        }
    }, {
        key: 'onMapLoaded',
        value: function onMapLoaded() {
            _Game2.default.start();
        }
    }]);

    return Bootstrap;
}();

exports.default = Bootstrap;

},{"./Game.js":16,"./Map/Map.js":17,"./Renderer.js":23,"./Scene.js":24}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Scene = require('./Scene.js');

var _Scene2 = _interopRequireDefault(_Scene);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @type {Symbol}
 */
var singleton = Symbol();

/**
 * @type {Symbol}
 */
var singletonEnforcer = Symbol();

/**
 * @class Camera
 * @deprecated
 *
 * TODO: move camera to player
 */

var Camera = function () {
  function Camera(enforcer) {
    _classCallCheck(this, Camera);

    if (enforcer != singletonEnforcer) throw "Cannot construct singleton Camera";

    /**
     * @type {THREE.PerspectiveCamera}
     * @private
     */
    this._camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 1000);
  }

  /**
   * @returns {Camera}
   */


  _createClass(Camera, [{
    key: 'update',
    value: function update() {}

    /**
     * @returns {THREE.PerspectiveCamera}
     */

  }, {
    key: 'camera',
    get: function get() {
      return this._camera;
    }
  }], [{
    key: 'instance',
    get: function get() {
      if (!this[singleton]) {
        this[singleton] = new Camera(singletonEnforcer);
      }

      return this[singleton];
    }
  }]);

  return Camera;
}();

exports.default = Camera.instance;

},{"./Scene.js":24}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Scene = require('./Scene.js');

var _Scene2 = _interopRequireDefault(_Scene);

var _Renderer = require('./Renderer.js');

var _Renderer2 = _interopRequireDefault(_Renderer);

var _Camera = require('./Camera.js');

var _Camera2 = _interopRequireDefault(_Camera);

var _Player = require('./Player/Player.js');

var _Player2 = _interopRequireDefault(_Player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @type {Symbol}
 */
var singleton = Symbol();

/**
 * @type {Symbol}
 */
var singletonEnforcer = Symbol();

/**
 * Scene of the Game.
 * Created with PhysiJS
 *
 * @class Scene
 */

var Game = function () {
  function Game(enforcer) {
    _classCallCheck(this, Game);

    if (enforcer != singletonEnforcer) throw "Cannot construct singleton Game";
  }

  /**
   * @returns {Game}
   */


  _createClass(Game, [{
    key: 'start',


    /**
     * Start Game means initialize player, objects,….
     */
    value: function start() {
      this.clock = new THREE.Clock();
      this.render();
      _Player2.default.initialize();
    }

    /**
     * Render Map
     */

  }, {
    key: 'render',
    value: function render() {
      var delta = this.clock.getDelta();

      _Camera2.default.update(); // update camera
      _Scene2.default.scene.simulate(); // update physics
      _Player2.default.update(delta);

      requestAnimationFrame(this.render.bind(this));
      _Renderer2.default.render(); // render map
    }
  }], [{
    key: 'instance',
    get: function get() {
      if (!this[singleton]) {
        this[singleton] = new Game(singletonEnforcer);
      }

      return this[singleton];
    }
  }]);

  return Game;
}();

exports.default = Game.instance;

},{"./Camera.js":15,"./Player/Player.js":21,"./Renderer.js":23,"./Scene.js":24}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Scene = require('./../Scene.js');

var _Scene2 = _interopRequireDefault(_Scene);

var _Camera = require('./../Camera.js');

var _Camera2 = _interopRequireDefault(_Camera);

var _TerrainGeometry = require('./TerrainGeometry.js');

var _TerrainGeometry2 = _interopRequireDefault(_TerrainGeometry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @type {Symbol}
 */
var singleton = Symbol();

/**
 * @type {Symbol}
 */
var singletonEnforcer = Symbol();

/**
 * @class Map
 */

var Map = function () {
    function Map(enforcer) {
        _classCallCheck(this, Map);

        if (enforcer != singletonEnforcer) throw 'Cannot construct singleton Map';

        /**
         * @type {THREE.TerrainGeometry}
         * @private
         */
        this._terrain = null;
    }

    /**
     * @returns {Map}
     */


    _createClass(Map, [{
        key: 'createTerrain',


        /**
         * Create Terrain.
         */
        value: function createTerrain(onMapLoaded) {
            this.onMapLoaded = onMapLoaded;
            this.initTerrain();
        }

        /**
         * Initialize TerrainGeometry.
         */

    }, {
        key: 'initTerrain',
        value: function initTerrain() {
            this.terrrainGeometry = new _TerrainGeometry2.default({
                map: 'map-2'
            });
            var groundGeometryLoader = this.terrrainGeometry.createGeometry();

            groundGeometryLoader.then(this.onGeometryGenerated.bind(this));
        }

        /**
         * Called after TerrainGeometry is ready.
         */

    }, {
        key: 'onGeometryGenerated',
        value: function onGeometryGenerated() {
            var groundMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({
                wireframe: true
            }), .8, // high friction
            .4 // low restitution
            );

            var ground = new Physijs.HeightfieldMesh(this.terrrainGeometry.groundGeometry, groundMaterial, 0, // mass
            this.terrrainGeometry.mapWidth - 1, this.terrrainGeometry.mapLength - 1);
            ground.rotation.x = Math.PI / -2;
            ground.receiveShadow = true;
            ground.name = 'Ground';

            _Scene2.default.scene.add(ground);

            this.onMapLoaded.call(null);
        }

        /**
         * @returns {THREE.Mesh}
         */

    }, {
        key: 'terrain',
        get: function get() {
            return this._terrain;
        }
    }], [{
        key: 'instance',
        get: function get() {
            if (!this[singleton]) {
                this[singleton] = new Map(singletonEnforcer);
            }

            return this[singleton];
        }
    }]);

    return Map;
}();

exports.default = Map.instance;

},{"./../Camera.js":15,"./../Scene.js":24,"./TerrainGeometry.js":18}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('./../constants.js');

var _WorkerManagerService = require('./../Services/WorkerManagerService.js');

var _WorkerManagerService2 = _interopRequireDefault(_WorkerManagerService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Creates TerrainGeometry.
 */
var TerrainGeometry = function () {
    function TerrainGeometry(config) {
        _classCallCheck(this, TerrainGeometry);

        /**
         * @type object
         */
        this.config = config;

        /**
         * @type {THREE.PlaneGeometry}
         * @private
         */
        this._groundGeometry = null;

        /**
         * @type {number}
         * @private
         */
        this._mapWidth = 0;

        /**
         * @type {number}
         * @private
         */
        this._mapLength = 0;

        /**
         * @type {WorkerClass}
         */
        this.mapWorker = _WorkerManagerService2.default.getWorker('map');

        return this.promise;
    }

    /**
     * Create Geometry for Terrain.
     *
     * @returns {Promise}
     */


    _createClass(TerrainGeometry, [{
        key: 'createGeometry',
        value: function createGeometry() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                _this.terrainHeight = THREE.ImageUtils.loadTexture('/assets/maps/' + _this.config.map + '/heightdata.png', undefined, _this.onTerrainHeightmapLoaded.bind(_this, resolve, reject));
            });
        }

        /**
         * Called after heihtfield-image is loaded and generates the vertices.
         *
         * @param {Promise.resolve} resolve
         * @param {Promise.reject} reject
         */

    }, {
        key: 'onTerrainHeightmapLoaded',
        value: function onTerrainHeightmapLoaded(resolve, reject) {
            var _this2 = this;

            var heightData = this.getHeightImageData().data;
            var groundGeometry = new THREE.PlaneGeometry(this.mapWidth, this.mapLength, this.mapWidth - 1, this.mapLength - 1);

            this.mapWorker.post({
                vertices: groundGeometry.vertices,
                heightData: heightData
            }).then(function (event) {
                if (!_constants.DEBUG.flatMap) {
                    groundGeometry.vertices = event.vertices;
                }

                groundGeometry.computeFaceNormals();
                groundGeometry.computeVertexNormals();

                _this2.groundGeometry = groundGeometry;

                resolve();
            });
        }

        /**
         * Append Heightfield image to dom.
         *
         * @returns {ImageData}
         */

    }, {
        key: 'getHeightImageData',
        value: function getHeightImageData() {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            this.mapWidth = this.terrainHeight.image.width;
            this.mapLength = this.terrainHeight.image.height;

            canvas.width = this.mapWidth;
            canvas.height = this.mapLength;

            context.drawImage(this.terrainHeight.image, 0, 0);

            return context.getImageData(0, 0, this.mapWidth, this.mapLength);
        }

        /**
         * @param {THREE.PlaneGeometry} groundGeometry
         */

    }, {
        key: 'groundGeometry',
        set: function set(groundGeometry) {
            this._groundGeometry = groundGeometry;
        }

        /**
         * @returns {THREE.PlaneGeometry}
         */
        ,
        get: function get() {
            return this._groundGeometry;
        }

        /**
         * @param {int} width
         */

    }, {
        key: 'mapWidth',
        set: function set(width) {
            this._mapWidth = width;
        }

        /**
         * @returns {int}
         */
        ,
        get: function get() {
            return this._mapWidth;
        }

        /**
         * @param {int} length
         */

    }, {
        key: 'mapLength',
        set: function set(length) {
            this._mapLength = length;
        }

        /**
         * @returns {int}
         */
        ,
        get: function get() {
            return this._mapLength;
        }
    }]);

    return TerrainGeometry;
}();

exports.default = TerrainGeometry;

},{"./../Services/WorkerManagerService.js":25,"./../constants.js":26}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uniqueId = require('lodash/uniqueId');

var _uniqueId2 = _interopRequireDefault(_uniqueId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ONE_TYPE = 'one';
var ON_TYPE = 'on';

/**
 * Register a new Worker.
 */

var WorkerClass = function () {
    function WorkerClass(key, options) {
        _classCallCheck(this, WorkerClass);

        /**
         * @type {String}
         */
        this.key = key;

        /**
         * @type {String}
         */
        this.fileName = options.fileName || '{this.key}.js';

        /**
         * @type {String}
         */
        this.url = '/dist/worker/' + this.fileName;

        /**
         * @type {Array}
         */
        this.handler = [];

        /**
         * @type {Worker}
         */
        this.worker = new Worker(this.url);

        this.messageHandler();
    }

    /**
     * Listen for message and call registerd callbacks.
     */


    _createClass(WorkerClass, [{
        key: 'messageHandler',
        value: function messageHandler() {
            var _this = this;

            this.worker.addEventListener('message', function (event) {
                var eventKey = event.data.eventKey;

                _this.handler[eventKey].forEach(function (data, key) {
                    // Remove event handler if bin it only once.
                    if (ONE_TYPE === data.type) {
                        delete _this.handler[eventKey][key];
                    }

                    data.cb.call(null, event.data.data);
                });
            });
        }

        /**
         * Will remove listener after first call.
         *
         * @param {String} eventName
         * @param {Function} cb
         */

    }, {
        key: 'one',
        value: function one(eventName, cb) {
            this.listen(eventName, cb, ONE_TYPE);
        }

        /**
         * Register a allway open event listener.
         *
         * @param {String} eventName
         * @param {Function} cb
         */

    }, {
        key: 'on',
        value: function on(eventName, cb) {
            this.listen(eventName, cb, ON_TYPE);
        }

        /**
         * Register event listener.
         * @param eventName
         * @param cb
         * @param type
         */

    }, {
        key: 'listen',
        value: function listen(eventName, cb, type) {
            if (!this.handler[eventName]) {
                this.handler[eventName] = [];
            }

            this.handler[eventName].push({
                cb: cb,
                type: type
            });
        }

        /**
         *
         * @param args
         * @returns {Promise}
         */

    }, {
        key: 'post',
        value: function post() {
            var _this2 = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return new Promise(function (resolve) {
                var eventKey = (0, _uniqueId2.default)(_this2.key);
                _this2.worker.postMessage([eventKey].concat(args));

                _this2.one(eventKey, resolve);
            });
        }
    }]);

    return WorkerClass;
}();

exports.default = WorkerClass;

},{"lodash/uniqueId":13}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);

        this.mouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;

        this.walkActions = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };

        this.bindEvents();
    }

    _createClass(_class, [{
        key: 'bindEvents',
        value: function bindEvents() {
            window.addEventListener('keydown', this.onKeyDown.bind(this));
            window.addEventListener('keyup', this.onKeyUp.bind(this));
            window.addEventListener('mousemove', this.onMouseMove.bind(this));
            window.addEventListener('mousedown', this.onMouseDown.bind(this));
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown(event) {
            event.preventDefault();

            this.mouseDown = true;
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        }
    }, {
        key: 'onMouseMove',
        value: function onMouseMove(event) {
            if (!this.mouseDown) {
                return;
            }

            event.preventDefault();

            var deltaX = event.clientX - this.mouseX;
            var deltaY = event.clientY - this.mouseY;
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;

            this.rotate(deltaX, deltaY);
        }
    }, {
        key: 'onKeyDown',
        value: function onKeyDown(event) {
            var methodName = 'on' + event.code + 'Down';
            var handler = this[methodName];

            if (handler) {
                handler.call(this);
            }
        }
    }, {
        key: 'onKeyUp',
        value: function onKeyUp(event) {
            var methodName = 'on' + event.code + 'Up';
            var handler = this[methodName];

            if (handler) {
                handler.call(this);
            }
        }
    }, {
        key: 'onKeyWDown',
        value: function onKeyWDown() {
            this.walkActions.forward = true;
        }
    }, {
        key: 'onKeyWUp',
        value: function onKeyWUp() {
            this.walkActions.forward = false;
        }
    }, {
        key: 'onKeySDown',
        value: function onKeySDown() {
            this.walkActions.backward = true;
        }
    }, {
        key: 'onKeySUp',
        value: function onKeySUp() {
            this.walkActions.backward = false;
        }
    }, {
        key: 'onKeyADown',
        value: function onKeyADown() {
            this.walkActions.left = true;
        }
    }, {
        key: 'onKeyAUp',
        value: function onKeyAUp() {
            this.walkActions.left = false;
        }
    }, {
        key: 'onKeyDDown',
        value: function onKeyDDown() {
            this.walkActions.right = true;
        }
    }, {
        key: 'onKeyDUp',
        value: function onKeyDUp() {
            this.walkActions.right = false;
        }
    }]);

    return _class;
}();

exports.default = _class;

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Scene = require('./../Scene.js');

var _Scene2 = _interopRequireDefault(_Scene);

var _Camera = require('./../Camera.js');

var _Camera2 = _interopRequireDefault(_Camera);

var _Map = require('./../Map/Map.js');

var _Map2 = _interopRequireDefault(_Map);

var _PointerLockControls = require('./PointerLockControls.js');

var _PointerLockControls2 = _interopRequireDefault(_PointerLockControls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @type {Symbol}
 */
var singleton = Symbol();

/**
 * @type {Symbol}
 */
var singletonEnforcer = Symbol();

var time = Date.now();

/**
 * @class Player
 */

var Player = function () {
    function Player(enforcer) {
        _classCallCheck(this, Player);

        if (enforcer != singletonEnforcer) throw "Cannot construct singleton Player";

        /**
         * @type {PointerLockControls}
         */
        this.controls = null;

        /**
         * @type {Physijs.BoxMesh}
         *
         * @private
         */
        this._player = null;
    }

    /**
     * @returns {Camera}
     */


    _createClass(Player, [{
        key: 'initialize',


        /**
         * Initialize Player.
         */
        value: function initialize() {
            this.appendPlayer();
            this.initControls();
        }

        /**
         * Append player object to scene.
         */

    }, {
        key: 'appendPlayer',
        value: function appendPlayer() {
            console.debug('Generate Player…');

            var material = Physijs.createMaterial(new THREE.MeshBasicMaterial({
                color: 0xff0000
            }), 1, 0.3);
            this.player = new Physijs.BoxMesh(new THREE.CubeGeometry(1, 1, 1), material);

            this.player.__dirtyRotation = true;
            this.player.position.set(10, 10, 0);
            this.player.setLinearVelocity(new THREE.Vector3(0, 0, 0));
            this.player.setAngularVelocity(new THREE.Vector3(0, 0, 0));
            this.player.name = 'player';
            _Scene2.default.scene.add(this.player);
        }

        /**
         * Initialize PointerLockControls.
         */

    }, {
        key: 'initControls',
        value: function initControls() {
            this.controls = new _PointerLockControls2.default(_Camera2.default.camera, this.player);
        }

        /**
         * Update loop for player.
         *
         * @param {Float} delta
         */

    }, {
        key: 'update',
        value: function update(delta) {
            // update player
            if (this.controls) {
                this.controls.update(delta);
            }
        }

        /**
         * @returns {Physijs.BoxMesh}
         */

    }, {
        key: 'player',
        get: function get() {
            return this._player;
        }

        /**
         * @param {Physijs.BoxMesh} value
         */
        ,
        set: function set(value) {
            this._player = value;
        }
    }], [{
        key: 'instance',
        get: function get() {
            if (!this[singleton]) {
                this[singleton] = new Player(singletonEnforcer);
            }

            return this[singleton];
        }
    }]);

    return Player;
}();

exports.default = Player.instance;

},{"./../Camera.js":15,"./../Map/Map.js":17,"./../Scene.js":24,"./PointerLockControls.js":22}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ControlsKeyMapper2 = require('./ControlsKeyMapper.js');

var _ControlsKeyMapper3 = _interopRequireDefault(_ControlsKeyMapper2);

var _constants = require('./../constants.js');

var _Camera = require('./../Camera.js');

var _Camera2 = _interopRequireDefault(_Camera);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Control for Player.
 */
var PointerLockControls = function (_ControlsKeyMapper) {
    _inherits(PointerLockControls, _ControlsKeyMapper);

    function PointerLockControls(camera, player) {
        _classCallCheck(this, PointerLockControls);

        var _this = _possibleConstructorReturn(this, (PointerLockControls.__proto__ || Object.getPrototypeOf(PointerLockControls)).call(this));

        _this.player = player;
        _this.velocity = new THREE.Vector3(0, 0, 0);
        _this.v0 = new THREE.Vector3(0, 0, 0);
        _this.v1 = new THREE.Vector3(0, 0, 0);
        /*player.setLinearFactor(new THREE.Vector3(0,0,0));*/
        _this.player.setAngularFactor(new THREE.Vector3(0, 0, 0));

        if (_constants.DEBUG.player) {
            // Debug Player player is visible from top.
            camera.position.set(0, 30, 30);
            camera.lookAt(_this.player.position);
        } else {
            camera.position.set(0, 0, 0);
            _this.player.add(camera);
        }

        _this.bindEvents();
        return _this;
    }

    /**
     * Rotate Player.
     * TODO: Implement show up and down.
     *
     * @param deltaX
     * @param deltaY
     */


    _createClass(PointerLockControls, [{
        key: 'rotate',
        value: function rotate(deltaX, deltaY) {
            _Camera2.default.camera.rotation.x -= deltaY / _constants.PLAYER.lookSpeed;
            this.player.rotation.y -= deltaX / _constants.PLAYER.lookSpeed;

            if (_Camera2.default.camera.rotation.x < -0.26) {
                _Camera2.default.camera.rotation.x = -0.26;
            } else if (_Camera2.default.camera.rotation.x > 0.26) {
                _Camera2.default.camera.rotation.x = 0.26;
            }
        }

        /**
         * Called on W pressed.
         */

    }, {
        key: 'forward',
        value: function forward() {
            this.velocity.z = -_constants.PLAYER.walkSpeed;
        }

        /**
         * Called on S pressed.
         */

    }, {
        key: 'backward',
        value: function backward() {
            this.velocity.z = _constants.PLAYER.walkSpeed;
        }

        /**
         * Called on A pressed.
         */

    }, {
        key: 'left',
        value: function left() {
            this.velocity.x = -_constants.PLAYER.walkSpeed;
        }

        /**
         * Called on D pressed.
         */

    }, {
        key: 'right',
        value: function right() {
            this.velocity.x = _constants.PLAYER.walkSpeed;
        }

        /**
         * Walk over the terrain.
         */

    }, {
        key: 'walk',
        value: function walk() {
            // !!!!!!!!!! Rotation and movement of Player is correct !!!!!!!!!!
            // !!!!!!!!!! TODO: change x movement !!!!!!!!!

            // Vector of velocity the player already has
            var oldVector = this.player.getLinearVelocity();
            // Remove players matrix from default matrix
            var rotationMatrix = new THREE.Matrix4().extractRotation(this.player.matrix);
            // Calculate velocity for the player by matrix and set the y to the old velocity
            var forceVector = new THREE.Vector3(this.velocity.x, oldVector.y, this.velocity.z).applyMatrix4(rotationMatrix);

            // We use an updated vector to redefine its velocity
            this.player.setLinearVelocity(forceVector);

            this.velocity.set(0, 0, 0);
        }

        /**
         * Update player position.
         *
         * @param {Float} delta
         */

    }, {
        key: 'update',
        value: function update(delta) {
            this.player.__dirtyRotation = true;
            if (true === this.walkActions.forward) {
                this.forward();
            }

            if (true === this.walkActions.backward) {
                this.backward();
            }

            if (true === this.walkActions.left) {
                this.left();
            }

            if (true === this.walkActions.right) {
                this.right();
            }

            this.walk();
        }
    }]);

    return PointerLockControls;
}(_ControlsKeyMapper3.default);

exports.default = PointerLockControls;

},{"./../Camera.js":15,"./../constants.js":26,"./ControlsKeyMapper.js":20}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Scene = require('./Scene.js');

var _Scene2 = _interopRequireDefault(_Scene);

var _Camera = require('./Camera.js');

var _Camera2 = _interopRequireDefault(_Camera);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @type {Symbol}
 */
var singleton = Symbol();

/**
 * @type {Symbol}
 */
var singletonEnforcer = Symbol();

/**
 * @class Renderer
 */

var Renderer = function () {
  /**
   * @param {Symbol} enforcer
   */
  function Renderer(enforcer) {
    _classCallCheck(this, Renderer);

    if (enforcer != singletonEnforcer) throw "Cannot construct singleton Renderer";

    /**
     * @type {THREE.WebGLRenderer}
     * @private
     */
    this._renderer = new THREE.WebGLRenderer();

    this._renderer.setClearColor(0x000000);
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.shadowMapEnabled = true;
    this._renderer.shadowMapSoft = true;
  }

  /**
   * @returns {Renderer}
   */


  _createClass(Renderer, [{
    key: 'addAxis',


    /**
     * add axis
     */
    value: function addAxis() {
      var axes = new THREE.AxisHelper(200);

      _Scene2.default.scene.add(axes);
    }

    /**
     * render app
     */

  }, {
    key: 'render',
    value: function render() {
      document.getElementById('viewport').appendChild(this.renderer.domElement);

      this.renderer.render(_Scene2.default.scene, _Camera2.default.camera);
    }

    /**
     * @returns {THREE.WebGLRenderer}
     */

  }, {
    key: 'renderer',
    get: function get() {
      return this._renderer;
    }
  }], [{
    key: 'instance',
    get: function get() {
      if (!this[singleton]) {
        this[singleton] = new Renderer(singletonEnforcer);
      }

      return this[singleton];
    }
  }]);

  return Renderer;
}();

exports.default = Renderer.instance;

},{"./Camera.js":15,"./Scene.js":24}],24:[function(require,module,exports){
'use strict';

/**
 * @type {Symbol}
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var singleton = Symbol();

/**
 * @type {Symbol}
 */
var singletonEnforcer = Symbol();

/**
 * Scene of the Game.
 * Created with PhysiJS
 *
 * @class Scene
 */

var Scene = function () {
  function Scene(enforcer) {
    _classCallCheck(this, Scene);

    if (enforcer != singletonEnforcer) throw "Cannot construct singleton Scene";

    Physijs.scripts.worker = '/dist/js/physijs_worker.js';
    Physijs.scripts.ammo = '/dist/js/ammo.js';

    /**
     * @type {Physijs.Scene}
     * @private
     */
    window.scene = this._scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });

    this.scene.setGravity(new THREE.Vector3(0, -10, 0));
  }

  /**
   * @returns {Scene}
   */


  _createClass(Scene, [{
    key: 'scene',


    /**
     * @returns {THREE.Scene}
     */
    get: function get() {
      return this._scene;
    }
  }], [{
    key: 'instance',
    get: function get() {
      if (!this[singleton]) {
        this[singleton] = new Scene(singletonEnforcer);
      }

      return this[singleton];
    }
  }]);

  return Scene;
}();

exports.default = Scene.instance;

},{}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _WorkerClass = require('./../Modules/WorkerClass.js');

var _WorkerClass2 = _interopRequireDefault(_WorkerClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @type {Symbol}
 */
var singleton = Symbol();

/**
 * @type {Symbol}
 */
var singletonEnforcer = Symbol();

/**
 * @class WorkerManagerService
 */

var WorkerManagerService = function () {
    function WorkerManagerService(enforcer) {
        _classCallCheck(this, WorkerManagerService);

        if (enforcer != singletonEnforcer) throw 'Cannot construct singleton WorkerManagerService';

        this.worker = {};
    }

    /**
     * @returns {WorkerManagerService}
     */


    _createClass(WorkerManagerService, [{
        key: 'getWorker',


        /**
         * Returns worker instance.
         *
         * @param {String} key
         *
         * @returns {WorkerClass}
         */
        value: function getWorker(key) {
            if (!this.worker[key]) {

                this.worker[key] = new _WorkerClass2.default(key, {
                    fileName: key + '.js'
                });
            }

            return this.worker[key];
        }
    }], [{
        key: 'instance',
        get: function get() {
            if (!this[singleton]) {
                this[singleton] = new WorkerManagerService(singletonEnforcer);
            }

            return this[singleton];
        }
    }]);

    return WorkerManagerService;
}();

exports.default = WorkerManagerService.instance;

},{"./../Modules/WorkerClass.js":19}],26:[function(require,module,exports){
'use strict';

/**
 * Player Configuration.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
var PLAYER = exports.PLAYER = {
  walkSpeed: 1,
  runSpeed: 2,
  lookSpeed: 70 // mouse-delta / lookSpeed
};

/**
 * Map config.
 */
var MAP = exports.MAP = {};

/**
 * Debug settings.
 */
var DEBUG = exports.DEBUG = {
  player: false,
  flatMap: false
};

},{}],27:[function(require,module,exports){
'use strict';

var _Bootstrap = require('./Bootstrap.js');

var _Bootstrap2 = _interopRequireDefault(_Bootstrap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bootstrap = new _Bootstrap2.default();

},{"./Bootstrap.js":14}]},{},[27])


//# sourceMappingURL=index.js.map
