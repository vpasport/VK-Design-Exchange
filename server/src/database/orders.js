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
        if (to) {
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
            order by id desc
            ${offset}
            ${limit}`,
            [...params]
        )).rows;

        let count = 0;
        let users = []

        if (orders.length > 0) {
            count = orders[0].count;
            orders.forEach(element => {
                users.push(element.customer);
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
                    if (el.id === order.designer) order.designer = el;
                    else order.commentators.push(el)
                })
            }

            await client.query('commit');
            client.release;

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

async function getOrdersByCustomer(vk_id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let orders = (await client.query(
            `select ord.id, ord.customer, ord.offer_id, os.name as status, ord.status as ststus_id
                from orders as ord, orders_statuses as os
            where ord.status = os.id and ord.customer = $1`,
            [vk_id]
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
                d.id = od.designer_id`,
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
        let order = (await client.query(
            `insert into orders
                (customer, offer_id)
            values
                ($1, $2)
            returning id`,
            [customer, offer]
        )).rows[0].id;

        if (order !== undefined) {
            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                id: order
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
                await client.query(
                    `update orders
                        set status = 3
                    where
                        id = $1`,
                    [id]
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
        let status = (await client.query(
            `select status 
                from orders
            where
                id = $1`,
            [id]
        )).rows[0];

        if (status !== undefined) {
            if (status.status === 3) {
                await client.query(
                    `update orders
                        set status = 4
                    where
                        id = $1`,
                    [id]
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
        await client.query(
            `update orders
                set status = 5
            where
                id = $1`,
            [id]
        )

        await client.query('commit');
        client.release();

        return {
            isSuccess: true
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
                await client.query(
                    `update orders
                        set status = 1
                    where
                        id = $1`,
                    [id]
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