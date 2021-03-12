"use strict";

const pool = require('./pg/pool').getPool();

async function getRoles(vk_id){
    const client = await pool.connect();
    await client.query('begin');

    try {
        const roles = [];

        let admin = (await client.query(
            `select id
                from admins
            where
                vk_id = $1`,
            [vk_id]
        )).rows[0].id;

        if(admin !== undefined){
            roles.push('admin');
        }

        if(roles.length > 0 ){
            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                roles
            }
        }

        throw 'User not found';
    } catch(e){
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