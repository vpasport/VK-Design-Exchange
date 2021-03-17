"use strict";

const pool = require('./pg/pool').getPool();

async function getAllPreviews() {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let previews = (await client.query(
            `select id, title, preview, description 
                from portfolio
            order by id desc`
        )).rows;

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
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

async function getPreviewsFromTo(from, to, from_id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        const params = [];
        let filter = '';
        let offset = '';
        let limit = '';

        if (from_id) {
            params.push(from_id);
            filter = `where p.id <= $${params.length}`;
        }
        if (from) {
            params.push(from);
            offset = `offset $${params.length}`;
        }
        if (to) {
            params.push(to);
            limit = `limit $${params.length}`;
        }

        let { rows: previews } = await client.query(
            `with tmp as (
                select id, title, preview, description, count( 1 ) over ()::int  
                    from portfolio
            )
            select * 
                from tmp as p
            ${filter}
            order by p.id desc
            ${offset}
            ${limit}`,
            params
        );

        let count = previews[0].count;
        previews.forEach(element => delete element.count);

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

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function getPreviewsTags(from, to, from_id, tags) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        const params = [];
        let filter = '';
        let offset = '';
        let limit = '';

        if (from_id) {
            params.push(from_id);
            filter = `and p.id <= $${params.length}`;
        }
        if (from) {
            params.push(from);
            offset = `offset $${params.length}`;
        }
        if (to) {
            params.push(to);
            limit = `limit $${params.length}`;
        }

        params.push(tags);

        let { rows: previews } = await client.query(
            `select distinct on (p.id) p.id, p.title, p.preview, p.description, count( 1 ) over ()::int  
                from portfolio as p, tags_portfolios as tp
            where p.id = tp.portfolio_id and tp.tag_id = any($${params.length}) ${filter}
            order by p.id desc
            ${offset}
            ${limit}`,
            params
        );

        if (previews.length > 0) {
            let count = previews[0].count;
            previews.forEach(element => delete element.count);

            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                count,
                from_id: from_id === undefined ? previews[0].id : Number(from_id),
                previews
            }
        }

        throw 'Preveiws not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }

}

async function getWork(id, full) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let work = (await client.query(
            `${full !== true ? 'select *' : 'select p.project_description, p.task_description, p.completed_work, p.work_image'}
                from portfolio as p
            where p.id = $1`,
            [id]
        )).rows[0];

        let tags = (await client.query(
            `select * 
                from tags as t, tags_portfolios as tp
            where 
                tp.portfolio_id = $1 and t.id = tp.tag_id`,
            [id]
        )).rows;

        let user = (await client.query(
            `select d.vk_id, d.first_name, d.last_name, d.id, d.photo, d.rating
                from designers as d, designers_portfolios as dp
            where 
                dp.portfolio_id = $1 and d.id = dp.designer_id`,
            [id]
        )).rows[0];

        if (work !== undefined) {
            await client.query('commit');
            client.release();

            if (tags.length > 0) work.tags = tags;
            if (user !== undefined) work.author = user;

            return {
                isSuccess: true,
                work
            };
        }

        throw 'Work not found';
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
    project_description, task_description, completed_work, work_image,
    designer_id, tag_ids
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

        if (id !== undefined) {
            let s = tag_ids.map((_, i) => (i += 2, `($1, $${i})`)).join(',');

            let tags = (await client.query(
                `insert into
                    tags_portfolios (portfolio_id, tag_id)
                values ${s}
                    returning id`,
                [id, ...tag_ids]
            )).rows;

            if (tags.length > 0) {
                let designer = (await client.query(
                    `insert into
                        designers_portfolios (designer_id, portfolio_id)
                    values
                        ($1, $2)
                    returning id`,
                    [designer_id, id]
                )).rows[0].id;

                if (designer_id !== undefined) {
                    await client.query('commit');
                    client.release();

                    return {
                        isSuccess: true,
                        id
                    }
                }

                throw 'Error when adding portfolio to designer';
            }

            throw 'Error while adding portfolio tags';
        }

        throw 'Error while creating portfolio';

    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

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

        throw 'Previews no found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        return {
            isSuccess: false
        }
    }
}

async function deleteWork(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `delete from portfolio
            where
                id = $1`,
            [id]
        );

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
    getAllPreviews,
    getPreviewsFromTo,
    getPreviewsTags,
    getWork,
    createWork,
    addTags,
    deleteWork
}