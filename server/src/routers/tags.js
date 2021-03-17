"use strict";

const { Router } = require('express');
const {
    getAll: getAll_,
    create: create_,
    deleteTag: deleteTag_,
    updateTag: updateTag_
} = require('../database/tags');

async function getAll(req, res) {
    let result = await getAll_();

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(204);
}

async function create({ body: { name }, session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await create_(name);

        if (result.isSuccess) {
            res.json(result);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

async function deleteTag({ params: { id }, session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await deleteTag_(id);

        if (result.isSuccess) {
            res.json(result);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

async function updateTag({ params: { id }, body: { name }, session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await updateTag_(id, name);

        if(result.isSuccess){
            res.sendStatus(204);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

function index() {
    const router = new Router();

    router.get('/', getAll);

    router.post('/', create);

    router.delete('/:id', deleteTag);

    router.put('/:id', updateTag);

    return router;
}

module.exports = index();