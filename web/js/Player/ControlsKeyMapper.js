'use strict';

/**
 * Handles key pressed an mouse move events.
 */
export default class {
    constructor() {
        /**
         * @type {boolean}
         */
        this.mouseDown = false;

        /**
         * @type {number}
         */
        this.mouseX = 0;

        /**
         *
         * @type {number}
         */
        this.mouseY = 0;

        /**
         * @type {{forward: boolean, backward: boolean, left: boolean, right: boolean}}
         */
        this.walkActions = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };

        this.bindEvents();
    }

    /**
     * Bind all DOM-Events.
     */
    bindEvents() {
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
    }

    /**
     * Handle mouse down event.
     *
     * @param {MouseEvent} event
     */
    onMouseDown(event) {
        event.preventDefault();

        this.mouseDown = true;
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    /**
     * Handle Mouse move event.
     *
     * @param {MouseEvent} event
     */
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

    /**
     * Handle keydown event.
     *
     * @param {KeyboardEvent} event
     */
    onKeyDown(event) {
        const methodName = `on${event.code}Down`;
        const handler = this[methodName];

        if (handler) {
            handler.call(this);
        }
    }

    /**
     * Handle keydup event.
     *
     * @param {KeyboardEvent} event
     */
    onKeyUp(event) {
        const methodName = `on${event.code}Up`;
        const handler = this[methodName];

        if (handler) {
            handler.call(this);
        }
    }

    /**
     * Forward start. (W)
     */
    onKeyWDown() {
        this.walkActions.forward = true;
    }

    /**
     * Forward end. (W)
     */
    onKeyWUp() {
        this.walkActions.forward = false;
    }

    /**
     * Backward Start. (S)
     */
    onKeySDown() {
        this.walkActions.backward = true;
    }

    /**
     * Backward stop. (S)
     */
    onKeySUp() {
        this.walkActions.backward = false;
    }

    /**
     * Left start. (A)
     */
    onKeyADown() {
        this.walkActions.left = true;
    }

    /**
     * Left end. (A)
     */
    onKeyAUp() {
        this.walkActions.left = false;
    }

    /**
     * Right start. (D)
     */
    onKeyDDown() {
        this.walkActions.right = true;
    }

    /**
     * Right end. (D)
     */
    onKeyDUp() {
        this.walkActions.right = false;
    }

}