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

async function getPreviewsFromTo(from, to, from_id) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        const params = [];
        let filter = '';
        let offset = '';
        let limit = '';

        if (from_id) {
            params.push(from_id);
            filter = `where p.id <= $${params.length}`;
        }
        if (from) {
            params.push(from);
            offset = `offset $${params.length}`;
        }
        if (to) {
            params.push(to);
            limit = `limit $${params.length}`;
        }

        let { rows: previews } = await client.query(
            `with tmp as (
                select id, title, preview, count( 1 ) over ()::int  
                    from portfolio
            )
            select * 
                from tmp as p
            ${filter}
            order by p.id desc
            ${offset}
            ${limit}`,
            params
        );

        let count = previews[0].count;
        previews.forEach(element => delete element.count);

        await client.query('commit');
        client.release();

        return {
            isSuccess: true,
            count,
            from_id: from_id === undefined ? previews[0].id : Number(from_id),
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

async function getPreviewsTags(from, to, from_id, tags) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        const params = [];
        let filter = '';
        let offset = '';
        let limit = '';

        if (from_id) {
            params.push(from_id);
            filter = `and p.id <= $${params.length}`;
        }
        if (from) {
            params.push(from);
            offset = `offset $${params.length}`;
        }
        if (to) {
            params.push(to);
            limit = `limit $${params.length}`;
        }

        params.push(tags);

        let { rows: previews } = await client.query(
            `select p.id, p.title, p.preview, count( 1 ) over ()::int  
                from portfolio as p, tags_portfolios as tp
            where p.id = tp.portfolio_id and tp.tag_id = any($${params.length}) ${filter}
            order by p.id desc
            ${offset}
            ${limit}`,
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
            `${full !== true ? 'select *' : 'select p.project_description, p.work_image'}
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
            }

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
                        let user = userVkId.find(el => el.id === element.vk_user_id);
                        element.user = user;
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
        if (to) {
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
            ${limit}`,
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
                    let user = userVkId.find(el => el.id === element.vk_user_id);
                    element.user = user;
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

async function updateImagePaths(id, preview, work_image) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let set = [];
        let params = [];

        if (work_image !== undefined) {
            params.push(work_image);
            set.push(`work_image = $${params.length + 1}`);
        }
        if (preview !== undefined) {
            params.push(preview);
            set.push(`preview = $${params.length + 1}`);
        }

        await client.query(
            `update portfolio
                set ${set.join(',')}
            where
                id = $1`,
            [id, ...params]
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

async function createWork(
    title, preview,
    project_description, work_image,
    designer_id, tag_ids
) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let id = (await client.query(
            `insert into
                portfolio (title, preview, project_description, work_image)
            values 
                ($1, $2, $3, $4)
            returning id`,
            [title, preview, project_description, work_image]
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

async function addTags(portfolio_id, tag_ids) {
    const client = await pool.connect();
    await client.query('begin');

    try {
        let s = tag_ids.map((_, i) => (i += 2, `($1, $${i})`)).join(',');

        let tags = (await client.query(
            `insert into 
                tags_portfolios (portfolio_id, tag_id)
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
                ` select count(pl.*)
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

                likes.count = Number.parseInt(likes.count) + 1;
                likes.from_user = true;
            } else {
                await client.query(
                    `delete from
                        portfolios_likes
                    where
                        portfolio_id = $1 and
                        vk_user_id = $2`,
                    [id, vk_id]
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

        console.log(e);

        return {
            isSuccess: false
        }
    }
}

async function addComment(id, text, vk_id) {
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
            const date = Math.floor(new Date().getTime() / 1000) - (new Date().getTimezoneOffset() * 60)

            const comment = (await client.query(
                `insert into 
                    portfolios_comments (portfolio_id, vk_user_id, text, create_date)
                values
                    ($1, $2, $3, $4)
                returning id`,
                [id, vk_id, text, date]
            )).rows[0].id;

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
                tags_portfolios (portfolio_id, tag_id)
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

        if (images !== undefined) {
            await client.query(
                `delete from portfolio
                where
                    id = $1`,
                [id]
            );

            await client.query('commit');
            client.release();

            return {
                isSuccess: true,
                images
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
        await client.query(
            `delete 
                from portfolios_comments
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
    addTags,
    addLike,
    addComment,
    updateTags,
    updateDescription,
    updateImagePaths,
    deleteWork,
    deleteComment
}