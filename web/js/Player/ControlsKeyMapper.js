'use strict';

export default class {
    constructor() {
        this.mouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;

        this.walkActions = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };

        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
    }

    onMouseDown(event) {
        event.preventDefault();

        this.mouseDown = true;
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    onMouseMove(event) {
        if (!this.mouseDown) {
            return;
        }

        event.preventDefault();

        var deltaX = event.clientX - this.mouseX;
        var deltaY = event.clientY - this.mouseY;
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;

        this.rotate(deltaX, deltaY);
    }

    onKeyDown(event) {
        const methodName = `on${event.code}Down`;
        const handler = this[methodName];

        if (handler) {
            handler.call(this);
        }
    }

    onKeyUp(event) {
        const methodName = `on${event.code}Up`;
        const handler = this[methodName];

        if (handler) {
            handler.call(this);
        }
    }

    onKeyWDown() {
        this.walkActions.forward = true;
    }

    onKeyWUp() {
        this.walkActions.forward = false;
    }

    onKeySDown() {
        this.walkActions.backward = true;
    }

    onKeySUp() {
        this.walkActions.backward = false;
    }

    onKeyADown() {
        this.walkActions.left = true;
    }

    onKeyAUp() {
        this.walkActions.left = false;
    }

    onKeyDDown() {
        this.walkActions.right = true;
    }

    onKeyDUp() {
        this.walkActions.right = false;
    }

}