"use strict";

const { Router } = require('express');

const {
    createUser: createUser_
} = require('../database/users');

async function createUser({ body: { vk_id, specialization } }, res) {
    let response = await createUser_(
        vk_id,
        specialization
    );

    if( !response.isSuccess ){
        res.status(400).json(response);
        return;
    }

    res.json(response);
}

function index() {
    const router = new Router();

    router.post('/create', createUser);

    return router;
}

module.exports = index();