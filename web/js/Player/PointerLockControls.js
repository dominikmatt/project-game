'use strict';

import ControlsKeyMapper from './ControlsKeyMapper.js';
import { PLAYER } from './../constants.js';
import camera from './../Camera.js';

export default class PointerLockControls extends ControlsKeyMapper {
    constructor(camera, player) {
        super();

        this.player = player;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.v0 = new THREE.Vector3(0, 0, 0);
        this.v1 = new THREE.Vector3(0, 0, 0);
        /*player.setLinearFactor(new THREE.Vector3(0,0,0));*/
        this.player.setAngularFactor(new THREE.Vector3(0,0,0));

        camera.position.set(0,0,0);
        this.player.add(camera);

        this.bindEvents();
    }

    getObject() {

    }

    rotate(deltaX, deltaY) {
        camera.camera.rotation.y -= deltaX / 50;
        camera.camera.rotation.x -= deltaY / 50;

    }

    forward() {
        this.velocity.z = -(PLAYER.walkSpeed);
    }

    backward() {
        this.velocity.z = PLAYER.walkSpeed;
    }

    left() {
        this.velocity.x = -(PLAYER.walkSpeed);
    }

    right() {
        this.velocity.x = PLAYER.walkSpeed;
    }

    walk(delta) {
        console.debug(camera.camera.quaternion.y);
        var oldVector = this.player.getLinearVelocity(); // Vector of velocity the player already has
        var playerVec3 = new THREE.Vector3(oldVector.x + 0.5 * this.velocity.x, oldVector.y, oldVector.z + 0.5 * this.velocity.z);
        this.player.setLinearVelocity(playerVec3); // We use an updated vector to redefine its velocity

        this.velocity.set(0, 0, 0);
    }

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

        this.walk(delta);
    }
}