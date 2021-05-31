"use strict";

const { Router } = require("express");

const {
    getFavorites: getFavorites_,
    addFavorites: addFavorites_,
} = require('../database/favorites');

const { checkSign } = require('../helper/vk');

async function getFavorites({ query }, res) {
    if (checkSign(query)) {
        let result = await getFavorites_(
            query.vk_user_id,
            query.from,
            query.to,
            query.from_id
        );

        if (result.isSuccess) {
            res.json(result);
            return;
        }

        res.sendStatus(502);
        return;
    }

    res.sendStatus(403);
}

async function addFavorites({ body: { url_params, portfolio_id } }, res) {

    let params = JSON.parse('{"' + decodeURI(url_params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

    if (checkSign(params)) {
        let result = await addFavorites_(params.vk_user_id, portfolio_id);

        if (result.isSuccess) {
            res.sendStatus(204);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(403);
}

function index() {
    const router = new Router();

    router.get('/', getFavorites);

    router.post('/', addFavorites);

    return router;
}

module.exports = index();