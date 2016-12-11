'use strict';

/**
 * @type {WebController}
 */
module.exports = class WebController {
    constructor() {

    }

    /**
     * Render master.ejs.
     *
     * @param {IncomingMessage} req
     * @param {OutgoingMessage} res
     */
    static renderMasterAction(req, res) {
        res.render('master.ejs');
    }
};