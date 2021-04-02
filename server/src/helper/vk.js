"use strict";

const crypto = require('crypto');
const qs = require('querystring');

const { API } = require('vk-io');
const pool = require('../database/pg/pool').getPool();

const api = new API({
    token: process.env.APP_TOKEN
})

async function getUserInfo(vk_id) {
    try {
        let user = await api.users.get(
            {
                user_ids: vk_id,
                fields: 'photo_max',
                name_case: 'nom'
            }
        )

        return {
            isSuccess: true,
            user: user[0]
        }
    } catch (e) {
        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function getUsersInfo(vk_ids) {
    try {
        let users = await api.users.get(
            {
                user_ids: vk_ids,
                fields: 'photo_max',
                name_case: 'nom'
            }
        )

        return {
            isSuccess: true,
            users
        }
    } catch (e) {
        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function updaetInfo() {
    const client = await pool.connect();
    await client.query('begin');

    let designers = (await client.query(
        `select vk_id, id
            from designers`
    )).rows;

    await designers.map(async el => {
        let designer = await getUserInfo(el.vk_id);

        await client.query(
            `update designers
            set
                first_name = $1,
                last_name = $2,
                photo = $3
            where
                id = $4`,
            [designer.user.first_name, designer.user.last_name, designer.user.photo_max, el.id]
        )
    })

    await client.query('commit');
    client.release();
}

function checkSign(query) {
    const ordered = {};
    let sign;

    Object.keys(query).sort().forEach((key) => {
        if (key === 'sign') sign = query[key];

        if (/^vk_/.test(key)) {
            ordered[key] = query[key];
        }
    });

    let hash =
        crypto.createHmac(
            'sha256',
            process.env.APP_SECRET
        )
            .update(qs.stringify(ordered))
            .digest()
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=$/, '');

    return sign === hash;
}

module.exports = {
    getUserInfo,
    getUsersInfo,
    checkSign
    // updaetInfo
}