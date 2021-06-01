"use strict";

const { getUsersInfo } = require('../helper/vk');

const pool = require('./pg/pool').getPool();

async function getRoles(vk_id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        const roles = [];
        let user = {};

        let admin = (await client.query(
            `select id
                from admins
            where
                vk_id = $1`,
            [vk_id]
        )).rows;

        if (admin.length > 0) {
            user.aid = admin[0].id;
            roles.push('admin');
        }

        let designer = (await client.query(
            `select id
                from designers
            where
                vk_id = $1`,
            [vk_id]
        )).rows;

        if (designer.length > 0) {
            user.did = designer[0].id;
            roles.push('designer');
        }

        if (roles.length > 0) {
            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                roles,
                user
            }
        }

        throw 'User not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        return {
            isSuccess: false,
            error: e
        }
    }
}

async function getBannedUsers() {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let { rows: users } = await client.query(
            `select *
                from banned_users`
        )

        let usersVkId = [];

        if (users.length > 0) {
            users.forEach(element => {
                usersVkId.push(element.vk_user_id);
            });

            usersVkId = await getUsersInfo(usersVkId);

            if (usersVkId.isSuccess) {
                usersVkId = usersVkId.users;

                users.forEach(element => {
                    let user = usersVkId.find(el => el.id === element.vk_user_id);
                    element.user = user;
                })
            }
        }

        return {
            isSuccess: true,
            users
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

async function getBanInfo(vk_id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let user = (await client.query(
            `select *
                from banned_users
            where
                vk_user_id = $1`,
            [vk_id]
        )).rows[0];

        let banned = user !== undefined;

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            banned
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

async function getViewed(vk_id, from, to, from_id) {
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
            `select
                p.id,
                p.title,
                p.preview,
                count( 1 ) over ()::int
            from
                portfolio as p,
                vieweds as v
            where
                p.id = v.portfolio_id and
                v.vk_id =  $${params.length} 
                ${filter}
            order by v.id desc 
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

async function banUser(vk_id, delete_comment) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let user = (await client.query(
            `select * 
                from banned_users
            where
                vk_user_id = $1`,
            [vk_id]
        )).rows[0];

        if (user !== undefined) {
            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                error: 'User is now blocked'
            }
        }

        await client.query(
            `insert into banned_users
                (vk_user_id)
            values
                ($1)`,
            [vk_id]
        )

        if (delete_comment === 'all') {
            let { rows: comments } = await client.query(
                `select
                    portfolio_id,
                    count(distinct id) as count
                from
                    portfolios_comments
                where
                    vk_user_id = $1
                group by portfolio_id`,
                [vk_id]
            )

            for (let el of comments) {
                await client.query(
                    `update
                        portfolio
                    set
                        popularity = popularity - $1
                    where
                        id = $2`,
                    [parseInt(el.count) * 150, el.portfolio_id]
                )
            }

            await client.query(
                `delete from
                    portfolios_comments
                where
                    vk_user_id = $1`,
                [vk_id]
            )
        } else if (delete_comment !== undefined) {
            await client.query(
                `update
                    portfolio
                set
                    popularity = popularity - 150
                where
                    id = (
                        select
                            portfolio_id
                        from
                            portfolios_comments
                        where
                            id = $1
                    )`,
                [delete_comment]
            )

            await client.query(
                `delete from 
                    portfolios_comments
                where
                    id = $1`,
                [delete_comment]
            )
        }

        // throw '';

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

async function unbanUser(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `delete 
                from banned_users
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

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

module.exports = {
    getRoles,
    getBannedUsers,
    getBanInfo,
    getViewed,
    banUser,
    unbanUser
}