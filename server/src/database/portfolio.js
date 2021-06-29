"use strict";

const { getUsersInfo } = require('../helper/vk');

const pool = require('./pg/pool').getPool();

async function getAllPreviews() {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let previews = (await client.query(
            `select id, title, preview
                from portfolio
            order by id desc`
        )).rows;

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            previews
        }

    } catch (e) {
        await client.query('rollback');
        client.release();

        return {
            isSuccess: false
        }
    }
}

async function getPreviewsFromTo(from, to, from_id, sort_by, direction, viewHidden, viewNotVerified) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        const params = [];
        let filter = '';
        let offset = '';
        let limit = '';
        let sort = 'p.id';
        let dir = 'desc';
        let where = 'where';

        let sortTypes = ['likes', 'views', 'id', 'popularity'];
        let dirTypes = ['desc', 'asc'];

        if (from_id) {
            params.push(from_id);
            filter = `where p.id <= $${params.length}`;
        }
        if (from) {
            params.push(from);
            offset = `offset $${params.length}`;
        }
        if (to && to !== 'all') {
            params.push(to);
            limit = `limit $${params.length}`;
        }
        if (sort_by && sortTypes.indexOf(sort_by) !== -1) {
            sort = `p.${sort_by}`;
        }
        if (direction && dirTypes.indexOf(direction) !== -1) {
            if (direction === 'asc')
                dir = 'asc nulls first';
            else
                dir = 'desc nulls last';
        }
        if (!viewHidden) {
            where += ' p.is_hidden = false';
            if (!viewNotVerified)
                where += ' and p.is_verified = true'
        } else {
            if (!viewNotVerified)
                where += ' p.is_verified = true'
        }


        let { rows: previews } = await client.query(
            `with likes as (
                select 
                    portfolio_id, 
                    count(vk_user_id) as likes
                from 
                    portfolios_likes
                group by portfolio_id
            ),
            tmp as (
                select distinct
                    p.id, 
                    p.views,
                    p.title, 
                    p.preview, 
                    p.popularity,
                    p.is_hidden,
                    p.is_verified,
                    l.likes
                from 
                    tags_portfolios as tp,
                    portfolio as p
                left outer join 
                    likes as l 
                on 
                    p.id = l.portfolio_id
                ${Boolean(!viewNotVerified || !viewHidden) ? where : ''}
            )
            select
                p.id, 
                p.title, 
                p.preview, 
                p.is_hidden,
                p.is_verified,
                count( 1 ) over ()::int
            from 
                tmp as p
            ${filter}
            order by ${sort} ${dir}
            ${offset}
            ${limit !== '' ? limit : ''}`,
            params
        );

        let count = 0;

        let result = {
            isSuccess: true
        }

        if (previews.length > 0) {
            count = previews[0].count;
            previews.forEach(element => delete element.count);
            result.from_id = from_id === undefined ? previews[0].id : Number(from_id);
        }

        await client.query('commit');
        client.release();

        return {
            ...result,
            count,
            previews
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

async function getPreviewsTags(from, to, from_id, tags, sort_by, direction, viewHidden, viewNotVerified) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        const params = [];
        let filter = '';
        let offset = '';
        let limit = '';
        let sort = 'p.id';
        let dir = 'desc';
        let where = '';

        let sortTypes = ['likes', 'views', 'id', 'popularity'];
        let dirTypes = ['desc', 'asc'];

        if (from_id) {
            params.push(from_id);
            filter = `and p.id <= $${params.length}`;
        }
        if (from) {
            params.push(from);
            offset = `offset $${params.length}`;
        }
        if (to && to !== 'all') {
            params.push(to);
            limit = `limit $${params.length}`;
        }
        if (sort_by && sortTypes.indexOf(sort_by) !== -1) {
            sort = `p.${sort_by}`;
        }
        if (direction && dirTypes.indexOf(direction) !== -1) {
            if (direction === 'asc')
                dir = 'asc nulls first';
            else
                dir = 'desc nulls last';
        }
        if (!viewHidden) {
            where += 'and p.is_hidden = false';
            if (!viewNotVerified)
                where += ' and p.is_verified = true'
        } else {
            if (!viewNotVerified)
                where += 'and p.is_verified = true'
        }

        params.push(tags);

        let { rows: previews } = await client.query(
            `with likes as (
                select 
                    portfolio_id, 
                    count(vk_user_id) as likes
                from 
                    portfolios_likes
                group by portfolio_id
            ),
            tmp as (
                select distinct
                    p.id, 
                    p.views,
                    p.title, 
                    p.preview, 
                    p.popularity,
                    l.likes
                from 
                    tags_portfolios as tp,
                    portfolio as p
                left outer join 
                    likes as l 
                on 
                    p.id = l.portfolio_id
                where
                    p.id = tp.portfolio_id and 
                    tp.tag_id = any($${params.length}) ${filter} ${Boolean(!viewHidden || !viewNotVerified) ? where : ''}
            )
            select
                p.id, 
                p.title, 
                p.preview, 
                count( 1 ) over ()::int
            from 
                tmp as p
            order by ${sort} ${dir}
            ${offset}
            ${limit !== '' ? limit : ''}`,
            params
        );

        let count = 0;

        let result = {
            isSuccess: true
        }

        if (previews.length > 0) {
            count = previews[0].count;
            previews.forEach(element => delete element.count);
            result.from_id = from_id === undefined ? previews[0].id : Number(from_id);
        }

        await client.query('commit');
        client.release();

        return {
            ...result,
            count,
            previews
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

async function getWork(id, full, vk_id = undefined) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let work = (await client.query(
            `select *
                from portfolio as p
            where p.id = $1`,
            [id]
        )).rows[0];

        if (work !== undefined) {
            let tags = (await client.query(
                `select * 
                    from tags as t, tags_portfolios as tp
                where 
                    tp.portfolio_id = $1 and t.id = tp.tag_id`,
                [id]
            )).rows;

            let { rows: images } = await client.query(
                `select 
                    * 
                from 
                    portfolios_images
                where
                    portfolio_id = $1
                order by position asc`,
                [id]
            )

            work.images = images;

            let user = (await client.query(
                `select d.vk_id, d.first_name, d.last_name, d.id, d.photo, d.rating
                    from designers as d, designers_portfolios as dp
                where 
                    dp.portfolio_id = $1 and d.id = dp.designer_id`,
                [id]
            )).rows[0];

            let likes = (await client.query(
                `select count(pl.*)::int
                    from portfolios_likes as pl
                where
                    pl.portfolio_id = $1`,
                [id]
            )).rows[0];

            work.likes = likes;

            if (vk_id !== undefined) {
                let viewed = (await client.query(
                    `select
                        id
                    from
                        vieweds
                    where
                        vk_id = $1 and
                        portfolio_id = $2`,
                    [vk_id, id]
                )).rows[0];

                if (viewed !== undefined) {
                    work.viewed = true;
                    await client.query(
                        `delete 
                            from vieweds
                        where
                            id = $1`,
                        [viewed.id]
                    )
                } else
                    work.viewed = false;

                await client.query(
                    `insert into
                        vieweds (vk_id, portfolio_id)
                    values
                        ( $1, $2 )`,
                    [vk_id, id]
                )

                let likeFromUser = (await client.query(
                    `select pl.id
                        from portfolios_likes as pl
                    where
                        pl.portfolio_id = $1 and
                        pl.vk_user_id = $2`,
                    [id, vk_id]
                )).rows[0];

                if (likeFromUser !== undefined) {
                    work.likes.from_user = true;
                } else {
                    work.likes.from_user = false;
                }

                let inFavorites = (await client.query(
                    `select 
                        id
                    from
                        favorites
                    where
                        vk_id = $1 and
                        portfolio_id = $2`,
                    [vk_id, id]
                )).rows[0];

                if (inFavorites !== undefined) {
                    work.in_favorites = true;
                } else {
                    work.in_favorites = false;
                }
            }

            await client.query(
                `update
                    portfolio
                set 
                    views = views + 1,
                    popularity = popularity + 1
                where
                    id = $1`,
                [id]
            );

            work.views = work.views + 1;

            await client.query('commit');
            client.release();

            if (tags.length > 0) work.tags = tags;
            if (user !== undefined) {
                user.rating = Number(user.rating);
                work.author = user;
            }

            return {
                isSuccess: true,
                work
            };
        }

        throw 'Work not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function getWorkViews(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let work = (await client.query(
            `select views
                from portfolio
            where id = $1`,
            [id]
        )).rows[0];

        if (work !== undefined) {
            await client.query(
                `update
                    portfolio
                set 
                    views = views + 1
                where
                    id = $1`,
                [id]
            );

            work.views = work.views + 1;

            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                work
            }
        }

        throw 'Work not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function getWorkComments(id, from, to = 20, from_id, all = false) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        if (all) {
            const comments = (await client.query(
                `select *, count( 1 ) over ()::int
                    from portfolios_comments
                where
                    portfolio_id = $1
                order by create_date desc`,
                [id]
            )).rows;

            await client.query('commit');
            client.release();

            let count = 0;
            let userVkId = [];

            if (comments.length > 0) {
                count = comments[0].count;
                comments.forEach(el => {
                    userVkId.push(el.vk_user_id);
                    delete el.count;
                });

                userVkId = await getUsersInfo(userVkId);

                if (userVkId.isSuccess) {
                    userVkId = userVkId.users;
                    comments.forEach(element => {
                        element.user = userVkId.find(el => el.id === element.vk_user_id);
                        if(element.reply_to_vk_id !== null){
                            element.reply_to = userVkId.find(el => el.id === element.reply_to_vk_id);
                        }
                    })
                }
            }

            return {
                isSuccess: true,
                count,
                comments
            }
        }

        const params = [];
        let filter = '';
        let offset = '';
        let limit = '';

        if (from_id) {
            params.push(from_id);
            filter = `and id <= $${params.length}`;
        }
        if (from) {
            params.push(from);
            offset = `offset $${params.length}`;
        }
        if (to && to !== 'all') {
            params.push(to);
            limit = `limit $${params.length}`;
        }

        params.push(id);

        let { rows: comments } = await client.query(
            `select *, count( 1 ) over ()::int
            from portfolios_comments
            where 
            portfolio_id = $${params.length} ${filter}
            order by create_date desc
            ${offset}
            ${limit !== '' ? limit : ''}`,
            params
        )

        let count = 0;
        let userVkId = [];

        if (comments.length > 0) {
            count = comments[0].count;
            comments.forEach(el => {
                userVkId.push(el.vk_user_id);
                delete el.count;
            });

            userVkId = await getUsersInfo(userVkId);

            if (userVkId.isSuccess) {
                userVkId = userVkId.users;

                comments.forEach(element => {
                    element.user = userVkId.find(el => el.id === element.vk_user_id);
                    if(element.reply_to_vk_id !== null){
                        element.reply_to = userVkId.find(el => el.id === element.reply_to_vk_id);
                    }
                })
            }
        }

        await client.query('commit');
        client.release();

        let result = {
            isSuccess: true,
            count,
            comments
        }

        if (comments.length > 0) {
            result.from_id = from_id === undefined ? comments[0].id : Number(from_id);
        }

        return result;
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }

}

