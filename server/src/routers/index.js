"use strict";

const portfolio = require('./portfolio');
const designers = require('./designers');
const tags = require('./tags');
const reviews = require('./reviews');
const users = require('./users');
const admins = require('./admins');
const orders = require('./orders');
const offers = require('./offers');

const {
    getRoles
} = require('../database/users');

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

async function auth(response, req, res) {
    if (response.error !== undefined) {
        res.redirect(`${process.env.CLIENT}/login/error`);
    }

    let roles = await getRoles(response.user_id);


    if (roles.isSuccess) {
        req.session.vk_id = response.user_id;
        req.session.role = roles.roles;
        req.session.user = roles.user;
        req.session.mainRole = roles.roles[0];

        if (roles.roles.length === 1 && roles.roles.indexOf('designer') !== -1) {
            res.redirect(`${process.env.CLIENT}/designer/profile`);
            return;
        }

        res.redirect(req.query.state);
        return;
    }

    res.redirect(`${process.env.CLIENT}/login/error`);
}

function addState(params, req, res) {
    return {
        ...params,
        state: req.query.redirect_uri
    }
}

async function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            res.sendStatus(503);
            return;
        }
        res.sendStatus(204);
    })
}

function index(server) {
    server.use('/portfolio', portfolio);

    server.use('/designers', designers);

    server.use('/tags', tags);

    server.use('/reviews', reviews);

    server.use('/users', users);

    server.use('/admins', admins);

    server.use('/orders', orders);

    server.use('/offers', offers);

    server.get('/logout', logout);

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