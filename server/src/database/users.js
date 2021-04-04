"use strict";

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

module.exports = {
    getRoles
}