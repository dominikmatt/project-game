'use strict';

import ControlsKeyMapper from './ControlsKeyMapper.js';
import { PLAYER, DEBUG } from './../constants.js';
import camera from './../Camera.js';

/**
 * Control for Player.
 */
export default class PointerLockControls extends ControlsKeyMapper {
    constructor(camera, player) {
        super();

        this.player = player;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.v0 = new THREE.Vector3(0, 0, 0);
        this.v1 = new THREE.Vector3(0, 0, 0);
        /*player.setLinearFactor(new THREE.Vector3(0,0,0));*/
        this.player.setAngularFactor(new THREE.Vector3(0,0,0));

        if (DEBUG.player) {
            // Debug Player player is visible from top.
            camera.position.set(0, 30, 30);
            camera.lookAt(this.player.position);
        } else {
            camera.position.set(0, 0, 0);
            this.player.add(camera);
        }

        this.bindEvents();
    }

    /**
     * Rotate Player.
     * TODO: Implement show up and down.
     *
     * @param deltaX
     * @param deltaY
     */
    rotate(deltaX, deltaY) {
        camera.camera.rotation.x -= deltaY / PLAYER.lookSpeed;
        this.player.rotation.y -= deltaX / PLAYER.lookSpeed;

        if (camera.camera.rotation.x < -0.26) {
            camera.camera.rotation.x = -0.26;
        } else if (camera.camera.rotation.x > 0.26) {
            camera.camera.rotation.x = 0.26;
        }
    }

    /**
     * Called on W pressed.
     */
    forward() {
        this.velocity.z = -(PLAYER.walkSpeed);
    }

    /**
     * Called on S pressed.
     */
    backward() {
        this.velocity.z = PLAYER.walkSpeed;
    }

    /**
     * Called on A pressed.
     */
    left() {
        this.velocity.x = -(PLAYER.walkSpeed);
    }

    /**
     * Called on D pressed.
     */
    right() {
        this.velocity.x = PLAYER.walkSpeed;
    }

    /**
     * Walk over the terrain.
     */
    walk() {
        // !!!!!!!!!! Rotation and movement of Player is correct !!!!!!!!!!
        // !!!!!!!!!! TODO: change x movement !!!!!!!!!

        // Vector of velocity the player already has
        const oldVector = this.player.getLinearVelocity();
        // Remove players matrix from default matrix
        const rotationMatrix = new THREE.Matrix4().extractRotation(this.player.matrix);
        // Calculate velocity for the player by matrix and set the y to the old velocity
        const forceVector = new THREE.Vector3(
            this.velocity.x,
            oldVector.y,
            this.velocity.z
        )
            .applyMatrix4(rotationMatrix);

        // We use an updated vector to redefine its velocity
        this.player.setLinearVelocity(forceVector);


        this.velocity.set(0, 0, 0);
    }

    /**
     * Update player position.
     *
     * @param {Float} delta
     */
    update(delta) {
        this.player.__dirtyRotation = true;
        if (true === this.walkActions.forward) {
            this.forward();
        }

        if (true === this.walkActions.backward) {
            this.backward();
        }

        if (true === this.walkActions.left) {
            this.left();
        }

        if (true === this.walkActions.right) {
            this.right();
        }

        this.walk();
    }
}