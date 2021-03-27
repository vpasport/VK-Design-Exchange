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

async function getDesigner(id, vk_id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let params = [];
        let where = '';

        if (id !== undefined) {
            params.push(id);
            where = `id = $${params.length}`;
        }
        if (vk_id !== undefined) {
            params.push(id);
            where = `vk_id = $${params.length}`;
        }

        let designer = (await client.query(
            `select d.id, d.vk_id, d.rating, d.bio, d.photo, d.first_name, d.last_name, d.engaged
                from designers as d
            where 
                ${where}`,
            [...params]
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

            reviews.forEach(element => element.rating = Number(element.rating));

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

async function getDesignerPreviews(id, from, to) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let params = [id];
        if (from !== undefined) params.push(from);
        if (to !== undefined) params.push(to - from);

        let previews = (await client.query(
            `select p.id, p.title, p.preview, count( 1 ) over ()::int
                from portfolio as p, designers_portfolios as dp
            where 
                p.id = dp.portfolio_id and dp.designer_id = $1
            order by p.id desc
            ${from !== undefined ? 'offset $2' : ''}
            ${to !== undefined ? 'limit $3' : ''}`,
            [...params]
        )).rows;

        let count = 0;
        if(previews.length > 0){
            count = previews[0].count;
            previews.forEach(element => delete element.count);
        }

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            count,
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

async function getDesignerOffers(id, from, to) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let params = [id];
        if (from !== undefined) params.push(from);
        if (to !== undefined) params.push(to - from);

        let offers = (await client.query(
            `select o.id, o.title, o.preview, o.price, count( 1 ) over ()::int
                from offers as o, designers_offers as od
            where
                o.id = od.offer_id and od.designer_id = $1
            order by o.id desc
            ${from !== undefined ? 'offset $2' : ''}
            ${to !== undefined ? 'limit $3' : ''}`,
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

        console.log(e);

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

async function updateInfo(id, bio) {
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

    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function updateEngaged(id, engaged) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `update designers
            set engaged = $2
            where id = $1`,
            [id, engaged]
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

module.exports = {
    getDesigners,
    getDesigner,
    getReviews,
    getDesignerPreviews,
    getDesignerOffers,
    createDesigner,
    deleteDesigner,
    updateInfo,
    updateEngaged
}