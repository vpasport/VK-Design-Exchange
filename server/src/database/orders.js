"use strict";

const pool = require('./pg/pool').getPool();

async function getOrders() {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let orders = (await client.query(
            `select * 
                from orders`
        )).rows;

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            orders
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
    getOrders
}