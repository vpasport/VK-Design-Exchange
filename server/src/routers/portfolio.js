"use strict";

const multer = require('multer');
const { v4: uuid } = require('uuid');
const { promises: { writeFile, rename } } = require('fs');

const { Router } = require('express');
const {
    getAllPreviews: getAllPreviews_,
    getPreviewsFromTo: getPreviewsFromTo_,
    getPreviewsTags: getPreviewsTags_,
    getWork: getWork_,
    getImagesNames: getImagesNames_,
    createWork: createWork_,
    addTags: addTags_,
    deleteWork: deleteWork_,
    updateTags: updateTags_,
    updateDescription: updateDescription_,
    updateImagePaths: updateImagePaths_
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

    if (session.role !== undefined && session.role.indexOf('adimn') !== -1) {
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

    res.sendStatus(520);
}

async function createWork({ files, body, session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        if (files.preview === undefined || files.image === undefined) {
            res.sendStatus(520);
            return;
        }

        let images = [
            { type: 'previews', file: files.preview[0] },
            { type: 'works', file: files.image[0] }
        ];

        for (const image of images) {
            if (!['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(image.file.mimetype) || image.file.size >= 20971520) {
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
            images[1].name,
            body.designer_id,
            body.tag_ids.split(',')
        )

        if (result.isSuccess) {
            for (const image of images) {
                await writeFile(`static/${image.name}`, image.file.buffer);
            }

            res.json(result);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
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

async function updateTags({ params: { id }, body: { tag_ids }, session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await updateTags_(id, tag_ids);

        if (result.isSuccess) {
            res.sendStatus(204);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

async function updateDescription({
    params: { id },
    body: { title, description, project_description, task_description, completed_work },
    session
}, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await updateDescription_(
            id, title, description, project_description, task_description, completed_work
        );

        if (result.isSuccess) {
            res.sendStatus(204);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

async function updateImages({ params: { id }, files, session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        try {
            if (files.preview === undefined && files.image === undefined) {
                res.sendStatus(520);
                return;
            }

            let { imageNames } = await getImagesNames_(id);

            let images = [];

            if (files.preview !== undefined) {
                images.push({
                    type: 'preview',
                    name: imageNames.preview,
                    file: files.preview[0]
                })
            }
            if (files.image !== undefined) {
                images.push({
                    type: 'work',
                    name: imageNames.work_image,
                    file: files.image[0]
                })
            }

            let preview = undefined;
            let work_image = undefined;

            for (const image of images) {
                if (!['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(image.file.mimetype) || image.file.size >= 20971520) {
                    res.sendStatus(422);
                    return;
                }

                let originalname = image.file.originalname;
                image.newName = `${image.name.slice(0, image.name.lastIndexOf('.'))}.${originalname.slice(originalname.lastIndexOf(".") + 1, originalname.length)}`

                if (image.type === 'preview') preview = image.newName;
                if (image.type === 'work') work_image = image.newName;
            }

            let update = await updateImagePaths_(id, preview, work_image)

            if (update.isSuccess) {
                for (const image of images) {
                    await rename(`static/${image.name}`, `static/${image.newName}`);
                    await writeFile(`static/${image.newName}`, image.file.buffer);
                }
            }

            res.sendStatus(204);
            return;
        } catch (e) {
            console.error(e);

            res.sendStatus(520);
            return;
        }
    }

    res.sendStatus(401);
}

async function deleteWork({ body: { id }, session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {

        let result = await deleteWork_(id);

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
    const upload = multer();

    const router = new Router();

    router.get('/previews', getPreviews);
    router.get('/work/:id', getWork);

    router.post('/work', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'preview', maxCount: 1 }]), createWork);
    router.post('/tags', addTags);

    router.put('/:id/tags', updateTags);
    router.put('/:id/description', updateDescription);
    router.put('/:id/images', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'preview', maxCount: 1 }]), updateImages);

    router.delete('/work', deleteWork);

    return router;
}

module.exports = index();