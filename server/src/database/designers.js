"use strict";

const pool = require('./pg/pool').getPool();
const e = require('express');
const {
    getUserInfo,
    getUsersInfo
} = require('../helper/vk')

async function getDesigners(from, to, engaged, from_id, order) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let params = [];
        let offset = '';
        let limit = '';
        let _engaged = '';
        let filter = '';
        let _order = 'desc';

        let date = Math.floor(new Date() / 1000) - (new Date().getTimezoneOffset() * 60);

        if (from !== undefined) {
            params.push(from);
            offset = `offset $${params.length}`;
        }
        if (to !== undefined) {
            params.push(to);
            limit = `limit $${params.length}`;
        }
        if (engaged !== undefined) {
            params.push(date);
            if (Number(engaged) === 1)
                _engaged = `where d.engaged_date < $${params.length}`;
            else if (Number(engaged) === 2)
                _engaged = `where d.engaged_date > $${params.length}`
        }
        if (from_id !== undefined) {
            params.push(from_id);
            if (_engaged !== '') {
                filter = `and d.id < $${params.length}`;
            } else {
                filter = `where d.id < $${params.length}`;
            }
        }
        if (order !== undefined) {
            if (order === 'asc') _order = order;
            else if (order === 'desc') _order = order;
        }

        let designers = (await client.query(
            `select 
                d.id, 
                d.vk_id, 
                d.rating, 
                d.first_name, 
                d.last_name, 
                d.photo,
                d.engaged_date,
                count( 1 ) over ()::int 
            from 
                designers as d
            ${_engaged} ${filter}
            order by d.rating ${_order}
            ${offset}
            ${limit}`,
            [...params]
        )).rows;

        let count = 0;
        let result = {
            isSuccess: true
        }

        if (designers.length > 0) {
            count = designers[0].count;
            designers.forEach(element => {
                element.engaged = element.engaged_date < date;
                element.engaged_date = Number(element.engaged_date);
                element.rating = Number(element.rating);
                delete element.count
            });

            result.from_id = from_id === undefined ? designers[0].id : Number(from_id);
        }

        await client.query('commit');
        client.release();

        return {
            ...result,
            count,
            designers
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

async function getDesigner(id, vk_id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let params = [];
        let where = '';

        if (id !== undefined) {
            params.push(id);
            where = `id = $${params.length}`;
        }
        if (vk_id !== undefined) {
            params.push(id);
            where = `vk_id = $${params.length}`;
        }

        let designer = (await client.query(
            `select d.id, d.vk_id, d.rating, d.bio, d.photo, d.first_name, d.last_name, d.engaged_date
                from designers as d
            where 
                ${where}`,
            [...params]
        )).rows[0];

        if (designer !== undefined) {
            if (designer.engaged_date !== null) {
                designer.engaged_date = Number(designer.engaged_date);
                let date = new Date();
                designer.engaged = designer.engaged_date > (date.getTime() / 1000 + date.getTimezoneOffset() * 60);
            }

            await client.query('commit');
            client.release();

            designer.rating = Number(designer.rating);

            return {
                isSuccess: true,
                designer
            }
        }

        throw 'Designer not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.log(e)

        return {
            isSuccess: false
        }
    }
}

async function getReviews(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let reviews = (await client.query(
            `select * 
                from reviews
            where
                id = any((
                    select rd.review_id
                        from reviews_designers as rd
                    where
                        rd.designer_id = $1
                ))`,
            [id]
        )).rows;

        if (reviews !== undefined) {
            await client.query('commit');
            client.release();

            reviews.forEach(element => element.rating = Number(element.rating));

            return {
                isSuccess: true,
                reviews
            }
        }

        throw 'reviews not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        return {
            isSuccess: false
        }
    }
}

async function getDesignerPreviews(id, from, to) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let params = [id];
        let offset = ''
        let limit = ''

        if (from !== undefined) {
            params.push(from);
            offset = `offset $${params.length}`;
        }
        if (to !== undefined) {
            params.push(to);
            limit = `limit $${params.length}`;
        }

        let previews = (await client.query(
            `select p.id, p.title, p.preview, count( 1 ) over ()::int
                from portfolio as p, designers_portfolios as dp
            where 
                p.id = dp.portfolio_id and dp.designer_id = $1
            order by p.id desc
            ${offset}
            ${limit}`,
            [...params]
        )).rows;

        let count = 0;
        if (previews.length > 0) {
            count = previews[0].count;
            previews.forEach(element => delete element.count);
        }

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            count,
            previews
        }
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e)

        return {
            isSuccess: false
        }
    }
}

async function getDesignerOffers(id, from, to) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let params = [id];
        let offset = ''
        let limit = ''

        if (from !== undefined) {
            params.push(from);
            offset = `offset $${params.length}`;
        }
        if (to !== undefined) {
            params.push(to);
            limit = `limit $${params.length}`;
        }

        let offers = (await client.query(
            `select o.id, o.title, o.preview, o.price, count( 1 ) over ()::int
                from offers as o, designers_offers as od
            where
                o.id = od.offer_id and od.designer_id = $1
            order by o.id desc
            ${offset}
            ${limit}`,
            [...params]
        )).rows;

        let count = 0;
        if (offers.length > 0) {
            count = offers[0].count;
            offers.forEach(element => delete element.count);
        }

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            count,
            offers
        }
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.log(e);

        return {
            isSuccess: false
        }
    }
}

