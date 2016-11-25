'use strict';

import scene from './Scene.js';
import renderer from './Renderer.js';
import map from './Map/Map.js';
import game from './Game.js';
var THREE = require('three');

window.THREE = THREE;

/**
 * @type {Bootstrap}
 */
let instance = null;


/**
 * @class Bootstrap
 */
export default class Bootstrap {
    /**
     * @returns {Bootstrap}
     */
    constructor() {
        if(!instance){
            console.debug('Booting…');
            instance = this;

            this.initialize();
        }

        return instance;
    }

    /**
     */
    initialize() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        window.onload = this.onLoad.bind(this);
    }

    /**
     * on window laoded
     */
    onLoad() {
        this.scene = scene;
        renderer.addAxis();

        this.map = map;
        this.map.createTerrain(this.onMapLoaded);
    }

    onMapLoaded() {
        game.start();
    }
}