"use strict";

const pool = require('./pg/pool').getPool();
const {
    getUserInfo
} = require('../helper/vk')

async function getDesigners() {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let designers = (await client.query(
            `select d.id, d.vk_id, d.rating, d.first_name, d.last_name, d.photo
                from designers as d`
        )).rows;

        await client.query('commit');
        client.release();

        designers.forEach(element => element.rating = Number(element.rating));

        return {
            isSuccess: true,
            designers
        }
    } catch (e) {
        await client.query('rollback');
        client.release();

        return {
            isSuccess: false
        }
    }
}

async function getDesigner(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let designer = (await client.query(
            `select d.id, d.vk_id, d.rating, d.bio, d.photo, d.first_name, d.last_name
                from designers as d
            where id = $1`,
            [id]
        )).rows[0];

        if (designer !== undefined) {
            await client.query('commit');
            client.release();

            designer.rating = Number(designer.rating);

            return {
                isSuccess: true,
                designer
            }
        }

        throw 'Designer not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.log(e)

        return {
            isSuccess: false
        }
    }
}

async function getReviews(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let reviews = (await client.query(
            `select * 
                from reviews
            where
                id = any((
                    select rd.review_id
                        from reviews_designers as rd
                    where
                        rd.designer_id = $1
                ))`,
            [id]
        )).rows;

        if (reviews !== undefined) {
            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                reviews
            }
        }

        throw 'reviews not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        return {
            isSuccess: false
        }
    }
}

async function getDesignerPreviews(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let previews = (await client.query(
            `select p.id, p.title, p.preview, p.description
                from portfolio as p, designers_portfolios as dp
            where 
                p.id = dp.portfolio_id and dp.designer_id = $1`,
            [id]
        )).rows;

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            previews
        }
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e)

        return {
            isSuccess: false
        }
    }
}

async function createDesigner(vk_id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        if (vk_id.includes('https')) {
            vk_id = vk_id.match(/https?:\/\/.*\/(.*)\/?/)[1];
        }

        let designer = await getUserInfo(vk_id);

        if (!designer.isSuccess) throw 'vk user not found';

        let designer_ = (await client.query(
            `select d.id
                from designers as d
            where
                d.vk_id = $1`,
            [designer.user.id]
        )).rows[0];

        if (designer_ !== undefined) throw 'user with the same name alredy exists';


        designer = (await client.query(
            `insert into designers
                (vk_id, first_name, last_name, photo)
            values
                ($1, $2, $3, $4)
            returning id`,
            [designer.user.id, designer.user.first_name, designer.user.last_name, designer.user.photo_max]
        )).rows[0].id;

        if (designer !== undefined) {
            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                id: designer
            }
        }

        throw 'Failed to create designer';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function deleteDesigner(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `delete from designers
            where
                id = $1`,
            [id]
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

async function updateInfo(id, bio){
    const client = await pool.connect();
    await client.query('begin');

    try {
        let designer = (await client.query(
            `update designers
                set bio = $1
            where
                id = $2`,
            [bio, id]
        ));

        await client.query('commit');
        client.release();

        return {
            isSuccess: true
        }

    } catch (e){
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

module.exports = {
    getDesigners,
    getDesigner,
    getReviews,
    getDesignerPreviews,
    createDesigner,
    deleteDesigner,
    updateInfo
}