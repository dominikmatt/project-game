'use strict';

import scene from './Scene.js';
import renderer from './Renderer.js';
import map from './Map/Map.js';
import Player from './Player/Player.js';
import camera from './Camera.js';
import THREE from 'three';
var Physijs = require('physijs-browserify')(THREE);

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
     * initialize game
     */
    initialize() {
        Physijs.scripts.worker = '/js/physijs_worker.js';
        Physijs.scripts.ammo = '/js/ammo.js';

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();


        window.onload = this.onLoad.bind(this);
    }

    /**
     * on window laoded
     */
    onLoad() {
        this.clock = new THREE.Clock();

        this.scene = scene;
        this.renderer = renderer;

        this.renderer.addAxis();

        this.map = map;
        this.map.createTerrain();
        this.player = Player.instance;
        this.player.create();

        this.render();
    }

    /**
     * render scene
     */
    render() {
        var delta = this.clock.getDelta();
        this.player.update(delta);
        camera.update(this.raycaster, this.mouse);

        //this.cube.position.y -= 0.001;

        requestAnimationFrame( this.render.bind(this) );
        this.renderer.render();
    }
}