async function getOrders(id, from, to) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let params = [id];
        let offset = '';
        let limit = '';

        if (from !== undefined) {
            params.push(from);
            offset = `offset $${params.length}`;
        }
        if (to !== undefined) {
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
                od.designer_id = $1 and
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

async function createDesigner(vk_id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        if (vk_id.includes('https')) {
            vk_id = vk_id.match(/https?:\/\/.*\/(.*)\/?/)[1];
        }

        let designer = await getUserInfo(vk_id);

        if (!designer.isSuccess) throw 'vk user not found';

        let designer_ = (await client.query(
            `select d.id
                from designers as d
            where
                d.vk_id = $1`,
            [designer.user.id]
        )).rows[0];

        if (designer_ !== undefined) throw 'user with the same name alredy exists';


        designer = (await client.query(
            `insert into designers
                (vk_id, first_name, last_name, photo)
            values
                ($1, $2, $3, $4)
            returning id`,
            [designer.user.id, designer.user.first_name, designer.user.last_name, designer.user.photo_max]
        )).rows[0].id;

        if (designer !== undefined) {
            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                id: designer
            }
        }

        throw 'Failed to create designer';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function deleteDesigner(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let paths = [];

        let portfolios = (await client.query(
            `select 
                dp.portfolio_id as id,
                p.preview,
                p.work_image
            from 
                designers_portfolios as dp,
                portfolio as p
            where 
                dp.designer_id = $1 and
                p.id = dp.portfolio_id`,
            [id]
        )).rows;

        if (portfolios.length !== 0) {
            portfolios = portfolios.map(el => {
                paths.push(el.preview);
                paths.push(el.work_image);

                return el.id;
            });

            await client.query(
                `delete from portfolio
                where id = any($1)`,
                [portfolios]
            )
        }

        let offers = (await client.query(
            `select 
                od.offer_id as id,
                o.preview
            from 
                designers_offers as od,
                offers as o
            where 
                od.designer_id = $1 and
                o.id = od.offer_id`,
            [id]
        )).rows;

        let orders = [];
        let comments = [];
        let reviews = [];

        if (offers.length !== 0) {
            offers = offers.map(el => {
                paths.push(el.preview);

                return el.id;
            });

            orders = (await client.query(
                `select id
                from orders
                where offer_id = any($1)`,
                [offers]
            )).rows;

            if (orders.length !== 0) {
                orders = orders.map(el => el.id);

                comments = (await client.query(
                    `select id
                    from orders_comments
                    where order_id = any($1)`,
                    [orders]
                )).rows;

                if (comments.length !== 0) {
                    comments = comments.map(el => el.id);

                    await client.query(
                        `delete from orders_comments
                        where id = any($1)`,
                        [comments]
                    );
                }

                let reviews = (await client.query(
                    `select 
                        id,
                        image
                    from 
                        reviews
                    where
                        order_id = any($1)`,
                    [orders]
                )).rows;

                if (reviews.length !== 0) {
                    reviews = reviews.map(el => {
                        if (el.image.indexOf('reviews/') !== -1)
                            paths.push(el.image);

                        return el.id;
                    })

                    await client.query(
                        `delete from reviews
                        where id = any($1)`,
                        [reviews]
                    );
                }

                await client.query(
                    `delete from orders
                    where id = any($1)`,
                    [orders]
                );
            }

            await client.query(
                `delete from offers
                where id = any($1)`,
                [offers]
            );
        }

        await client.query(
            `delete from designers
            where
                id = $1`,
            [id]
        );

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            paths
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

async function updateInfo(id, bio) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let designer = (await client.query(
            `update designers
                set bio = $1
            where
                id = $2`,
            [bio, id]
        ));

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

async function updateEngaged(id, engaged) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `update designers
            set engaged_date = $2
            where id = $1`,
            [id, engaged]
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

async function updateVkInfo(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let designerVkId = (await client.query(
            `select vk_id
            from designers
            where id = $1`,
            [id]
        )).rows[0];

        if (designerVkId !== undefined) {
            designerVkId = designerVkId.vk_id;

            let info = await getUserInfo(designerVkId);

            if (info.isSuccess) {
                info = info.user;

                await client.query(
                    `update designers
                    set
                        first_name = $2,
                        last_name = $3,
                        photo = $4
                    where
                        id = $1`,
                    [id, info.first_name, info.last_name, info.photo_max]
                );

                await client.query('commit');
                client.release();

                return {
                    isSuccess: true
                }
            }

            throw 'Vk network error';
        }

        throw 'Designer not found';
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
    getDesigners,
    getDesigner,
    getReviews,
    getDesignerPreviews,
    getDesignerOffers,
    getOrders,
    createDesigner,
    deleteDesigner,
    updateInfo,
    updateEngaged,
    updateVkInfo
}