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

        await client.query('commit');
        client.release();

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

        if (tag !== undefined) throw 'An tag with the same name already exists';

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

async function deleteTag(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `delete from tags
            where
                id = $1`,
            [id]
        )

        await client.query('commit');
        client.release();

        return {
            isSuccess: true
        }
    } catch (e) {
        await client.query('rollback');
        client.release();

        return {
            isSuccess: false
        }
    }
}

async function updateTag(id, name) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let tag = (await client.query(
            `select t.name
                from tags as t
            where
                t.id = $1`,
            [id]
        )).rows[0];

        if (tag === undefined) throw 'Tag not found';

        let tag_ = (await client.query(
            `select id
                from tags
            where
                name = $1`,
            [name]
        )).rows[0];

        if (tag_ !== undefined) throw 'This name already exists';

        (await client.query(
            `update tags
                set name = $1
            where
                id = $2`,
            [name, id]
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

module.exports = {
    getAll,
    create,
    deleteTag,
    updateTag
}