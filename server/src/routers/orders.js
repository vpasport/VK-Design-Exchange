"use strict";

const { Router, query } = require('express');

const {
    getStatuses: getStatuses_,
    getOrders: getOrders_,
    getOrder: getOrder_,
    getOrderFull: getOrderFull_,
    getOrdersByDesigner: getOrdersByDesigner_,
    getOrdersByCustomer: getOrdersByCustomer_,
    getDesignerByOrder: getDesignerByOrder_,
    createOrder: createOrder_,
    inProcess: inProcess_,
    readyToCheck: readyToCheck_,
    finishOrder: finishOrder_,
    cancelOrder: cancelOrder_
} = require('../database/orders');
const { checkSign } = require('../helper/vk');

async function getStatuses(req, res) {
    let result = await getStatuses_();

    if (result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(520);
}

async function getOrders({ query, session }, res) {
    let customer_vk_id = query.vk_user_id;
    let result;

    if (checkSign(query) && customer_vk_id !== undefined)
        result = await getOrdersByCustomer_(customer_vk_id)
    if (query.designer_id !== undefined)
        result = await getOrdersByDesigner_(designer_id)
    if (session.role !== undefined && session.role.indexOf('admin') !== -1)
        result = await getOrders_(query.from, query.to);

    if (result !== undefined && result.isSuccess) {
        res.json(result);
        return;
    }

    res.sendStatus(520);
}

async function getOrder({ params: { id }, query, session }, res) {
    let designer = await getDesignerByOrder_(id);

    let check = checkSign(query);

    if (designer.isSuccess) {
        if ((session.role !== undefined &&
            ((session.role.indexOf('designer') !== -1 && session.user.did === designer.designer)
                || (session.role.indexOf('admin') !== -1)) || checkSign(query))
        ) {
            let customer = query.vk_user_id;
            let result = await getOrderFull_(id);

            if (customer !== undefined && result.isSuccess)
                if (customer === result.order.customer.id) {
                    res.json(result);
                    return;
                }

            if (result.isSuccess) {
                res.json(result);
                return;
            }

            res.sendStatus(520);
            return;
        }

        res.sendStatus(401);
        return;
    }

    res.sendStatus(520);
}

async function createOrder({ body: { offer_id, url_params } }, res) {
    let params = JSON.parse('{"' + decodeURI(url_params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

    if (checkSign(params)) {
        let customer = params.vk_user_id;

        let result = await createOrder_(offer_id, customer);

        if (result.isSuccess) {
            res.json(result);
            return;
        }

        res.sendStatus(502);
        return;
    }

    res.sendStatus(401);
}

async function updateOrderStatus({ params: { id }, body: { from_vk_id }, session }, res) {
    let result;
    let order = await getOrder_(id);
    let designer = await getDesignerByOrder_(id);

    if (designer.isSuccess && order.isSuccess) {
        if (order.order.status === 2) {
            if (from_vk_id === designer.vk_id ||
                (session.role !== undefined &&
                    (session.role.indexOf('admin') !== -1 ||
                        session.role.indexOf('designer') !== -1 && session.user.did === designer.designer))
            ) {
                result = await inProcess_(id);

                if (result.isSuccess) {
                    res.sendStatus(204);
                    return;
                }
            }

            res.sendStatus(403);
            return;
        }

        if (order.order.status === 3) {
            if (session.role !== undefined) {
                if (session.role.indexOf('admin') !== -1 ||
                    (session.role.indexOf('designer') !== -1 &&
                        (designer.designer === session.user.did || from_vk_id === session.user.vk_id))
                ) {
                    result = await readyToCheck_(id);

                    if (result.isSuccess) {
                        res.sendStatus(204);
                        return;
                    }
                }

                res.sendStatus(403);
                return;
            }

            res.sendStatus(401);
            return;
        }
    }

    res.sendStatus(520);
}

async function cancelOrder({ params: { id }, body: { comment, from_vk_id, url_params }, session }, res) {
    let designer = await getDesignerByOrder_(id);
    if (session.role !== undefined) {
        if (session.role.indexOf('admin') !== -1) from_vk_id = session.vk_id;
        if (session.role.indexOf('designer') !== -1 && designer.designer === session.user.did) from_vk_id = session.vk_id;
    }

    if (session.role === undefined) {
        let params = JSON.parse('{"' + decodeURI(url_params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

        if (checkSign(params)) {
            from_vk_id = Number(params.vk_user_id);
        } else {
            res.sendStatus(401);
            return;
        }
    }

    if (from_vk_id !== undefined) {
        let result = await cancelOrder_(id, comment, from_vk_id);

        if (result.isSuccess) {
            res.sendStatus(204);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

async function finishOrder({ params: { id }, body: { url_params }, session }, res) {
    let result;

    if (session.role !== undefined && session.role.indexOf('admin') !== -1) {
        result = await finishOrder_(id);

        if (result.isSuccess) {
            res.sendStatus(204);
            return;
        }

        res.sendStatus(520);
        return;
    }

    let params = JSON.parse('{"' + decodeURI(url_params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

    if (checkSign(params) || session.role) {
        let order = await getOrder_(id);
        let customer = Number(params.vk_user_id);

        if (order.isSuccess) {
            if (order.order.customer === customer &&
                (order.order.status === 4 || order.order.status === 3)
            ) {
                result = await finishOrder_(id);

                if (result.isSuccess) {
                    res.sendStatus(204);
                    return;
                }

                res.sendStatus(520);
                return;
            }

            res.sendStatus(403);
            return;
        }

        res.sendStatus(520);
        return;
    }

    res.sendStatus(401);
}

function index() {
    const router = new Router();

    router.get('/', getOrders);
    router.get('/statuses', getStatuses);
    router.get('/:id', getOrder);

    router.post('/', createOrder);

    router.put('/:id', updateOrderStatus);
    router.put('/:id/cancel', cancelOrder);
    router.put('/:id/finish', finishOrder);

    return router;
}

module.exports = index();