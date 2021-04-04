"use strict";

const multer = require('multer');
const { v4: uuid } = require('uuid');
const { promises: {
    writeFile,
    unlink
} } = require('fs');

const { Router } = require('express');
const {
    getOfferByOrder: getOfferByOrder_,
    create: create_,
    deleteReview: deleteReview_
} = require('../database/reviews');
const {
    getOrder: getOrder_
} = require('../database/orders');
const { checkSign } = require('../helper/vk');

async function create({ body: { url_params, order_id, rating, text }, files: { image } }, res) {
    let params = JSON.parse('{"' + decodeURI(url_params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

    if (checkSign(params)) {
        let order = await getOrder_(order_id);

        if (order.isSuccess) {
            if (order.order.status !== 5) {
                res.sendStatus(403);
                return;
            }
        }

        let user_vk_id = Number(params.vk_user_id);
        let result;

        if (image === undefined) {
            let offer = await getOfferByOrder_(order_id);

            if (offer.isSuccess) {
                image = offer.offer.preview;
            } else {
                res.sendStatus(520);
                return;
            }

            result = await create_(
                order_id,
                rating,
                text,
                user_vk_id,
                image
            )

            if (result.isSuccess) {
                res.json(result);
                return;
            }
        } else {
            image = image[0];

            if (!['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(image.mimetype) || image.size >= 5242880) {
                res.sendStatus(422);
                return;
            }

            const originalname = image.originalname;
            image.name = `uploads/reviews/${uuid()}.${originalname.slice(originalname.lastIndexOf(".") + 1, originalname.length)}`;

            result = await create_(
                order_id,
                rating,
                text,
                user_vk_id,
                image.name
            )

            if (result.isSuccess) {
                await writeFile(`static/${image.name}`, image.buffer);

                res.json(result);
                return;
            }
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

async function deleteReview({ params: { id }, session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await deleteReview_(id);

        if (result.isSuccess) {
            if (result.image.indexOf('reviews') !== -1) {
                await unlink(`static/${result.image}`);
            }

            res.json(result);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

function index() {
    const upload = multer();

    const router = new Router();

    router.post('/', upload.fields([{ name: 'image', maxCount: 1 }]), create);

    router.delete('/:id', deleteReview);

    return router;
}

module.exports = index();