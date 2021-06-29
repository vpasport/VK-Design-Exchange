"use strict";

const { Router } = require('express');
const {
    getAll: getAll_,
    create: create_,
    update: update_,
    del: del_
} = require('../database/specializations');

async function getAll(req, res) {
    let result = await getAll_();

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(520);
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

async function update({ params: { id }, body: { name }, session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await update_(id, name);

        if (result.isSuccess) {
            res.sendStatus(204);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

async function del({ params: { id }, session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await del_(id);

        if (result.isSuccess) {
            res.json(result);
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

    router.put('/:id', update);

    router.delete('/:id', del);

    return router;
}

module.exports = index();