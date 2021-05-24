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
    addImages: _addImages,
    addImage: addImage_,
    addTags: addTags_,
    addLike: addLike_,
    addComment: addComment_,
    deleteWork: deleteWork_,
    deleteComment: deleteComment_,
    updateTags: updateTags_,
    updateDescription: updateDescription_,
    updatePreviewPaths: updatePreviewPaths_,
    deleteImage: deleteImage_,
} = require('../database/portfolio');
const {
    checkSign
} = require('../helper/vk');

async function getPreviews({ query: { from, to, from_id, tags, sort_by, direction } }, res) {
    if (tags !== undefined) tags = tags.split(',')

    let result;

    if (from === undefined && to === undefined) {
        result = await getAllPreviews_();
        from = 0;
        to = 20
    }

    if (tags === undefined) {
        result = await getPreviewsFromTo_(from, to, from_id, sort_by, direction);
    } else {
        result = await getPreviewsTags_(from, to, from_id, tags, sort_by, direction)
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

async function createWork({ file, body, session }, res) {
    if (session.role !== undefined &&
        (session.role.indexOf('admin') !== -1 || (session.role.indexOf('designer') !== -1 && body.designer_id == session.user.did))) {

        if (!file) {
            res.sendStatus(520);
            return;
        }

        if (!['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(file.mimetype) || file.size >= 5_242_880) {
            res.sendStatus(422);
            return;
        }

        let image = file;


        let originalname = file.originalname;
        image.name = `uploads/previews/${uuid()}.${originalname.slice(originalname.lastIndexOf(".") + 1, originalname.length)}`

        let result = await createWork_(
            body.title,
            image.name,
            body.project_description,
            body.designer_id,
            body.tag_ids.split(',')
        )

        if (result.isSuccess) {
            await writeFile(`static/${image.name}`, image.buffer);

            res.json(result);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

async function addImages({ files, body, params: { id }, session }, res) {
    if (session.role !== undefined &&
        (session.role.indexOf('admin') !== -1 || (session.role.indexOf('designer') !== -1 && body.designer_id == session.user.did))) {
        let portfolio = await getDesignerByPortfolio_(id);

        if (portfolio.isSuccess && (session.role.indexOf('admin') !== -1 || portfolio.designer === session.user.did)) {
            if (!files || files.length === 0 || files.length > 15) {
                res.sendStatus(422);
                return;
            }

            const images = [];

            for (const { size, originalname, mimetype } of files) {
                const ext = originalname.slice(originalname.lastIndexOf(".") + 1, originalname.length);

                if (size >= 1024 * 1024 * 15 || !['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(mimetype)) {
                    res.sendStatus(422);
                    return;
                }

                images.push(`uploads/works/${uuid()}.${ext}`);
            }

            let result = await _addImages(images, id);

            if (result.isSuccess) {
                for (const [i, imageName] of Object.entries(images)) {
                    await writeFile(`static/${imageName}`, files[parseInt(i)].buffer);
                }

                res.sendStatus(204);
                return;
            }

            res.sendStatus(422);
            return;
        }

        res.sendStatus(403);
        return;
    }

    res.sendStatus(401);
}

async function addImage({ file, session, params: { id }, body: { position } }, res) {
    if (session.role !== undefined) {
        let designer = await getDesignerByPortfolio_(id);
        if (designer.isSuccess) {
            if (session.role.indexOf('admin') !== -1 || (session.role.indexOf('designer') !== -1 && designer.designer === session.user.did)) {
                if (!file) {
                    res.sendStatus(422);
                    return;
                }

                const ext = file.originalname.slice(file.originalname.lastIndexOf(".") + 1, file.originalname.length);

                if (file.size >= 1024 * 1024 * 15 || !['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(file.mimetype)) {
                    res.sendStatus(422);
                    return;
                }

                let name = `uploads/works/${uuid()}.${ext}`;

                let result = await addImage_(id, name, position);

                if (result.isSuccess) {
                    await writeFile(`static/${name}`, file.buffer);

                    res.sendStatus(204);
                    return;
                }

                res.sendStatus(422);
                return;
            }
            res.sendStatus(520);
            return;
        }
        res.sendStatus(403);
        return;
    }
    res.sendStatus(410);
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
        if (text.length === 0) {
            res.sendStatus(400);
            return;
        }

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

async function updatePreview({ params: { id }, file, session }, res) {
    if (session.role !== undefined) {
        let designer = await getDesignerByPortfolio_(id);
        if (designer.isSuccess) {
            if (session.role.indexOf('admin') !== -1 || (session.role.indexOf('designer') !== -1 && designer.designer === session.user.did)) {
                try {
                    if (!file) {
                        res.sendStatus(520);
                        return;
                    }

                    let { imageNames } = await getImagesNames_(id);
                    file.name = imageNames.preview;

                    if (!['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(file.mimetype) || file.size >= 5_242_880) {
                        res.sendStatus(422);
                        return;
                    }

                    let originalname = file.originalname;
                    file.newName = `${file.name.slice(0, file.name.lastIndexOf('.'))}.${originalname.slice(originalname.lastIndexOf(".") + 1, originalname.length)}`

                    let update = await updatePreviewPaths_(id, file.newName)

                    if (update.isSuccess) {
                        await rename(`static/${file.name}`, `static/${file.newName}`);
                        await writeFile(`static/${file.newName}`, file.buffer);

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
                    result.imgs.map(async el => {
                        try {
                            await unlink(`static/${el}`);
                        } catch (e) {
                            console.error(e);
                        }
                    });

                    res.sendStatus(204);
                    return;
                }
            }
        } else {
            if (session.role.indexOf('admin') !== -1) {
                let result = await deleteWork_(id);

                if (result.isSuccess) {
                    result.imgs.map(async el => {
                        try {
                            await unlink(`static/${el}`);
                        } catch (e) {
                            console.error(e);
                        }
                    });

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

async function deleteImage({ params: { id, position }, session }, res) {
    if (session.role !== undefined) {
        let designer = await getDesignerByPortfolio_(id);
        if (designer.isSuccess) {
            if (session.role.indexOf('admin') !== -1 || (session.role.indexOf('designer') !== -1 && designer.designer === session.user.did)) {
                let result = await deleteImage_(id, position);

                if (result.isSuccess) {
                    await unlink(`static/${result.path}`);

                    res.sendStatus(204);
                    return;
                }

                res.sendStatus(520);
                return;
            }
        }
        res.sendStatus(403);
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

    router.post('/work', upload.single('preview'), createWork);
    router.post('/work/:id/images', upload.array('images', 15), addImages);
    router.post('/work/:id/image', upload.single('image'), addImage);
    router.post('/tags', addTags);
    router.post('/work/:id/likes', addLike);
    router.post('/work/:id/comment', addComment);

    router.put('/:id/tags', updateTags);
    router.put('/:id/description', updateDescription);
    router.put('/:id/preview', upload.single('preview'), updatePreview);

    router.delete('/work', deleteWork);
    router.delete('/comment', deleteComment);
    router.delete('/work/:id/image/:position', deleteImage);

    return router;
}

module.exports = index();