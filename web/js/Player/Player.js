'use strict';

import THREE from 'three';
import scene from './../Scene.js';
import camera from './../Camera.js';
import map from './../Map/Map.js';

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
        if(enforcer != singletonEnforcer) throw "Cannot construct singleton Camera";
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
            wireframe: false
        });

        this.player = new THREE.Mesh(geometry, material);
        this.player.position.set(0, 5, -120);

        scene.scene.add(this.player);

        this.player.add(camera.camera);
        camera.camera.position.set(0, 5, 0);
        camera.camera.lookAt(0, 20, 0);
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

        //gravity and prevent falling through floor
        if (distance >= intersects[0].distance && velocity.y <= 0) {
            velocity.y = 0;
        } else if (distance <= intersects[0].distance && velocity.y === 0) {
            velocity.y -= delta ;
        }

    }

    /**
     * @param {float} delta
     */
    update(delta) {
        this.toBottom(delta);
    }
}

export default Player;