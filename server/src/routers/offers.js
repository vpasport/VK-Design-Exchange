"use strict";

const { Router } = require('express');

const multer = require('multer');
const { v4: uuid } = require('uuid');
const { promises: {
    writeFile,
    rename,
    unlink
} } = require('fs');

const {
    getOffers: getOffers_,
    getOffer: getOffer_,
    getDesignerByOffer: getDesignerByOffer_,
    getPreviewName: getPreviewName_,
    createOffer: createOffer_,
    updateDescription: updateDescription_,
    updatePreviewPath: updatePreviewPath_,
    deleteOffer: deleteOffer_
} = require('../database/offers');

async function getOffers({ query: { from, to }, session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await getOffers_(from, to);

        if (result.isSuccess) {
            res.json(result);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

async function getOffer({ params: { id } }, res) {
    let result = await getOffer_(id);

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(520);
}

async function createOffer({ files: { preview }, body: { title, price, description, designer_id }, params: { id }, session }, res) {
    if (session.role !== undefined &&
        (session.role.indexOf('admin') !== -1 || (session.role.indexOf('designer') !== -1 && designer_id == session.user.did))
    ) {

        if (preview === undefined) {
            res.sendStatus(520);
            return;
        }

        preview = preview[0];

        if (!['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(preview.mimetype) || preview.size >= 5242880) {
            res.sendStatus(422);
            return;
        }

        const originalname = preview.originalname;
        preview.name = `uploads/offers/${uuid()}.${originalname.slice(originalname.lastIndexOf(".") + 1, originalname.length)}`;

        let result = await createOffer_(
            designer_id,
            preview.name,
            title,
            price,
            description
        );

        if (result.isSuccess) {
            await writeFile(`static/${preview.name}`, preview.buffer);

            res.json(result);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

async function updateDescription({ params: { id }, body: { title, description, price }, session }, res) {
    if (session.role !== undefined) {
        let designer = await getDesignerByOffer_(id);
        if (designer.isSuccess) {
            if (session.role.indexOf('admin') !== -1 || (session.role.indexOf('designer') !== -1 && designer.designer === session.user.did)) {
                let result = await updateDescription_(
                    id, title, description, price
                );

                if (result.isSuccess) {
                    res.sendStatus(204);
                    return;
                }
            }
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

async function updatePreview({ params: { id }, files: { preview }, session }, res) {
    if (session.role !== undefined) {
        let designer = await getDesignerByOffer_(id);
        if (designer.isSuccess) {
            if (session.role.indexOf('admin') !== -1 || (session.role.indexOf('designer') !== -1 && designer.designer === session.user.did)) {
                try {
                    preview = preview[0];

                    if (preview === undefined) {
                        res.sendStatus(520);
                        return;
                    }

                    let { previewName } = await getPreviewName_(id);

                    if (!['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(preview.mimetype) || preview.size >= 5242880) {
                        res.sendStatus(422);
                        return;
                    }

                    let originalname = preview.originalname;

                    preview.newName = `${previewName.slice(0, previewName.lastIndexOf('.'))}.${originalname.slice(originalname.lastIndexOf(".") + 1, originalname.length)}`;

                    let update = await updatePreviewPath_(id, preview.newName);

                    if (update.isSuccess) {
                        await rename(`static/${previewName}`, `static/${preview.newName}`);
                        await writeFile(`static/${preview.newName}`, preview.buffer);

                        res.sendStatus(204);
                        return;
                    }
                } catch (e) {
                    console.error(e);

                    res.sendStatus(520);
                    return;
                }
            }
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

async function deleteOffer({ body: { id }, session }, res) {
    if (session.role !== undefined) {
        let designer = await getDesignerByOffer_(id);
        if (designer.isSuccess) {
            if (session.role.indexOf('admin') !== -1 || (session.role.indexOf('designer') !== -1 && designer.designer === session.user.did)) {
                let result = await deleteOffer_(id);

                if (result.isSuccess) {
                    await unlink(`static/${result.preview}`);

                    res.sendStatus(204);
                    return;
                }
            }
        }

        res.sendStatus(520);
        return
    }

    res.sendStatus(401);
}

function index() {
    const router = new Router;

    const upload = multer();

    router.get('/', getOffers);
    router.get('/:id', getOffer);

    router.post('/', upload.fields([{ name: 'preview', maxCount: 1 }]), createOffer);

    router.put('/:id/description', updateDescription);
    router.put('/:id/preview', upload.fields([{ name: 'preview', maxCount: 1 }]), updatePreview);

    router.delete('/', deleteOffer);

    return router;
}

module.exports = index()