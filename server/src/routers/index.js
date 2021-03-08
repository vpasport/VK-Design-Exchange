"use strict";

const portfolio = require('./portfolio');
const users = require('./users');
const tags = require('./tags');

function index(server) {
    server.use('/portfolio', portfolio);

    server.use('/users', users);

    server.use('/tags', tags)
}

module.exports = index;