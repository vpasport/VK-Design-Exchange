"use strict";

const multer = require('multer');
const { v4: uuid } = require('uuid');
const { promises: { writeFile } } = require('fs');

const { Router } = require('express');
const {
    getAllPreviews: getAllPreviews_,
    getWork: getWork_,
    createWork: createWork_
} = require('../database/portfolio');

async function getAllPreviews(req, res) {
    let result = await getAllPreviews_();

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(204);
}

async function getWork({ params: { id } }, res) {
    let result = await getWork_(
        id
    );

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

function index() {
    const upload = multer();

    const router = new Router();

    router.get('/previews', getAllPreviews);
    router.get('/work/:id', getWork);

    router.post('/work', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'preview', maxCount: 1 }]), createWork);

    return router;
}

module.exports = index();