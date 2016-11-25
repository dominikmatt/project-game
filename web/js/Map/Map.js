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

    /**
     * Create Terrain.
     */
    createTerrain(onMapLoaded) {
        this.onMapLoaded = onMapLoaded;
        this.initTerrain();
    }

    /**
     * Initialize TerrainGeometry.
     */
    initTerrain() {
        this.terrrainGeometry = new TerrainGeometry({
            map: 'map-2'
        });
        let groundGeometryLoader = this.terrrainGeometry.createGeometry();

        groundGeometryLoader
            .then(this.onGeometryGenerated.bind(this));
    }

    /**
     * Called after TerrainGeometry is ready.
     */
    onGeometryGenerated() {
        let groundMaterial = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({
                wireframe: true
            }),
            .8, // high friction
            .4 // low restitution
        );

        var ground = new Physijs.HeightfieldMesh(
            this.terrrainGeometry.groundGeometry,
            groundMaterial,
            0, // mass
            this.terrrainGeometry.mapWidth,
            this.terrrainGeometry.mapLength
        );
        ground.rotation.x = Math.PI / -2;
        ground.receiveShadow = true;
        ground.name = 'Ground';

        camera.camera.lookAt(ground.position);
        scene.scene.add( ground );

        this.onMapLoaded.call(null);
    }

    /**
     * @returns {THREE.Mesh}
     */
    get terrain() {
        return this._terrain;
    }
}

export default Map.instance;