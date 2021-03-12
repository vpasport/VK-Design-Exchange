"use strict";

const { Router } = require('express');

const {
    getUserInfo
} = require('../helper/vk');

async function getInfo(req, res){
    let result = await getUserInfo(req.session.vk_id);

    if(result.isSuccess){
        res.json(result);
        return;
    }

    res.sendStatus(511);
}

async function getRole(req, res){
    res.json({
        role: req.session.role
    });
}

function index() {
    const router = new Router;

    router.get('/info', getInfo);
    router.get('/role', getRole);

    return router;
}

module.exports = index();