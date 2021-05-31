"use strict";

const { getUsersInfo } = require('../helper/vk');

const pool = require('./pg/pool').getPool();

async function getStatuses() {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let statuses = (await client.query(
            `select * 
            from orders_statuses`
        )).rows;

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            statuses
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

async function getOrders(from, to) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        const params = [];
        let offset = '';
        let limit = '';

        if (from) {
            params.push(from);
            offset = `offset $${params.length}`;
        }
        if (to && to !== 'all') {
            params.push(to);
            limit = `limit $${params.length}`;
        }

        let orders = (await client.query(
            `select 
                o.id, 
                o.customer, 
                o.offer_id, 
                os.name as status, 
                o.status as status_id,
                o.create_date,
                o.update_date,
                ofs.title, 
                count( 1 ) over ()::int
            from
                orders as o,
                designers_offers as od,
                orders_statuses as os,
                offers as ofs
            where
                od.offer_id = o.offer_id and
                o.status = os.id and
                ofs.id = o.offer_id
            order by o.id desc
            ${offset}
            ${limit !== '' ? limit : ''}`,
            [...params]
        )).rows;

        let count = 0;
        let users = []

        if (orders.length > 0) {
            count = orders[0].count;
            orders.forEach(element => {
                users.push(element.customer);
                element.create_date = parseInt(element.create_date);
                element.update_date = parseInt(element.update_date);
                delete element.count
            });

            users = await getUsersInfo(users);

            if (users.isSuccess) {
                let customers = users.users;

                orders.forEach(element => {
                    let customer = customers.find(el => el.id === element.customer);
                    element.customer = customer;
                })
            }
        }

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            count,
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

async function getOrder(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let order = (await client.query(
            `select * 
                from orders
            where
                id = $1`,
            [id]
        )).rows[0];

        if (order !== undefined) {
            order.create_date = parseInt(order.create_date);
            order.update_date = parseInt(order.update_date);

            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                order
            }
        }

        throw 'Order not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function getOrderFull(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let order = (await client.query(
            `select 
                ord.id, 
                ord.customer, 
                d.vk_id as designer,
                ord.offer_id, 
                ord.create_date,
                ord.update_date,
                os.name as status, 
                ord.status as status_id
            from 
                orders as ord, 
                orders_statuses as os,
                designers_offers as od,
                designers as d
            where 
                ord.status = os.id and
                ord.offer_id = od.offer_id and
                od.designer_id = d.id and
                ord.id = $1`,
            [id]
        )).rows[0];

        if (order !== undefined) {
            order.create_date = parseInt(order.create_date);
            order.update_date = parseInt(order.update_date);

            let offer = (await client.query(
                `select *
                from
                    offers
                where
                    id = $1`,
                [order.offer_id]
            )).rows[0];

            if (offer !== undefined) {
                order.offer = offer;
            }

            if (order.status_id === 5) {
                let review = (await client.query(
                    `select *
                    from 
                        reviews
                    where
                        order_id = $1`,
                    [id]
                )).rows[0];

                if (review !== undefined)
                    order.review = review;
            }

            if (order.status_id === 1) {
                let comments = (await client.query(
                    `select * 
                    from 
                        orders_comments
                    where
                        order_id = $1`,
                    [order.id]
                )).rows;

                order.comments = comments;
            }

            let users = [order.customer, order.designer];

            if (order.comments !== undefined)
                order.comments.forEach(el => {
                    if (users.indexOf(el.from_vk_id) === -1) users.push(el.from_vk_id);
                })

            users = await getUsersInfo(users);

            if (users.isSuccess) {
                users = users.users;
                order.commentators = [];

                users.forEach(el => {
                    if (el.id === order.customer) order.customer = el;
                    else if (el.id === order.designer) order.designer = el;
                    else order.commentators.push(el)
                })
            }

            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                order
            }
        }

        throw 'Order not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function getOrdersByDesigner(id) {
    const client = await pool.connect();
    client.query('begin');

    try {
        let orders = (await client.query(
            `select ord.id, ord.customer, ord.offer_id, os.name as status, ord.status as ststus_id
                from orders as ord, orders_statuses as os
            where ord.offer_id = any((
                select id from offers
                where id = any((
                    select offer_id from designers_offers
                    where designer_id = $1
                ))
            )) and os.id = ord.status`,
            [id]
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

async function getOrdersByCustomer(vk_id, status_id = undefined) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let params = [];
        let status = '';

        if (status_id) {
            params.push(status_id);
            status = `ord.status = $${params.length} and`;
        }

        params.push(vk_id);

        let orders = (await client.query(
            `select 
                ord.id, 
                ord.customer, 
                ord.offer_id, 
                os.name as status, 
                ord.status as status_id,
                o.title,
                o.preview,
                o.price
            from 
                orders as ord, 
                orders_statuses as os,
                offers as o
            where 
                ord.status = os.id and
                o.id = ord.offer_id and
                ${status}
                ord.customer = $${params.length}
            order by ord.id desc`,
            params
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
            isSuccess: true
        }
    }
}

async function getDesignerByOrder(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let designer = (await client.query(
            `select 
                od.designer_id,
                d.vk_id
            from 
                designers_offers as od,
                orders as o,
                designers as d
            where 
                o.id = $1 and 
                o.offer_id = od.offer_id and
                d.id = od.designer_id
            order by o.id desc`,
            [id]
        )).rows[0];

        if (designer !== undefined) {
            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                designer: designer.designer_id,
                vk_id: designer.vk_id
            }
        }

        throw 'Order nof found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: true
        }
    }
}

