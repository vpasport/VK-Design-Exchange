"use stricr";

const http = require('http');
const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');

const server = express();

server.use(
    cors()
);

server.use((req, res, next) => {
    console.log(req);
    next();
});

server.get('/', (req, res) => {
    res.json({succsess : 'ok'})
});

http.createServer(server).listen(3001, ()=>{
    console.log('Serser start')
})