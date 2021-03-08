"use strict";

const pool = require('./pg/pool').getPool();

async function getAll() {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let tags = (await client.query(
            `select *
                from tags`
        )).rows;

        return {
            isSuccess: true,
            tags
        }
    } catch (e) {
        await client.query('rollback');
        client.release();

        return {
            isSuccess: false
        }
    }
}

async function create(name) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let tag = (await client.query(
            `select t.id
                from tags as t
            where
                t.name = $1`,
            [name]
        )).rows[0];

        if (tag !== undefined) {
            await client.query('rollback');
            client.release();

            return {
                isSuccess: false,
                error: 'An tag with the same name already exists'
            };
        }

        tag = (await client.query(
            `insert into
                tags (name)
            values
                ($1)
            returning id`,
            [name]
        )).rows[0].id;

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            id: tag
        };
    } catch (e) {
        await client.query('rollback');
        client.release();

        return {
            isSuccess: false
        }
    }
}

module.exports = {
    getAll,
    create
}