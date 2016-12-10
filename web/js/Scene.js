'use strict';

/**
 * @type {Symbol}
 */
let singleton = Symbol();

/**
 * @type {Symbol}
 */
let singletonEnforcer = Symbol()

/**
 * Scene of the Game.
 * Created with PhysiJS
 *
 * @class Scene
 */
class Scene {
    constructor(enforcer) {
        if(enforcer != singletonEnforcer) throw "Cannot construct singleton Scene";

        Physijs.scripts.worker = '/dist/js/physijs_worker.js';
        Physijs.scripts.ammo = '/dist/js/ammo.js';

        /**
         * @type {Physijs.Scene}
         * @private
         */
        window.scene = this._scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });

        this.scene.setGravity(new THREE.Vector3( 0, -10, 0 ));
    }

    /**
     * @returns {Scene}
     */
    static get instance() {
        if(!this[singleton]) {
            this[singleton] = new Scene(singletonEnforcer);
        }

        return this[singleton];
    }

    /**
     * @returns {THREE.Scene}
     */
    get scene() {
        return this._scene;
    }
}

export default Scene.instance;