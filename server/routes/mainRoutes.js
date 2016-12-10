'use strict';

const express = require('express');

/**
 * Output master file
 *
 * @param {IncomingMessage} req
 * @param {OutgoingMessage} res
 */
const renderMaster = (req, res) => {
    res.render('master.ejs');
};

/**
 * Initialize Router;
 * @param {AppWebspace} app
 * @param {WebsocketWebspace} wsApp
 */
module.exports.initialize = (app, wsApp) => {
    app.app.get('/', renderMaster);
    app.app.use(express.static('web/'));
};