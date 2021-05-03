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

async function unbanUser(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        console.log(id)

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
    unbanUser
}