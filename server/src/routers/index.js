"use strict";

const portfolio = require('./portfolio');

function index(server) {
    server.use( "/portfolio", portfolio )
}

module.exports = index;