"use strict";

const { Router } = require('express');
const {
    getDesigners: getDesigners_,
    getDesigner: getDesigner_,
    getReviews: getReviews_,
    getDesignerPreviews: getDesignerPreviews_,
    createDesigner: createDesigner_,
    deleteDesigner: deleteDesigner_
} = require('../database/designers');

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
    if(session.role !== undefined && session.role.indexOf('admin') !== -1){
        let result = await createDesigner_(
            vk_id
        )

        if(result.isSuccess){
            res.json(result);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(403);
}

async function deleteDesigner({body: {id}, session}, res){
    if(session.role !== undefined && session.role.indexOf('admin') !== -1){
        let result = await deleteDesigner_(id);
    }
    
    res.sendStatus(204);
}

function index() {
    const router = new Router();

    router.get('/', getDesigners);
    router.get('/:id', getDesigner);
    router.get('/:id/reviews', getReviews);
    router.get('/:id/previews', getDesignerPreviews);

    router.post('/', createDesigner);

    router.delete('/', deleteDesigner);

    return router;
}

module.exports = index();