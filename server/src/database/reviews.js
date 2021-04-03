"use strict";

const pool = require('./pg/pool').getPool();

async function getOfferByOrder(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let offer = (await client.query(
            `select offers.* 
            from 
                orders,
                offers
            where
                orders.offer_id = offers.id and
                orders.id = $1`,
            [id]
        )).rows[0];

        if (offer !== undefined) {
            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                offer
            }
        }

        throw 'Order not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function create(order_id, rating, text, user_vk_id, image) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let order = (await client.query(
            `select o.id
                from orders as o
            where
                o.id = $1`,
            [order_id]
        )).rows[0];

        if (order === undefined) throw "Order id not found";
        order = order.id;

        let designer = (await client.query(
            `select 
                od.designer_id as id
            from
                orders as o,
                designers_offers as od
            where
                o.offer_id = od.offer_id and
                o.id = $1`,
            [order_id]
        )).rows[0];

        if (designer === undefined) throw 'Designer not found';
        designer = designer.id

        let reviewId = (await client.query(
            `select id
            from reviews
            where
                order_id = $1`,
            [order_id]
        )).rows[0];

        if (reviewId !== undefined) throw 'Review already exists';

        reviewId = (await client.query(
            `insert into reviews
                (rating, text, user_vk_id, order_id, image)
            values
                ($1, $2, $3, $4, $5)
            returning id`,
            [rating, text, user_vk_id, order_id, image]
        )).rows[0].id;

        if (reviewId !== undefined) {
            let rdId = (await client.query(
                `insert into reviews_designers
                    (designer_id, review_id)
                values
                    ($1, $2)
                returning id`,
                [designer, reviewId]
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
                    [designer]
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

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function deleteReview(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let designer = (await client.query(
            `select 
                designer_id as id
            from
                reviews_designers
            where
                review_id = $1`,
            [id]
        )).rows[0];

        if (designer !== undefined) {
            designer = designer.id;

            let image = (await client.query(
                `select image 
                from reviews
                where id = $1`,
                [id]
            )).rows[0].image;

            await client.query(
                `delete from reviews
                where
                    id = $1`,
                [id]
            )

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
                    rating = (select coalesce(ar.avg, 0) from avg_rating as ar)
                where
                    id = $1`,
                [designer]
            )

            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                image
            }
        }

        throw 'Review not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e)

        return {
            isSuccess: false
        }
    }
}

module.exports = {
    getOfferByOrder,
    create,
    deleteReview
}