"use strict";

const pool = require('./pg/pool').getPool();

async function getDesigners() {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let designers = (await client.query(
            `select d.id, d.vk_id, d.rating
                from designers as d`
        )).rows;

        await client.query('commit');
        client.release();

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
            `select d.id, d.vk_id, d.rating, d.experience, d.specialization
                from designers as d
            where id = $1`,
            [id]
        )).rows[0];

        if( designer !== undefined ){
            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                designer
            }
        }

        await client.query('rollback');
        client.release();
    } catch (e) {
        await client.query('rollback');
        client.release();

        return {
            isSuccess: false
        }
    }
}

async function getReviews(id){
    const client = await pool.connect();
    await client.query('begin');

    try{
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

        if(reviews !== undefined ){
            await client.query('commit');
            client.release();
    
            return {
                isSuccess: true,
                reviews
            }
        }

        throw 'reviews not found';
    } catch (e){
        await client.query('rollback');
        client.release();

        return {
            isSuccess: false
        }
    }
}

module.exports = {
    getDesigners,
    getDesigner,
    getReviews
}