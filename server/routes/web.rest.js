'use strict';

const express = require('express');
const WebController = require('./../controller/WebController.js');

/**
 * Initialize Router.
 *
 * @param {AppWebspace} app
 * @param {WebsocketWebspace} wsApp
 */
module.exports.initialize = (app, wsApp) => {
    app.app.get('/', WebController.renderMasterAction);
    app.app.use(express.static('web/'));
};

