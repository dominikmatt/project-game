'use strict';

import scene from './../Scene.js';
import camera from './../Camera.js';
import map from './../Map/Map.js';
import Controls from './Controls.js';

/**
 * @type {Symbol}
 */
let singleton = Symbol();

/**
 * @type {Symbol}
 */
let singletonEnforcer = Symbol();


/**
 * @class Player
 */
class Player {
    constructor(enforcer) {
        if (enforcer != singletonEnforcer) throw "Cannot construct singleton Player";
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
        var mesh = new Physijs.BoxMesh(
            new THREE.CubeGeometry(1, 1, 1),
            material
        );

        mesh.position.set(10, 10, 0);
        mesh.setLinearVelocity(new THREE.Vector3(0, 0, 0));
        mesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));
        mesh.name = 'player';
        scene.scene.add(mesh);
    }

    update() {
        // update player
    }
}

export default Player.instance;