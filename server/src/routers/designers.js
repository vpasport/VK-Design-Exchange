"use strict";

const { Router } = require('express');
const {
    getDesigners: getDesigners_,
    getDesigner: getDesigner_,
    getReviews: getReviews_,
    getDesignerPreviews: getDesignerPreviews_,
    createDesigner: createDesigner_,
    deleteDesigner: deleteDesigner_,
    updateInfo: updateInfo_
} = require('../database/designers');
const {
    getUsersInfo
} = require('../helper/vk');

async function getDesigners(req, res) {
    let result = await getDesigners_();

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(204);
}

async function getDesigner({ params: { id } }, res) {
    let result = await getDesigner_(id);

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(204);
}

async function getReviews({ params: { id } }, res) {
    let result = await getReviews_(id);

    if (result.isSuccess) {
        let users;

        if (result.reviews.length > 0)
            users = result.reviews.map(el => el.user_vk_id);

        if (users !== undefined) {
            let _users = await getUsersInfo(users.join(','));

            if (_users.isSuccess) {
                _users = _users.users;

                result.reviews.map(element => {
                    let finded = _users.find(el => element.user_vk_id == el.id);
                    delete element.user_vk_id;
                    element.user = {
                        vk_id: finded.id,
                        first_name: finded.first_name,
                        last_name: finded.last_name,
                        photo: finded.photo_max
                    };
                });
            }
        }

        res.json(result);
        return;
    }

    res.sendStatus(204);
}

async function getDesignerPreviews({ params: { id } }, res) {
    let result = await getDesignerPreviews_(id);

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(520);
}

async function createDesigner({ body: { vk_id }, session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await createDesigner_(
            vk_id
        )

        if (result.isSuccess) {
            res.json(result);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

async function deleteDesigner({ body: { id }, session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await deleteDesigner_(id);

        if (result.isSuccess) {
            res.sendStatus(204);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

async function updateInfo({ params: { id }, body: { bio }, session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await updateInfo_(id, bio);

        if (result.isSuccess) {
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

    router.get('/', getDesigners);
    router.get('/:id', getDesigner);
    router.get('/:id/reviews', getReviews);
    router.get('/:id/previews', getDesignerPreviews);

    router.post('/', createDesigner);

    router.delete('/', deleteDesigner);

    router.put('/:id', updateInfo);

    return router;
}

module.exports = index();