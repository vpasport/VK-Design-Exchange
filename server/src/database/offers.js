"use strict";

const pool = require('./pg/pool').getPool();

async function getOffers(from, to) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let params = [];
        let offset = '';
        let limit = '';

        if (from !== undefined) {
            params.push(from);
            offset = `offset $${params.length}`;
        }
        if (to !== undefined) {
            params.push(to);
            limit = `limit $${params.length}`;
        }

        let offers = (await client.query(
            `select *, count( 1 ) over ()::int
                from offers
            order by id desc
            ${offset}
            ${limit}`,
            [...params]
        )).rows;

        let count = 0;
        if (offers.length > 0) {
            count = offers[0].count;
            offers.forEach(element => delete element.count);
        }

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            count,
            offers
        }

    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function getOffer(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let offer = (await client.query(
            `select * 
                from offers as o
            where
                o.id = $1`,
            [id]
        )).rows[0];

        let user = (await client.query(
            `select d.vk_id, d.first_name, d.last_name, d.id, d.photo, d.rating
                from designers as d, designers_offers as fo
            where 
                fo.offer_id = $1 and d.id = fo.designer_id`,
            [id]
        )).rows[0];

        if (offer !== undefined) {
            await client.query('commit');
            client.release();

            if (user !== undefined) {
                user.rating = Number(user.rating);
                offer.author = user;
            }

            return {
                isSuccess: true,
                offer
            }
        }

        throw 'Offer not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.log(e);

        return {
            isSuccess: false
        }
    }
}

async function getDesignerByOffer(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let designer = (await client.query(
            `select designer_id
                from designers_offers as fo
            where	
                fo.offer_id = $1`,
            [id]
        )).rows[0];

        if (designer !== undefined) {
            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                designer: designer.designer_id
            }
        }

        throw 'Offer not found'

    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function getPreviewName(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let previewName = (await client.query(
            `select preview
                from offers
            where
                id = $1`,
            [id]
        )).rows[0];

        if (previewName !== undefined) {
            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                previewName: previewName.preview
            }
        }

        throw 'Offer not found';

    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function createOffer(designerId, preview, title, pirce, description) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let id = (await client.query(
            `insert into
                offers (title, preview, price, description)
            values
                ($1, $2, $3, $4)
            returning id`,
            [title, preview, pirce, description]
        )).rows[0].id;

        if (id !== undefined) {
            let dfId = (await client.query(
                `insert into
                    designers_offers (designer_id, offer_id)
                values
                    ($1, $2)
                returning id`,
                [designerId, id]
            )).rows[0].id;

            if (dfId !== undefined) {
                await client.query('commit');
                client.release();

                return {
                    isSuccess: true,
                    id
                }
            }

            throw 'Error when adding offer to designer';
        }

        throw 'Error while creating offer';

    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function updateDescription(id, title, description, price) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `update offers
                set title = $1, description = $2, price = $3
            where
                id = $4`,
            [title, description, price, id]
        );

        await client.query('commit');
        client.release();

        return {
            isSuccess: true
        }

    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function updatePreviewPath(id, preview) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `update offers
                set preview = $1
            where
                id = $2`,
            [preview, id]
        )

        await client.query('commit');
        client.release();

        return {
            isSuccess: true
        }
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function deleteOffer(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let preview = (await client.query(
            `select preview
                from offers
            where
                id = $1`,
            [id]
        )).rows[0];

        if (preview !== undefined) {
            await client.query(
                `delete from offers
                where
                    id = $1`,
                [id]
            );

            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                preview: preview.preview
            }
        }

        throw 'Offer not found';

    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

module.exports = {
    getOffers,
    getOffer,
    getDesignerByOffer,
    getPreviewName,
    createOffer,
    updateDescription,
    updatePreviewPath,
    deleteOffer
}