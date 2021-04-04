"use strict";

const { Router } = require('express');

const {
    getUserInfo
} = require('../helper/vk');

async function getInfo(req, res) {
    let result = await getUserInfo(req.session.vk_id);

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(511);
}

async function getInfoByLink({ query: { link } }, res) {
    if (link.includes('https')) {
        link = link.match(/https?:\/\/.*\/(.*)\/?/)[1];
    }

    let result = await getUserInfo(link);

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(511);
}

async function getRole({ session }, res) {
    res.json({
        role: session.role,
        user: session.user,
        mainRole: session.mainRole
    });
}

async function changeMainRole({ session }, res) {
    for (const role of session.role) {
        if (role !== session.mainRole) {
            session.mainRole = role;
            break;
        }
    }

    res.json({
        role: session.role,
        user: session.user,
        mainRole: session.mainRole
    })
}

function index() {
    const router = new Router;

    router.get('/info', getInfo);
    router.get('/role', getRole);
    router.get('/check?:link', getInfoByLink);

    router.put('/change_role', changeMainRole);

    return router;
}

module.exports = index();