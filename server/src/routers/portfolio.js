"use strict";

const multer = require('multer');
const { v4: uuid } = require('uuid');
const { promises: { writeFile } } = require('fs');

const { Router } = require('express');
const {
    getAllPreviews: getAllPreviews_,
    getPreviewsFromTo: getPreviewsFromTo_,
    getPreviewsTags: getPreviewsTags_,
    getWork: getWork_,
    createWork: createWork_,
    addTags: addTags_
} = require('../database/portfolio');

async function getPreviews({ query: { from, to, from_id, tags } }, res) {
    if (tags !== undefined) tags = tags.split(',')

    let result;

    if (from === undefined && to === undefined) {
        result = await getAllPreviews_();
        from = 0;
        to = 20
    }

    if (tags === undefined) {
        result = await getPreviewsFromTo_(from, to, from_id);
    } else {
        result = await getPreviewsTags_(from, to, from_id, tags)
    }

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.status(500).json(result);
}

async function getWork({ params: { id }, session }, res) {
    let result;

    if ( session.role !== undefined && session.role.indexOf('adimn') !== -1) {
        result = await getWork_(
            id, true
        );
    } else {
        result = await getWork_(
            id, false
        );
    }

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(204);
}

async function createWork({ files, body }, res) {
    if (files.preview === undefined || files.image === undefined) {
        res.sendStatus(204);
        return;
    }

    let images = [
        { type: 'previews', file: files.preview[0] },
        { type: 'works', file: files.image[0] }
    ];

    for (const image of images) {
        if (!['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(image.file.mimetype) && image.file.size >= 20971520) {
            res.sendStatus(422);
            return;
        }

        let originalname = image.file.originalname;
        image.name = `uploads/${image.type}/${uuid()}.${originalname.slice(originalname.lastIndexOf(".") + 1, originalname.length)}`
    }

    let result = await createWork_(
        body.title,
        images[0].name,
        body.description,
        body.project_description,
        body.task_description,
        body.completed_work,
        images[1].name
    )

    if (result.isSuccess) {
        for (const image of images) {
            await writeFile(`static/${image.name}`, image.file.buffer);
        }

        res.json({
            result
        });

        return;
    }

    res.sendStatus(500);
}

async function addTags({ body: { portfolio_id, tag_ids } }, res) {
    let result = await addTags_(
        portfolio_id, tag_ids
    )

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(204);
}

function index() {
    const upload = multer();

    const router = new Router();

    router.get('/previews', getPreviews);
    router.get('/work/:id', getWork);

    router.post('/work', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'preview', maxCount: 1 }]), createWork);
    router.post('/tags', addTags);

    return router;
}

module.exports = index();