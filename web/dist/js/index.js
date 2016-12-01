(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./Game.js":3,"./Map/Map.js":4,"./Renderer.js":8,"./Scene.js":9}],2:[function(require,module,exports){
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

    this.camera.position.set(0, 30, 50);
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

},{"./Scene.js":9}],3:[function(require,module,exports){
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

},{"./Camera.js":2,"./Player/Player.js":7,"./Renderer.js":8,"./Scene.js":9}],4:[function(require,module,exports){
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

            _Camera2.default.camera.lookAt(ground.position);
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

},{"./../Camera.js":2,"./../Scene.js":9,"./TerrainGeometry.js":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
            var heightData = this.getHeightImageData().data;
            var groundGeometry = new THREE.PlaneGeometry(this.mapWidth, this.mapLength, this.mapWidth - 1, this.mapLength - 1);
            var verticesIndex = 0;

            // Calculate Vertice height.
            for (var index = 0; index < heightData.length; index += 4) {
                var all = heightData[index] + heightData[index + 1] + heightData[index + 2];

                // set it to PlaneGeometry
                groundGeometry.vertices[verticesIndex].z = all / (12 * 6);
                verticesIndex++;
            }

            groundGeometry.computeFaceNormals();
            groundGeometry.computeVertexNormals();

            this.groundGeometry = groundGeometry;

            resolve();
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

},{}],6:[function(require,module,exports){
'use strict';

},{}],7:[function(require,module,exports){
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

var _Controls = require('./Controls.js');

var _Controls2 = _interopRequireDefault(_Controls);

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
 * @class Player
 */

var Player = function () {
    function Player(enforcer) {
        _classCallCheck(this, Player);

        if (enforcer != singletonEnforcer) throw "Cannot construct singleton Player";
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
        }

        /**
         * Append player object to scene.
         */

    }, {
        key: 'appendPlayer',
        value: function appendPlayer() {
            console.debug('Generate Player…');

            var material = Physijs.createMaterial(new THREE.MeshBasicMaterial({
                color: 0x888888
            }), 0.8, 0.3);
            var mesh = new Physijs.BoxMesh(new THREE.CubeGeometry(1, 1, 1), material);

            mesh.position.set(10, 10, 0);
            mesh.setLinearVelocity(new THREE.Vector3(0, 0, 0));
            mesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));
            mesh.name = 'player';
            _Scene2.default.scene.add(mesh);
        }
    }, {
        key: 'update',
        value: function update() {
            // update player
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

},{"./../Camera.js":2,"./../Map/Map.js":4,"./../Scene.js":9,"./Controls.js":6}],8:[function(require,module,exports){
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

},{"./Camera.js":2,"./Scene.js":9}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
'use strict';

var _Bootstrap = require('./Bootstrap.js');

var _Bootstrap2 = _interopRequireDefault(_Bootstrap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bootstrap = new _Bootstrap2.default();

},{"./Bootstrap.js":1}]},{},[10])


//# sourceMappingURL=index.js.map
