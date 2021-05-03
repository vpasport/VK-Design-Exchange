"use strict";

const { Router } = require('express');

const {
    getUserInfo
} = require('../helper/vk');

const {
    getBannedUsers: getBannedUsers_,
    unbanUser: unbanUser_
} = require('../database/users');

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

async function getBannedUsers({ session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await getBannedUsers_();

        if (result.isSuccess) {
            res.json(result);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
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

async function banUser({ body: { vk_id }, session }, res) {

}

async function unbanUser({ body: { id }, session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await unbanUser_(id);

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
    const router = new Router;

    router.get('/info', getInfo);
    router.get('/role', getRole);
    router.get('/check?:link', getInfoByLink);
    router.get('/banned', getBannedUsers);

    router.put('/change_role', changeMainRole);

    router.post('/ban', banUser);
    router.post('/unban', unbanUser);

    return router;
}

module.exports = index();