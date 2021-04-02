"use strict";

const { Router } = require('express');
const {
    getDesigners: getDesigners_,
    getDesigner: getDesigner_,
    getReviews: getReviews_,
    getDesignerPreviews: getDesignerPreviews_,
    getOrders: getOrders_,
    createDesigner: createDesigner_,
    deleteDesigner: deleteDesigner_,
    updateInfo: updateInfo_,
    updateEngaged: updateEngaged_,
    getDesignerOffers: getDesignerOffers_
} = require('../database/designers');
const {
    getUsersInfo
} = require('../helper/vk');

async function getDesigners({ query: { from, to } }, res) {
    let result = await getDesigners_(from, to);

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(520);
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

async function getDesignerPreviews({ params: { id }, query: { from, to } }, res) {
    let result = await getDesignerPreviews_(id, from, to);

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(520);
}

async function getDesignerOffers({ params: { id }, query: { from, to }, session }, res) {
    let result = await getDesignerOffers_(id, from, to);

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(520);
}

async function getOrders({ params: { id }, query: { from, to }, session }, res) {
    if (session.role !== undefined) {
        if (session.role.indexOf('designer') !== -1 && Number(id) === session.user.did) {
            let result = await getOrders_(id, from, to);

            if (result.isSuccess) {
                res.json(result);
                return;
            }

            res.sendStatus(520);
            return;
        }
    }

    res.sendStatus(401);
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
    if (session.role !== undefined &&
        (session.role.indexOf('admin') !== -1 || (session.role.indexOf('designer') !== -1 && session.user.did === Number(id)))) {
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

async function updateEngaged({ body: { engaged }, params: { id }, session }, res) {
    if (session.role !== undefined &&
        (session.role.indexOf('admin') !== -1 || (session.role.indexOf('designer') !== -1 && session.user.did === Number(id)))) {
        let result = await updateEngaged_(id, engaged);

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
    router.get('/:id/offers', getDesignerOffers);
    router.get('/:id/orders', getOrders);

    router.post('/', createDesigner);

    router.delete('/', deleteDesigner);

    router.put('/:id', updateInfo);
    router.put('/:id/engaged', updateEngaged);

    return router;
}

module.exports = index();