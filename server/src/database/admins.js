"use strict";

const pool = require('./pg/pool').getPool();
const {
    getUsersInfo,
    getUserInfo
} = require('../helper/vk');

async function getAdmins() {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let admins = (await client.query(
            `select * 
                from admins`
        )).rows;

        if (admins.length > 0) {
            let vk_ids = []
            admins.forEach(element => {
                vk_ids.push(element.vk_id)
            });

            let { users } = await getUsersInfo(vk_ids);

            admins = admins.map(el => {
                let user = users.find(el2 => el2.id === el.vk_id)
                if (user) return {
                    id: el.id,
                    vk_id: el.vk_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    photo: user.photo_max
                }
            })

            await client.query('commit');
            client.release()

            return {
                isSuccess: true,
                admins
            }
        }

        throw 'Admins not found'

    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function createAdmin(vk_id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        if (vk_id.includes('https')) {
            vk_id = vk_id.match(/https?:\/\/.*\/(.*)\/?/)[1];
        }

        let admin = await getUserInfo(vk_id);

        if (!admin.isSuccess) throw 'vk user not found';

        let adminId = (await client.query(
            `select id
                from admins
            where vk_id = $1`,
            [admin.user.id]
        )).rows[0];

        if (adminId === undefined) {
            adminId = (await client.query(
                `insert into admins
                    (vk_id)
                values
                    ($1)
                returning id`,
                [admin.user.id]
            )).rows[0].id;

            if (adminId !== undefined) {
                await client.query('commit');
                client.release();

                return {
                    isSuccess: true,
                    id: adminId
                }
            }

            throw 'Error while creating user';
        }

        throw 'User already exists';

    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function deleteAdmin(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `delete from admins
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

        console.log(e);

        return {
            isSuccess: false
        }
    }
}

module.exports = {
    getAdmins,
    createAdmin,
    deleteAdmin
}