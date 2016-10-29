'use strict';

import THREE from 'three';
import scene from './Scene.js';
import camera from './Camera.js';

/**
 * @type {Symbol}
 */
let singleton = Symbol();

/**
 * @type {Symbol}
 */
let singletonEnforcer = Symbol()

/**
 * @class Renderer
 */
class Renderer {
    /**
     * @param {Symbol} enforcer
     */
    constructor(enforcer) {
        if(enforcer != singletonEnforcer) throw "Cannot construct singleton Renderer";

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
    static get instance() {
        if(!this[singleton]) {
            this[singleton] = new Renderer(singletonEnforcer);
        }

        return this[singleton];
    }

    /**
     * add axis
     */
    addAxis() {
        let axes = new THREE.AxisHelper(200);

        scene.scene.add(axes);
    }

    /**
     * render app
     */
    render() {
        document.getElementById('viewport')
            .appendChild(this.renderer.domElement);

        this.renderer.render(scene.scene, camera.camera);
    }

    /**
     * @returns {THREE.WebGLRenderer}
     */
    get renderer() {
        return this._renderer;
    }
}

export default Renderer.instance;