"use strict";

const { Pool } = require("pg");

let pool = null;

function getPool() {
    if (pool === null) {
        pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        testPool();
    }

    return pool;
}

async function testPool() {
    console.log("Test pool")

    if (pool === null) {
        throw "[POOL TEST] Not connected";
    }

    const errorMessage = "[POOL TEST] Error in \"{MODE}\" mode: {REASON}";
    let client;

    try {
        client = await pool.connect();
    } catch (error) {
        throw errorMessage.replace("{REASON}", "can't connect to database");
    }

    try {
        await client.query("select now()");
    } catch (error) {
        throw errorMessage.replace("{REASON}", "can't query from database");
    } finally {
        await client.end();
        client.release();
    }
}

module.exports = {
    getPool
};