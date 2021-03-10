"use strict";

const portfolio = require('./portfolio');
const designers = require('./designers');
const tags = require('./tags');
const reviews = require('./reviews');

function index(server) {
    server.use('/portfolio', portfolio);

    server.use('/designers', designers);

    server.use('/tags', tags);

    server.use('/reviews', reviews);
}

module.exports = index;