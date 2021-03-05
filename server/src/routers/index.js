"use strict";

const portfolio = require('./portfolio');
const users = require('./users');

function index(server) {
    server.use( '/portfolio', portfolio );

    server.use( '/users', users );
}

module.exports = index;