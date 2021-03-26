"use strcit";

const { Router } = require('express');
const {
    getAdmins: getAdmins_,
    createAdmin: createAdmin_,
    deleteAdmin: deleteAdmin_
} = require('../database/admins');

async function getAdmins({ session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await getAdmins_();

        if (result.isSuccess) {
            res.json(result);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

async function createAdmin({ body: { vk_id }, session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await createAdmin_(vk_id);

        if (result.isSuccess) {
            res.json(result);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

async function deleteAdmin({ body: { id }, session, sessionStore }, res) {
    let status = 204;

    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await deleteAdmin_(id);

        if (result.isSuccess) {
            if (result.sessionId !== undefined) {
                sessionStore.destroy(result.sessionId.sid, (err) => {
                    if (err) {
                        console.error(err);
                        status = 520;
                    }
                })
            }
            
            res.sendStatus(status);
            return;
        }

        status = 520;
        res.sendStatus(status);
        return;
    }

    res.sendStatus(401);
}

function index() {
    const router = new Router();

    router.get('/', getAdmins);

    router.post('/', createAdmin);

    router.delete('/', deleteAdmin);

    return router;
}

module.exports = index();