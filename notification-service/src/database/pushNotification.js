"use strict";

const pool = require('./pg/pool').getPool();


async function getNotifications() {
    const client = await pool.connect();
    await client.query('begin');

    try {
        const notifications = {};
        const date = `and departure_date < ${Math.floor(new Date().getTime() / 1000)}`;

        const { rows: likes } = await client.query(
            `select 
                * 
            from 
                notifications
            where
                likes = true and comments = false ${date}`
        )

        notifications.likes = likes;

        const { rows: comments } = await client.query(
            `select
                *
            from
                notifications
            where
                likes = false and comments = true ${date}`
        )

        notifications.comments = comments;

        const { rows: likesAndComments } = await client.query(
            `select 
                *
            from
                notifications
            where
                likes = true and comments = true ${date}`
        )

        notifications.likesAndComments = likesAndComments;

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            notifications
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
    getNotifications
}