"use stricr";

require('dotenv').config();

const http = require('http');
const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');

const server = express();
const initRouters = require('./src/routers/index');

const pool = require('./src/database/pg/pool').getPool();

server.use(
    cors()
);

server.use(express.static('static'));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use((req, res, next) => {
    // console.log(`[INFO] request to ${req.url}`);
    next();
});

server.get('/', (req, res) => {
    res.json({succsess : 'ok'})
});

initRouters(server);

http.createServer(server).listen(process.env.PORT, ()=>{
    console.log(`Server starting on port ${process.env.PORT}`);
});