async function getImagesNames(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let imageNames = (await client.query(
            `select preview, work_image
                from portfolio
            where
                id = $1`,
            [id]
        )).rows[0];

        if (imageNames !== undefined) {
            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                imageNames
            }
        }

        throw 'Work not found'
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function getDesignerByPortfolio(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let designer = (await client.query(
            `select designer_id  
                from designers_portfolios
            where portfolio_id = $1`,
            [id]
        )).rows[0];

        if (designer !== undefined) {
            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                designer: designer.designer_id
            }
        }

        throw 'Deisgner not found'
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function updatePreviewPaths(id, preview) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `update portfolio
                set preview = $2
            where
                id = $1`,
            [id, preview]
        );

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

async function updateForSale(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `update 
                portfolio
            set
                is_for_sale = not (
                    select 
                        is_for_sale
                    from
                        portfolio
                    where
                        id = $1
                )
            where
                id = $1`,
            [id]
        );

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

async function updateHidden(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `update portfolio
            set is_hidden = not is_hidden
            where id = $1`,
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

async function updateVerified(id, status) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        const is_verified = (await client.query(
            `update 
                portfolio
            set 
                is_verified = $2
            where 
                id = $1
            returning 
                is_verified`,
            [id, status]
        )).rows[0].is_verified;

        const work = (await client.query(
            `select 
                d.vk_id,
                p.title
            from 
                designers_portfolios as dp,
                designers as d,
                portfolio as p
            where
                dp.portfolio_id = $1 and 
                d.id = dp.designer_id and
                p.id = $1`,
            [id]
        )).rows[0];

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            is_verified,
            ...work
        }
    } catch (e) {
        await client.query();
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function createWork(
    title, preview,
    project_description,
    designer_id, tag_ids,
    is_for_sale
) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        const date = Math.floor(new Date().getTime() / 1000) - (new Date().getTimezoneOffset() * 60);

        let id = (await client.query(
            `insert into
                portfolio (title, preview, project_description, is_for_sale, create_date)
            values 
                ($1, $2, $3, $4, $5)
            returning id`,
            [title, preview, project_description, is_for_sale, date]
        )).rows[0].id;

        if (id !== undefined) {
            let s = tag_ids.map((_, i) => (i += 2, `($1, $${i})`)).join(',');

            let tags = (await client.query(
                `insert into
                    tags_portfolios (portfolio_id, tag_id)
                values ${s}
                    returning id`,
                [id, ...tag_ids]
            )).rows;

            if (tags.length > 0) {
                let designer = (await client.query(
                    `insert into
                        designers_portfolios (designer_id, portfolio_id)
                    values
                        ($1, $2)
                    returning id`,
                    [designer_id, id]
                )).rows[0].id;

                if (designer !== undefined) {
                    await client.query('commit');
                    client.release();

                    return {
                        isSuccess: true,
                        id
                    }
                }

                throw 'Error when adding portfolio to designer';
            }

            throw 'Error while adding portfolio tags';
        }

        throw 'Error while creating portfolio';

    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function addImages(images, id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let s = images.map((_, i) => (`($1, $${i + 2}, ${i})`)).join(',');

        await client.query(
            `insert into
                portfolios_images (portfolio_id, path, position)
            values ${s}`,
            [id, ...images]
        );

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

async function addImage(id, name, position) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let { rows: images } = await client.query(
            `select * 
            from
                portfolios_images
            where
                portfolio_id = $1
            order by position asc`,
            [id]
        )

        if (images.length > 0) {
            if (position === undefined) {
                await client.query(
                    `insert into
                        portfolios_images (portfolio_id, path, position)
                    values
                        ($1, $2, $3)`,
                    [id, name, Number.parseInt(images[images.length - 1].position) + 1]
                )

                await client.query('commit');
                client.release();

                return {
                    isSuccess: true
                }
            } else {
                await client.query(
                    `insert into
                        portfolios_images (portfolio_id, path, position)
                    values
                        ($1, $2, $3)`,
                    [id, name, position]
                );

                images.map(async (el, i) => {
                    el.position = Number.parseInt(el.position);
                    if (el.position >= Number.parseInt(position)) {
                        el.position = Number.parseInt(el.position) + 1;

                        await client.query(
                            `update
                                portfolios_images
                            set
                                position = $1
                            where
                                id = $2`,
                            [el.position, el.id]
                        )
                    }
                });

                await client.query('commit');
                client.release();

                return {
                    isSuccess: true
                }
            }
        } else {
            await client.query(
                `insert into
                    portfolios_images(portfolio_id, path)
                values
                        ($1, $2)`,
                [id, name]
            )

            await client.query('commit');
            client.release();

            return {
                isSuccess: true
            }
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

async function addTags(portfolio_id, tag_ids) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let s = tag_ids.map((_, i) => (i += 2, `($1, $${i})`)).join(',');

        let tags = (await client.query(
            `insert into 
                tags_portfolios(portfolio_id, tag_id)
            values ${s}
                returning id`,
            [portfolio_id, ...tag_ids]
        )).rows;

        if (tags.length > 0) {
            await client.query('commit');
            client.release();

            return {
                isSuccess: true
            }
        }

        throw 'Portfolio no found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        return {
            isSuccess: false
        }
    }
}

