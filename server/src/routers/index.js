"use strict";

const portfolio = require('./portfolio');
const designers = require('./designers');
const tags = require('./tags');
const reviews = require('./reviews');
const fetch = require('node-fetch');

const {
    HOST,
    OAUTH_BIND_URI,
    OAUTH_AUTH_ENDPOINT,
    OAUTH_TOKEN_ENDPOINT,
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    OAUTH_SCOPE
} = process.env;

const { oauth } = require('../helper/oauth');

function auth(response, req, res) {
    req.session.vk_id = response.user_id;
    res.redirect(req.query.state);
}

function addState(params, req, res) {
    return {
        ...params,
        state: req.query.redirect_uri
    }
}

function index(server) {
    server.use('/portfolio', portfolio);

    server.use('/designers', designers);

    server.use('/tags', tags);

    server.use('/reviews', reviews);

    oauth({
        app: server,
        url: HOST,
        bind_uri: OAUTH_BIND_URI,
        auth_endpoint: OAUTH_AUTH_ENDPOINT,
        token_endpoint: OAUTH_TOKEN_ENDPOINT,
        fetch,
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
        afterTokenRequestFunction: auth
    }, {
        // codeRequestParams: {
        //     // scope: OAUTH_SCOPE
        // },
        tokenRequestFetchMethod: 'GET',
        beforeCodeRequestFunction: addState
    })
}

module.exports = index;