"use strict";

const pool = require('./pg/pool').getPool();

async function getPreviews(from, to, from_id, tags) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let query = `select distinct p.id, p.title, p.preview, p.description 
                        from portfolio as p`;
        let params = [];

        if (tags !== undefined) {
            query += `, tags_portfolios as tp 
                        where p.id = tp.portfolio_id and tp.tag_id = any($1)`;
            params.push(tags);
            if (from_id !== undefined)
                query += ` and p.id <= ${from_id}`;
        } else if (from_id !== undefined) query += ` where p.id <= ${from_id}`
        query += ` order by p.id desc`
        if (from !== undefined) {
            query += ` offset ${from}`;
        }
        if (to !== undefined && from !== undefined) {
            query += ` limit ${Number(to) - Number(from)}`;
        } else if (to !== undefined) {
            query += ` limit ${to}`;
        }

        let previews = (await client.query(
            query,
            params
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

async function addTags(portfolio_id, tag_ids) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let s = tag_ids.map((_, i) => (i += 2, `($1, $${i})`)).join(',');

        let tags = (await client.query(
            `insert into 
                tags_portfolios (portfolio_id, tag_id)
            values ${s}
                returning id`,
            [portfolio_id, ...tag_ids]
        )).rows;

        if (tags.length > 0) {
            await client.query('commit');
            client.release();

            return {
                isSuccess: true
            }
        }

        await client.query('rollback');
        client.release;

        return {
            isSuccess: false
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
    createWork,
    addTags
}