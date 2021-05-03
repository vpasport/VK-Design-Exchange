"use strict";

const multer = require('multer');
const { v4: uuid } = require('uuid');
const { promises: {
    writeFile,
    rename,
    unlink
} } = require('fs');

const { Router } = require('express');
const {
    getAllPreviews: getAllPreviews_,
    getPreviewsFromTo: getPreviewsFromTo_,
    getPreviewsTags: getPreviewsTags_,
    getWork: getWork_,
    getWorkViews: getWorkViews_,
    getWorkComments: getWorkComments_,
    getImagesNames: getImagesNames_,
    getDesignerByPortfolio: getDesignerByPortfolio_,
    createWork: createWork_,
    addTags: addTags_,
    addLike: addLike_,
    addComment: addComment_,
    deleteWork: deleteWork_,
    deleteComment: deleteComment_,
    updateTags: updateTags_,
    updateDescription: updateDescription_,
    updateImagePaths: updateImagePaths_
} = require('../database/portfolio');
const {
    checkSign
} = require('../helper/vk');

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

async function getWork({ params: { id }, query: { vk_id }, session }, res) {
    let result;

    if (session.role !== undefined && session.role.indexOf('adimn') !== -1) {
        result = await getWork_(
            id, true
        );
    } else {
        result = await getWork_(
            id, false, vk_id
        );
    }

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(520);
}

async function getWorkViews({ params: { id } }, res) {
    let result = await getWorkViews_(id);

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(520);
}

async function getWorkComments({
    params: { id },
    query: { from, to, from_id, all }
}, res) {
    let result = await getWorkComments_(id, from, to, from_id, all);

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(520);
}

async function createWork({ files, body, session }, res) {
    if (session.role !== undefined &&
        (session.role.indexOf('admin') !== -1 || (session.role.indexOf('designer') !== -1 && body.designer_id == session.user.did))) {
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
            body.project_description,
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

async function addLike({ params: { id }, body: { url_params, vk_id } }, res) {
    let result;

    let params = JSON.parse('{"' + decodeURI(url_params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

    if (checkSign(params)) {
        result = await addLike_(id, vk_id);

        if (result.isSuccess) {
            res.json(result);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

async function addComment({ params: { id }, body: { url_params, text, vk_id } }, res) {
    let result;

    let params = JSON.parse('{"' + decodeURI(url_params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

    if (checkSign(params)) {
        result = await addComment_(id, text, vk_id);

        if (result.isSuccess) {
            res.json(result);
            return;
        }

        res.sendStatus(403);
        return;
    }

    res.sendStatus(401);
}

async function updateTags({ params: { id }, body: { tag_ids }, session }, res) {
    if (session.role !== undefined) {
        let designer = await getDesignerByPortfolio_(id);
        if (designer.isSuccess) {
            if (session.role.indexOf('admin') !== -1 || (session.role.indexOf('designer') !== -1 && designer.designer === session.user.did)) {
                let result = await updateTags_(id, tag_ids);

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

async function updateDescription({
    params: { id },
    body: { title, project_description },
    session
}, res) {
    if (session.role !== undefined) {
        let designer = await getDesignerByPortfolio_(id);
        if (designer.isSuccess) {
            if (session.role.indexOf('admin') !== -1 || (session.role.indexOf('designer') !== -1 && designer.designer === session.user.did)) {
                let result = await updateDescription_(
                    id, title, project_description
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

async function updateImages({ params: { id }, files, session }, res) {
    if (session.role !== undefined) {
        let designer = await getDesignerByPortfolio_(id);
        if (designer.isSuccess) {
            if (session.role.indexOf('admin') !== -1 || (session.role.indexOf('designer') !== -1 && designer.designer === session.user.did)) {
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

async function deleteWork({ body: { id }, session }, res) {
    if (session.role !== undefined) {
        let designer = await getDesignerByPortfolio_(id);
        if (designer.isSuccess) {
            if (session.role.indexOf('admin') !== -1 || (session.role.indexOf('designer') !== -1 && designer.designer === session.user.did)) {
                let result = await deleteWork_(id);

                if (result.isSuccess) {
                    await unlink(`static/${result.images.preview}`);
                    await unlink(`static/${result.images.work_image}`);

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

async function deleteComment({ body: { id }, session }, res) {
    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        let result = await deleteComment_(id);

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
    router.get('/work/:id/views', getWorkViews);
    router.get('/work/:id/comments', getWorkComments);

    router.post('/work', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'preview', maxCount: 1 }]), createWork);
    router.post('/tags', addTags);
    router.post('/work/:id/likes', addLike);
    router.post('/work/:id/comment', addComment);

    router.put('/:id/tags', updateTags);
    router.put('/:id/description', updateDescription);
    router.put('/:id/images', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'preview', maxCount: 1 }]), updateImages);

    router.delete('/work', deleteWork);
    router.delete('/comment', deleteComment);

    return router;
}

module.exports = index();