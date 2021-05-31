"use strict";

require('dotenv').config();

const http = require('http');
const express = require('express');
const session = require("express-session");
const pgStoreConnect = require("connect-pg-simple")(session);

const cors = require('cors');
const bodyParser = require('body-parser');

const server = express();
const initRouters = require('./src/routers/index');

const pool = require('./src/database/pg/pool').getPool();

server.use(
    cors({
        origin: true,
        credentials: true
    })
);

server.use(express.static('static'));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

const dev = process.env.NODE_ENV !== "production";

server.use(
    session({
        cookie: {
            httpOnly: true,
            maxAge: !dev ? parseInt(process.env.SESSION_COOKIE_MAXAGE) : null,
            secure: !dev && process.env.SESSION_COOKIE_SECURE === "true"
        },
        name: !dev ? process.env.SESSION_NAME : null,
        resave: false,
        rolling: true,
        saveUninitialized: false,
        secret: !dev ? process.env.SESSION_SECRET : "secret",
        store: new pgStoreConnect({
            pool: pool,
            tableName: process.env.SESSION_TABLE_NAME
        })
    })
);

// const {
//     updaetInfo
// } = require('./src/helper/vk');

server.post('/', ({ body: { vk_id, sign } }, res) => {
})

// test();

// async function test() {
//     const fetch = require('node-fetch');

//     const response = await fetch('https://skyauto.me/cllbck/193986385/1042665/WXJhSVN6NXRDZ2V5R3huSnB3aTZjUT0?avtp=1&sid=172349355')

//     const json = await response.json();

//     console.log(json)
// }

initRouters(server);

http.createServer(server).listen(process.env.PORT, () => {
    console.log(`Server starting on port ${process.env.PORT}`);
});