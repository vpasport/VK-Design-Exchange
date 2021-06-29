"use strict";

const pool = require('./pg/pool').getPool();

async function getAll() {
    const client = await pool.connect();
    client.query('begin');

    try {
        const { rows: specializations } = await client.query(
            `select
                *
            from
                specializations`
        )

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            specializations
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

async function create(name) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let { rows: specialization } = await client.query(
            `select 
                id
            from 
                specializations
            where
                name = $1`,
            [name]
        );

        if (specialization.length > 0) throw 'An specialization with the same name already exists';

        specialization = (await client.query(
            `insert into
                specializations (name)
            values
                ($1)
            returning id`,
            [name]
        )).rows[0].id;

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            id: specialization
        };
    } catch (e) {
        await client.query('rollback');
        client.release();

        return {
            isSuccess: false
        }
    }
}

async function update(id, name) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let { rows: specializations } = await client.query(
            `select 
                name
            from 
                specializations
            where
                id = $1`,
            [id]
        );

        if (specializations.length !== 1) throw 'Specialization not found';

        let { rows: specialization_ } = await client.query(
            `select 
                id
            from 
                specializations
            where
                name = $1`,
            [name]
        );

        if (specialization_.length > 0) throw 'This name already exists';

        (await client.query(
            `update 
                specializations
            set 
                name = $1
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

async function del(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `delete from 
                specializations
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

module.exports = {
    getAll,
    create,
    update,
    del
}