async function createOrder(offer, customer) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        const date = Math.floor(new Date().getTime() / 1000) - (new Date().getTimezoneOffset() * 60);

        let order = (await client.query(
            `insert into orders
                (customer, offer_id, create_date, update_date)
            values
                ($1, $2, $3, $3)
            returning id`,
            [customer, offer, date]
        )).rows[0].id;

        if (order !== undefined) {
            order = (await client.query(
                `select 
                    o.id, 
                    o.customer, 
                    o.offer_id, 
                    os.name as status, 
                    o.status as status_id,
                    ofs.title,
                    ofs.preview,
                    ofs.price
                from
                    orders as o,
                    designers_offers as od,
                    orders_statuses as os,
                    offers as ofs
                where
                    od.offer_id = o.offer_id and
                    o.status = os.id and
                    ofs.id = o.offer_id and
                    o.id = $1`,
                [order]
            )).rows[0];

            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                order
            }
        }

        throw 'Failed to create order';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function inProcess(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let order = (await client.query(
            `select status from orders
            where id = $1`,
            [id]
        )).rows[0];

        if (order !== undefined) {
            if (order.status === 2) {
                const date = Math.floor(new Date().getTime() / 1000) - (new Date().getTimezoneOffset() * 60);

                await client.query(
                    `update orders
                        set status = 3,
                        update_date = $2
                    where
                        id = $1`,
                    [id, date]
                )

                await client.query('commit');
                client.release();

                return {
                    isSuccess: true
                }
            }

            throw `Can't change status`;
        }

        throw 'Order not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function readyToCheck(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let order = (await client.query(
            `select status 
                from orders
            where
                id = $1`,
            [id]
        )).rows[0];

        if (order !== undefined) {
            if (status.status === 3) {
                const date = Math.floor(new Date().getTime() / 1000) - (new Date().getTimezoneOffset() * 60);

                await client.query(
                    `update orders
                        set status = 4,
                        update_date = $2
                    where
                        id = $1`,
                    [id, date]
                )

                await client.query('commit');
                client.release();

                return {
                    isSuccess: true
                }
            }

            await client.query('commit');
            client.release();

            return {
                isSuccess: false
            }
        }

        throw 'Order not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function finishOrder(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let order = (await client.query(
            `select status 
                from orders
            where
                id = $1`,
            [id]
        )).rows[0];

        if (order !== undefined) {
            if (order.status === 4) {
                const date = Math.floor(new Date().getTime() / 1000) - (new Date().getTimezoneOffset() * 60);
                await client.query(
                    `update orders
                        set status = 5,
                        update_date = $2
                    where
                        id = $1`,
                    [id, date]
                )

                await client.query('commit');
                client.release();

                return {
                    isSuccess: true
                }
            }

            await client.query('rollback');
            client.release();

            return {
                isSuccess: false
            }
        }

        throw 'Order not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function cancelOrder(id, comment, from_vk_id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let order = (await client.query(
            `select o.*, d.vk_id as designer_vk_id
            from 
                orders as o,
                designers_offers as od,
                designers as d
            where
                o.id = $1 and 
                od.offer_id = o.offer_id and
                od.designer_id = d.id`,
            [id]
        )).rows[0];

        if (order !== undefined) {
            let admin = (await client.query(
                `select * 
                from admins
                where vk_id = $1`,
                [from_vk_id]
            )).rows[0];

            if (order.customer === from_vk_id ||
                order.designer_vk_id === from_vk_id ||
                (admin !== undefined && admin.vk_id === from_vk_id)
            ) {
                const date = Math.floor(new Date().getTime() / 1000) - (new Date().getTimezoneOffset() * 60);

                await client.query(
                    `update orders
                        set status = 1,
                        update_date = $2
                    where
                        id = $1`,
                    [id, date]
                )

                let comment_id = (await client.query(
                    `insert into orders_comments
                        (order_id, from_vk_id, comment)
                    values
                        ($1, $2, $3)
                    returning id`,
                    [id, from_vk_id, comment]
                ))

                if (comment !== undefined) {
                    await client.query('commit');
                    client.release();

                    return {
                        isSuccess: true,
                        comment_id
                    }
                }

                throw 'Error while adding comment';
            }

            throw 'Access denied';
        }

        throw 'Order not found';
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
    getStatuses,
    getOrders,
    getOrder,
    getOrderFull,
    getOrdersByDesigner,
    getOrdersByCustomer,
    getDesignerByOrder,
    createOrder,
    inProcess,
    readyToCheck,
    finishOrder,
    cancelOrder
}