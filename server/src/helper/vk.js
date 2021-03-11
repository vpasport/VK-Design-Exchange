"use strict";

const {API} = require('vk-io');

const api = new API({
    token : process.env.APP_TOKEN
})

async function getUserInfo(vk_id){
    try {
        let user = await api.users.get(
            {
                user_ids: vk_id,
                fields : 'photo_max',
                name_case: 'nom'
            }
        )
        
        return {
            isSuccess: true,
            user
        }
    } catch (e){
        return {
            isSuccess: false
        }
    }
}

module.exports = {
    getUserInfo
}