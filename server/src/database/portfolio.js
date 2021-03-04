"use strict";

const pool = require('./pg/pool').getPool();

async function getAllPreviews() {
    const client = await pool.connect();
    await client.query('begin');

    let previews = (await client.query(
        `select p.id, p.title, p.preview, p.description
            from portfolio as p`
    )).rows;

    await client.query('commit');
    client.release();

    return {
        isSuccess: true,
        previews
    }
}

async function getWork(id) {
    const client = await pool.connect();
    await client.query('begin');

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
}

async function createWork(
    title, preview, description,
    project_description, task_description, completed_work, work_image
) {
    const client = await pool.connect();
    await client.query('begin');

    let id = (await client.query(
        `insert into
            portfolio (title, preview, description, project_description, task_description, completed_work, work_image)
        values 
            ($1, $2, $3, $4, $5, $6, $7)
        returning id`,
        [title, preview, description, project_description, task_description, completed_work, work_image ]
    )).rows[0].id;

    await client.query('commit');
    client.release();

    return {
        isSuccess: true,
        id
    }
}

module.exports = {
    getAllPreviews,
    getWork,
    createWork
}