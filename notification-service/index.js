"use strict";

require('dotenv').config();
const schedule = require('node-schedule');

const { pushNotification: notify } = require('./src/notification/pushNotification');
const pool = require('./src/database/pg/pool').getPool();


const job = schedule.scheduleJob('*/2 * * * * ', async () => {
    notify();
})