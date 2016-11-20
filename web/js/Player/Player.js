'use strict';

import THREE from 'three';
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
        if(enforcer != singletonEnforcer) throw "Cannot construct singleton Player";
    }

    /**
     * @returns {Camera}
     */
    static get instance() {
        if(!this[singleton]) {
            this[singleton] = new Player(singletonEnforcer);
        }

        return this[singleton];
    }

    /**
     * create player
     */
    create() {
        var geometry = new THREE.CubeGeometry(1, 1, 1);
        var material = new THREE.MeshNormalMaterial({
            color: 0xff0000,
            wireframe: true
        });

        this.player = new THREE.Mesh(geometry, material);
        this.player.position.set(0, 50, 0);
        this.player.name = 'Player';

        scene.scene.add(this.player);

        this.controls = new Controls();
    }

    /**
     * @param {flaot} delta
     */
    toBottom(delta) {
        if (!map.terrain) {
            return;
        }

        var raycaster = new THREE.Raycaster();
        var velocity = new THREE.Vector3();
        var distance = 0;
        var objects = [];

        raycaster.set(this.player.position, new THREE.Vector3(0, -1, 0));
        map.terrain.children.forEach(function(child) {
            child.children.forEach(function(sub) {
                objects.push(sub);
            });
        });

        var intersects = raycaster.intersectObjects( objects, true );

        if (!intersects.length) {
            this.player.position.y = 100;
            return;
        }

        if (distance < intersects[0].distance) {
            this.player.position.y -= intersects[0].distance - 1; // the -1 is a fix for a shake effect I had
        }

        // TODO: add wather physics
        if (this.player.position.y < 0) {
            this.player.position.y = 0;
        }

        //gravity and prevent falling through floor
        if (distance >= intersects[0].distance && velocity.y <= 0) {
            velocity.y = 0;
        } else if (distance <= intersects[0].distance && velocity.y === 0) {
            velocity.y -= delta ;
        }

    }

    set player(player) {
        this._player = player;
    }

    get player() {
        return this._player;
    }

    /**
     * @param {float} delta
     */
    update(delta) {
        this.toBottom(delta);
        this.controls.update(delta, this);
    }
}

export default Player;