"use strict";

const pool = require('./pg/pool').getPool();

async function getPreviews(from, to, from_id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let limit = '';
        let offset = '';
        let where = '';

        if (from !== undefined) {
            offset = `offset ${from}`
        }
        if (to !== undefined) {
            limit = `limit ${to}`;
            if (from !== undefined) {
                limit = `limit ${Number(to) - Number(from)}`;
            }
        }
        if (from_id !== undefined) {
            where = `where p.id <= ${from_id}`
        }

        let previews = (await client.query(
            `select p.id, p.title, p.preview, p.description
                from portfolio as p
                ${where}
            order by p.id desc
            ${limit}
            ${offset}`
        )).rows;

        let count = (await client.query(
            `select count(*)
                from portfolio`
        )).rows[0].count;

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            count,
            from_id: from_id === undefined ? previews[0].id : Number(from_id),
            previews
        }
    } catch (e) {
        await client.query('rollback');
        client.release();

        return {
            isSuccess: false
        }
    }

}

async function getWork(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let work = (await client.query(
            `select p.project_description, p.task_description, p.completed_work, p.work_image
                from portfolio as p
            where p.id = $1`,
            [id]
        )).rows[0];

        if (work === undefined) {
            return {
                isSuccess: false,
                error: 'Work not found'
            }
        }

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            work
        };
    } catch (e) {
        await client.query('rollback');
        client.release();

        return {
            isSuccess: false
        }
    }
}

async function createWork(
    title, preview, description,
    project_description, task_description, completed_work, work_image
) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let id = (await client.query(
            `insert into
                portfolio (title, preview, description, project_description, task_description, completed_work, work_image)
            values 
                ($1, $2, $3, $4, $5, $6, $7)
            returning id`,
            [title, preview, description, project_description, task_description, completed_work, work_image]
        )).rows[0].id;

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            id
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
    getPreviews,
    getWork,
    createWork
}