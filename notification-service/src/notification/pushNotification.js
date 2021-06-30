"use strict";

const { API } = require('vk-io');

const { getNotifications } = require('../database/pushNotification');
const {
    updateStatus,
    deleteNotifications
} = require('../database/notifications');


const api = new API({
    token: process.env.APP_TOKEN,
    apiVersion: '5.131'
});

async function sendNotifications(users, message) {
    let date = Math.floor(new Date().getTime() / 1000);

    const response = await api.notifications.sendMessage({
        user_ids: users.map(el => el.vk_id),
        message: message,
        fragment: '#gallery',
        group_id: process.env.GROUP_ID,
        random_id: date
    })

    console.log(
`------------------------------------------------
${new Date()}
------------------------------------------------
${JSON.stringify(response, '*', 2)}
------------------------------------------------`
    )

    const update = [];
    const del = [];

    for (const user of response) {
        if (!user.status) {
            if (user.error.code === 3 || user.error.code === 2) {
                update.push(user.user_id);
            } else if (user.error.code === 1 || user.error.code === 4) {
                del.push(user.user_id);
            }
        } else {
            del.push(user.user_id);
        }
    }

    if (update.length > 0) {
        await updateStatus(update, 3, date + 24 * 60 * 60);
    }
    if (del.length > 0) {
        await deleteNotifications(del);
    }
}

async function pushNotification() {
    let notifications = await getNotifications();

    if (notifications.isSuccess) {
        notifications = notifications.notifications;

        for (const key in notifications) {
            if (notifications[key].length > 0) {
                switch (key) {
                    case 'likes': await sendNotifications(notifications[key], 'Вам поставили лайки'); break;
                    case 'comments': await sendNotifications(notifications[key], 'Вам оставили комментарии'); break;
                    case 'likesAndComments': await sendNotifications(notifications[key], 'Вам оставили комментарии и лайки'); break;
                }
            }
        }

    }
}

module.exports = {
    pushNotification
}