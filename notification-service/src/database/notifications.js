"use strict";

const pool = require('./pg/pool').getPool();


async function updateStatus(users, status, date) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `update notifications
            set
                status_code = $1,
                departure_date = $2
            where
                vk_id = any($3)`,
            [status, date, users]
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

async function deleteNotifications(users) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `delete from notifications
            where vk_id = any($1)`,
            [users]
        )

        await client.query('commit');
        client.release();

        return {
            isSuccess: true
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

module.exports = {
    updateStatus,
    deleteNotifications
}