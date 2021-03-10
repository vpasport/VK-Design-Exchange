"use strict";

const { Router } = require('express');
const {
    getAll: getAll_,
    create: create_,
    deleteTag: deleteTag_
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

async function deleteTag({params: {id}}, res){
    let result = await deleteTag_(id);

    if(result.isSuccess){
        res.json(result);
        return;
    }

    res.sendStatus(204);
}

function index() {
    const router = new Router();

    router.get('/', getAll);

    router.post('/', create);

    router.delete('/:id', deleteTag);

    return router;
}

module.exports = index();