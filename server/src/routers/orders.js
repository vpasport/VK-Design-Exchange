"use strict";

const { Router } = require('express');

const {
    getOrders: getOrders_
} = require('../database/orders');

async function getOrders(req, res) {
    let result = await getOrders_();

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(520);
}

function index() {
    const router = new Router();

    router.get('/', getOrders);

    return router;
}

module.exports = index();