"use strict";

const { Router } = require('express');
const {
    create: create_,
    deleteReview: deleteReview_
} = require('../database/reviews');

async function create({ body: { designer_vk_id, rating, text, user_vk_id } }, res) {
    let result = await create_(
        designer_vk_id,
        rating,
        text,
        user_vk_id
    )

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(204);
}

async function deleteReview({params:{id}}, res){
    let result = await deleteReview_(id);

    if(result.isSuccess){
        res.json(result);
        return;
    }

    res.sendStatus(204);
}

function index() {
    const router = new Router();

    router.post('/', create);

    router.delete('/:id', deleteReview);

    return router;
}

module.exports = index();