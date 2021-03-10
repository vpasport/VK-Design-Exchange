"use strict";

const { Router } = require('express');
const {
    getDesigners: getDesigners_,
    getDesigner: getDesigner_,
    getReviews: getReviews_
} = require('../database/designers');

async function getDesigners(req, res){
    let result = await getDesigners_();

    if(result.isSuccess){
        res.json(result);
        return;
    }

    res.sendStatus(204);
}

async function getDesigner({params: {id}}, res){
    let result = await getDesigner_(id);

    if(result.isSuccess){
        res.json(result);
        return;
    }

    res.sendStatus(204);
}

async function getReviews({params: {id}}, res){
    let result = await getReviews_(id);

    if(result.isSuccess){
        res.json(result);
        return;
    }

    res.sendStatus(204);
}

function index(){
    const router = new Router();

    router.get('/', getDesigners);
    router.get('/:id', getDesigner);
    router.get('/:id/reviews', getReviews);

    return router;
}

module.exports = index();