async function addLike(id, vk_id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let work = (await client.query(
            `select id
                from portfolio
            where id = $1`,
            [id]
        )).rows[0];

        if (work !== undefined) {
            let likeFromUser = (await client.query(
                `select pl.id
                    from portfolios_likes as pl
                where
                    pl.portfolio_id = $1 and
                    pl.vk_user_id = $2`,
                [id, vk_id]
            )).rows[0];

            let likes = (await client.query(
                `select count(pl.*)
                    from portfolios_likes as pl
                where
                    pl.portfolio_id = $1`,
                [id]
            )).rows[0];

            if (likeFromUser === undefined) {
                await client.query(
                    `insert into portfolios_likes
                (portfolio_id, vk_user_id)
                    values
                    ($1, $2)`,
                    [id, vk_id]
                );

                await client.query(
                    `update
                        portfolio
                    set
                        popularity = popularity + 50
                    where
                        id = $1`,
                    [id]
                )

                likes.count = Number.parseInt(likes.count) + 1;
                likes.from_user = true;

                const designer = (await client.query(
                    `select 
                        d.vk_id 
                    from
                        designers as d,
                        designers_portfolios as dp
                    where
                        dp.portfolio_id = $1 and
                        dp.designer_id = d.id`,
                    [id]
                )).rows[0].vk_id;

                await client.query(
                    `insert into 
                        notifications (vk_id, likes)
                    values 
                        ($1, true)
                    on conflict (vk_id) do update
                    set 
                        likes = true`,
                    [designer]
                )
            } else {
                await client.query(
                    `delete from
                        portfolios_likes
                    where
                        portfolio_id = $1 and
                        vk_user_id = $2`,
                    [id, vk_id]
                )

                await client.query(
                    `update
                        portfolio
                    set
                        popularity = popularity - 50
                    where
                        id = $1`,
                    [id]
                )

                likes.count = Number.parseInt(likes.count) - 1;
                likes.from_user = false;
            }

            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                likes
            }
        }

        throw 'Work not found';

    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function addComment(id, text, vk_id, reply_id, reply_to_vk_id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let work = (await client.query(
            `select id
                from portfolio
            where id = $1`,
            [id]
        )).rows[0];

        let user = (await client.query(
            `select id
                from banned_users
            where
                vk_user_id = $1`,
            [vk_id]
        )).rows[0];

        if (user !== undefined) {
            return {
                isSuccess: false,
                error: 'Banned user'
            }
        }

        if (work !== undefined) {
            const date = Math.floor(new Date().getTime() / 1000) - (new Date().getTimezoneOffset() * 60);

            const designer = (await client.query(
                `select 
                    d.vk_id 
                from
                    designers as d,
                    designers_portfolios as dp
                where
                    dp.portfolio_id = $1 and
                    dp.designer_id = d.id`,
                [id]
            )).rows[0].vk_id;

            await client.query(
                `insert into 
                    notifications (vk_id, comments)
                values 
                    ($1, true)
                on conflict (vk_id) do update
                set 
                    comments = true`,
                [designer]
            )

            const comment = (await client.query(
                `insert into 
                    portfolios_comments(portfolio_id, vk_user_id, text, create_date, reply_id, reply_to_vk_id)
                values
                    ($1, $2, $3, $4, $5, $6)
                returning id`,
                [id, vk_id, text, date, reply_id, reply_to_vk_id]
            )).rows[0].id;

            await client.query(
                `update
                    portfolio
                set
                    popularity = popularity + 150
                where
                    id = $1`,
                [id]
            )

            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                comment: {
                    id: comment,
                    work_id: Number.parseInt(id),
                    text,
                    create_date: date
                }
            }
        }

        throw 'Work not found';

    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function updateTags(portfolio_id, tag_ids) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `delete from tags_portfolios
            where
                portfolio_id = $1`,
            [portfolio_id]
        );

        let s = tag_ids.map((_, i) => (i += 2, `($1, $${i})`)).join(',');

        let tags = (await client.query(
            `insert into 
                tags_portfolios(portfolio_id, tag_id)
            values ${s}
                returning id`,
            [portfolio_id, ...tag_ids]
        )).rows;

        if (tags.length > 0) {
            await client.query('commit');
            client.release();

            return {
                isSuccess: true
            }
        }

        throw 'Portfolio no found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function updateDescription(
    id, title, project_description
) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        await client.query(
            `update portfolio
                set title = $1, project_description = $2
            where
                id = $3`,
            [title, project_description, id]
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

async function deleteWork(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let images = (await client.query(
            `select preview, work_image
                from portfolio
            where
                id = $1`,
            [id]
        )).rows[0];


        let { rows: workImages } = await client.query(
            `select 
                path
            from 
                portfolios_images
            where
                portfolio_id = $1`,
            [id]
        )

        let imgs = [];

        for (let key in images) {
            if (images[key] !== null) imgs.push(images[key]);
        }

        workImages.map(el => {
            imgs.push(el.path);
        })

        if (images !== undefined) {
            await client.query(
                `delete from portfolio
                where
                    id = $1`,
                [id]
            );

            await client.query(
                `delete from
                    favorites
                where
                    portfolio_id = $1`,
                [id]
            );

            await client.query(
                `delete from
                    portfolios_likes
                where
                    portfolio_id = $1`,
                [id]
            );

            await client.query(
                `delete 
                from
                    portfolios_images
                where
                    portfolio_id = $1`,
                [id]
            );

            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                imgs
            }
        }

        throw 'Portfolio not found';

    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function deleteComment(id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let portfolio = (await client.query(
            `select
                portfolio_id
            from
                portfolios_comments
            where
                id = $1`,
            [id]
        )).rows[0];

        if (portfolio) {
            portfolio = portfolio.portfolio_id;

            await client.query(
                `update
                    portfolio
                set
                    popularity = popularity - 150
                where
                    id = $1`,
                [portfolio]
            )

            await client.query(
                `delete
                from 
                    portfolios_comments
                where
                    id = $1`,
                [id]
            );

            await client.query('commit');
            client.release();

            return {
                isSuccess: true
            }
        }

        throw 'Comment not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

async function deleteImage(id, position) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let { rows: image } = await client.query(
            `select *
            from 
                portfolios_images
            where
                portfolio_id = $1 and
                position = $2`,
            [id, position]
        )

        if (image[0] !== undefined) {
            await client.query(
                `delete
            from
                    portfolios_images
                where
                    id = $1`,
                [image[0].id]
            )

            let { rows: images } = await client.query(
                `select *
            from 
                    portfolios_images
                where
                    portfolio_id = $1 and
                    position > $2
                order by position asc`,
                [id, position]
            )

            images.map(async (el, i) => {
                el.position = Number.parseInt(position) + i;

                await client.query(
                    `update
                        portfolios_images
                    set
                        position = $1
                    where
                        id = $2`,
                    [el.position, el.id]
                )
            });

            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                path: image[0].path
            }
        }

        throw 'Image not found';
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);

        return {
            isSuccess: false
        }
    }
}

