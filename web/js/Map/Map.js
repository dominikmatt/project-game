'use strict';

var THREE = require('three');
import scene from './../Scene.js';
import camera from './../Camera.js';
import TerrainGeometry from './TerrainGeometry.js';
var Physijs = require('physijs-browserify')(THREE);

/**
 * @type {Symbol}
 */
let singleton = Symbol();

/**
 * @type {Symbol}
 */
let singletonEnforcer = Symbol();

/**
 * @class Map
 */
class Map {
    constructor(enforcer) {
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
    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new Map(singletonEnforcer);
        }

        return this[singleton];
    }

    createTerrain() {
        this.initTerrain();
    }

    initTerrain() {
        let terrrainGeometry = new TerrainGeometry({
            map: 'map-1'
        });
        terrrainGeometry.createGeometry();
        let mesh = new THREE.Mesh(terrrainGeometry.bufferGeometry, new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            wireframe: true
        }));
        mesh.name = 'Terrain';

        scene.scene.add(mesh);

        camera.camera.lookAt(mesh.position);
    }

    /**
     * @returns {THREE.Mesh}
     */
    get terrain() {
        return this._terrain;
    }
}

export default Map.instance;