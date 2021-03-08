"use strict";

const { Router } = require('express');
const {
    getAll: getAll_,
    create: create_
} = require('../database/tags');

async function getAll(req, res) {
    let result = await getAll_();

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(204);
}

async function create({ body: { name } }, res) {
    let result = await create_(name);

    if(result.isSuccess){
        res.json(result);
        return;
    }

    res.sendStatus(205)
}

function index() {
    const router = new Router();

    router.get('/', getAll);
    router.post('/', create);

    return router;
}

module.exports = index();