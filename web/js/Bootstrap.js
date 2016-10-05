'use strict';

import scene from './Scene.js';
import renderer from './Renderer.js';
import Map from './Map/Map.js';
import THREE from 'three';
var Physijs = require('physijs-browserify')(THREE);


console.log(Physijs);

/**
 * @type {Bootstrap}
 */
let instance = null;


/**
 * @class Bootstrap
 */
export default class Bootstrap {
    constructor() {
        if(!instance){
            console.debug('Booting…');
            instance = this;

            this.initialize();
        }

        return instance;
    }

    initialize() {
        Physijs.scripts.worker = '/js/physijs_worker.js';
        Physijs.scripts.ammo = '/js/ammo.js';

        this.scene = scene;
        this.renderer = renderer;

        this.renderer.addAxis();

        this.map = Map.instance;
        this.map.createTerrain();
        this.map.createSphere();

        this.render();
    }

    /**
     * @deprecated
     */
    render() {
        requestAnimationFrame( this.render.bind(this) );
        this.renderer.render();
    }
}