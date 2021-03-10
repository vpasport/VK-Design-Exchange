"use strict";

const pool = require('./pg/pool').getPool();

async function create(designer_vk_id, rating, text, user_vk_id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let designer_id = (await client.query(
            `select d.id
                from designers as d
            where
                d.vk_id = $1`,
            [designer_vk_id]
        )).rows[0].id;

        if (designer_id === undefined) throw "designer id not found";

        let reviewId = (await client.query(
            `insert into reviews
                (rating, text, user_vk_id)
            values
                ($1, $2, $3)
            returning id`,
            [rating, text, user_vk_id]
        )).rows[0].id;

        if (reviewId !== undefined) {
            let rdId = (await client.query(
                `insert into reviews_designers
                    (designer_id, review_id)
                values
                    ($1, $2)
                returning id`,
                [designer_id, reviewId]
            )).rows[0].id;

            if (rdId !== undefined) {
                await client.query(
                    `with reviews_id as (
                        select rd.review_id
                            from reviews_designers as rd
                        where 
                            rd.designer_id = $1
                    ), avg_rating as (
                        select avg(r.rating)
                            from reviews as r
                        where r.id = any(select review_id from reviews_id)
                    )
                    update
                        designers
                    set 
                        rating = (select ar.avg from avg_rating as ar)
                    where
                        id = $1`,
                    [designer_id]
                )

                await client.query('commit');
                client.release();

                return {
                    isSuccess: true,
                    review_id: reviewId
                }
            }
        }

        throw 'error';
    } catch (e) {
        await client.query('rollback');
        client.release();

        return {
            isSuccess: false
        }
    }
}

async function deleteReview(id){
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `delete from reviews
            where
                id = $1`,
            [id]
        )

        await client.query('commit');
        client.release();

        return {
            isSuccess: true
        }
    } catch(e){
        await client.query('rollback');
        client.release();

        return {
            isSuccess: false
        }
    }
}

module.exports = {
    create,
    deleteReview
}