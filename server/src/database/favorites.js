"use strict";

const pool = require('./pg/pool').getPool();

async function getFavorites(vk_id, from, to, from_id) {
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
        if (to && to !== 'all') {
            params.push(to);
            limit = `limit $${params.length}`;
        }

        params.push(vk_id);

        let { rows: previews } = await client.query(
            `
            with likes as (
                select 
                    portfolio_id, 
                    count(vk_user_id) as likes
                from 
                    portfolios_likes
                group by portfolio_id
            ),
            tmp as (
                select 
                    p.id, 
                    p.title, 
                    p.preview, 
                    p.views,
                    l.likes
                from 
                    portfolio as p
                left outer join 
                    likes as l 
                on 
                    p.id = l.portfolio_id
            )
            select
                p.id, 
                p.title, 
                p.preview, 
                count( 1 ) over ()::int
            from 
                tmp as p,
                favorites as f
            where
                p.id = f.portfolio_id and 
                f.vk_id = $${params.length}
                ${filter}
            ${offset}
            ${limit !== '' ? limit : ''}`,
            params
        )

        let count = 0;
        let result = {
            isSuccess: true
        };

        if (previews.length > 0) {
            count = previews[0].count;
            previews.forEach(el => delete el.count);
            result.from_id = from_id === undefined ? previews[0].id : Number(from_id);
        }

        await client.query('commit');
        client.release();

        return {
            ...result,
            count,
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

async function addFavorites(vk_id, work_id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let work = (await client.query(
            `select 
                id
            from
                portfolio
            where
                id = $1`,
            [work_id]
        )).rows[0];

        if (work !== undefined) {
            let inFavorites = (await client.query(
                `select 
                    id
                from
                    favorites
                where
                    vk_id = $1 and
                    portfolio_id = $2`,
                [vk_id, work_id]
            )).rows[0];

            if (inFavorites === undefined) {
                const date = Math.floor(new Date().getTime() / 1000) - (new Date().getTimezoneOffset() * 60);

                await client.query(
                    `insert into
                        favorites (portfolio_id, vk_id, add_date)
                    values
                        ($1, $2, $3)`,
                    [work_id, vk_id, date]
                )
            } else {
                await client.query(
                    `delete from
                        favorites
                    where
                        vk_id = $1 and
                        portfolio_id = $2`,
                    [vk_id, work_id]
                )
            }

            await client.query('commit');
            client.release();

            return {
                isSuccess: true
            }
        }

        throw 'Work not found';
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
    getFavorites,
    addFavorites
}