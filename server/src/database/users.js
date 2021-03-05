"use strict";

const pool = require('./pg/pool').getPool();

async function createUser(vk_id, specialization) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let user = (await client.query(
            `select u.id 
                from users as u
            where
                u.vk_id = $1`,
            [vk_id]
        )).rows[0];

        if (user !== undefined) {
            await client.query('rollback');
            client.release();

            return {
                isSuccess: false,
                error: 'An user with the same vk_id alredy exists'
            };
        }

        user = (await client.query(
            `insert into
                users (vk_id, specialization)
            values
                ($1, $2)
            returning id`,
            [vk_id, specialization]
        )).rows[0].id;

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            id: user
        }

    } catch (e) {
        await client.query('rollback');
        client.release()

        return {
            isSuccess: false,
        };
    }
}

module.exports = {
    createUser
}