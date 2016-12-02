'use strict';

import scene from './../Scene.js';
import camera from './../Camera.js';
import map from './../Map/Map.js';
import PointerLockControls from './PointerLockControls.js';

/**
 * @type {Symbol}
 */
let singleton = Symbol();

/**
 * @type {Symbol}
 */
let singletonEnforcer = Symbol();

var time = Date.now();

/**
 * @class Player
 */
class Player {
    constructor(enforcer) {
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
    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new Player(singletonEnforcer);
        }

        return this[singleton];
    }

    /**
     * Initialize Player.
     */
    initialize() {
        this.appendPlayer();
        this.initControls();
    }

    /**
     * Append player object to scene.
     */
    appendPlayer() {
        console.debug('Generate Player…');

        var material = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({
                color: 0x888888
            }),
            0.8,
            0.3
        );
        this.player = new Physijs.BoxMesh(
            new THREE.CubeGeometry(1, 1, 1),
            material
        );

        this.player.__dirtyRotation = true;
        this.player.position.set(10, 10, 0);
        this.player.setLinearVelocity(new THREE.Vector3(0, 0, 0));
        this.player.setAngularVelocity(new THREE.Vector3(0, 0, 0));
        this.player.name = 'player';
        scene.scene.add(this.player);
    }

    /**
     * Initialize PointerLockControls.
     */
    initControls() {
        console.debug('initial');
        this.controls = new PointerLockControls( camera.camera , this.player);

        //scene.scene.add( this.controls.getObject() );
    }

    /**
     * Update loop for player.
     *
     * @param {Float} delta
     */
    update(delta) {
        // update player
        if (this.controls) {
            this.controls.update(delta);
        }
    }

    /**
     * @returns {Physijs.BoxMesh}
     */
    get player() {
        return this._player;
    }

    /**
     * @param {Physijs.BoxMesh} value
     */
    set player(value) {
        this._player = value;
    }
}

export default Player.instance;