// updatePopularity()

async function updatePopularity() {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let { rows: portfolios } = await client.query(
            `select
                id,
                views
            from
                portfolio`
        );

        for (let el of portfolios) {
            let { rows: likes } = await client.query(
                `select 
                    count(*) 
                from 
                    portfolios_likes
                where
                    portfolio_id = $1`,
                [el.id]
            )

            let { rows: comments } = await client.query(
                `select
                    count(*)
                from
                    portfolios_comments
                where
                    portfolio_id = $1`,
                [el.id]
            )

            el.likes = parseInt(likes[0].count);
            el.comments = parseInt(comments[0].count);

            el.popularity = el.views + 50 * el.likes + 150 * el.comments;

            await client.query(
                `update
                    portfolio
                set
                    popularity = $1
                where
                    id = $2`,
                [el.popularity, el.id]
            )
        }

        await client.query('commit');
        client.release();
    } catch (e) {
        await client.query('rollback');
        client.release();

        console.error(e);
    }
}

module.exports = {
    getAllPreviews,
    getPreviewsFromTo,
    getPreviewsTags,
    getWork,
    getWorkViews,
    getWorkComments,
    getImagesNames,
    getDesignerByPortfolio,
    createWork,
    addImages,
    addImage,
    addTags,
    addLike,
    addComment,
    updateTags,
    updateDescription,
    updatePreviewPaths,
    updateForSale,
    updateHidden,
    updateVerified,
    deleteWork,
    deleteComment,
    deleteImage
}