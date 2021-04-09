import { Avatar } from 'primereact/avatar';
import { Rating } from 'primereact/rating';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { Calendar } from 'primereact/calendar';
import Quill from '../Quill';
import { useEffect, useRef, useState } from 'react';
import { Galleria } from 'primereact/galleria';
import { Dialog } from 'primereact/dialog';

import { addLocale } from 'primereact/api';

import styles from './style.module.scss';

const DesignerCard = ({
    designer, edit, setEdit,
    update, admin = true,
    user, getDesigner
}) => {

    const galleria = useRef();

    const [date, setDate] = useState(null);
    const [engagedInput, setEngagedInput] = useState(false);

    const [activeIndex, setActiveIndex] = useState(0);

    const [designerUpdated, setDesignerUpdated] = useState(designer);

    const [deleteReviewId, setDeleteReviewId] = useState(null);

    const [errorText, setErrorText] = useState(null);

    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    addLocale('ru', {
        firstDayOfWeek: 1,
        dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        dayNamesShort: ['Воск', 'Пон', 'Вт', 'Ср', 'Четв', 'Пят', 'Суб'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        today: 'Сегодня',
        clear: 'Очистить'
    })

    const setDesigner = (json) => {
        setDesignerUpdated(prev => ({
            ...prev, ...json
        }));
    }

    useEffect(() => {
        let date = new Date((designer?.engaged_date + new Date().getTimezoneOffset() * 60) * 1000);

        if (date < new Date()) date = new Date();

        setDate(date);
        setDesignerUpdated(designer);
    }, [designer]);

    const renderCard = (data, key) => {
        const footer = (
            <span key={key}>
                <Button>
                    {user?.mainRole === 'admin' && <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/portfolios/${data.id}`}>Обзор</Link>}
                    {user?.mainRole === 'designer' && <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/designer/portfolio/${data.id}`}>Обзор</Link>}
                </Button>
            </span>
        );

        const header = (
            <img
                style={{ maxHeight: '530px' }}
                alt={data.title}
                src={`${process.env.NEXT_PUBLIC_API_URL}/${data?.preview}`}
                onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}
            />
        );

        return (
            <Card
                key={key}
                className='p-m-2'
                style={{ width: '48%' }}
                title={data.title}
                footer={footer}
                header={header}
            >
            </Card>
        );
    }

    const renderOfferCard = (data, key) => {
        const footer = (
            <div key={key} className='p-d-flex p-ai-center p-jc-between p-pl-4 p-pr-4'>
                <h3>Стоимость: {data.price}₽</h3>
                <Button>
                    {user?.mainRole === 'admin' && <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/offers/${data.id}`}>Обзор</Link>}
                    {user?.mainRole === 'designer' && <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/designer/offers/${data.id}`}>Обзор</Link>}
                </Button>
            </div>
        );

        const header = (
            <img
                style={{ maxHeight: '330px' }}
                alt={data.title}
                src={`${process.env.NEXT_PUBLIC_API_URL}/${data?.preview}`}
                onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}
            />
        );

        return (
            <Card
                key={key}
                className='p-m-2'
                style={{ width: '48%' }}
                title={data.title}
                footer={footer}
                header={header}
            >
            </Card>
        );
    }

    const itemTemplate = (item) => {
        return <img src={`${process.env.NEXT_PUBLIC_API_URL}/${item}`} alt='Отзыв' style={{ width: '100%', display: 'block' }} />;
    }

    const renderReviews = (data, key) => {
        return (
            <div key={key} className='p-m-4'>
                <div className='p-d-flex p-ai-center'>
                    <Avatar shape="circle" image={data.user.photo} size="xlarge" />
                    <div className='p-ml-3'>
                        <div>
                            <b>{data.user.first_name} {data.user.last_name}</b>
                        </div>
                        <Rating value={data.rating} readOnly stars={5} cancel={false} className='p-mt-2' />
                    </div>
                    {admin &&
                        <div className='p-ml-6'>
                            <Button
                                className='p-button-danger'
                                label='Удалить отзыв'
                                onClick={() => setDeleteReviewId(data.id)}
                            />
                        </div>
                    }
                </div>
                <hr style={{ width: '50%', marginLeft: '0' }}></hr>
                <Galleria
                    ref={galleria}
                    value={[data?.image]}
                    responsiveOptions={responsiveOptions}
                    numVisible={7}
                    style={{ maxWidth: '850px' }}
                    activeIndex={activeIndex}
                    onItemChange={(e) => setActiveIndex(e.index)}
                    circular
                    fullScreen
                    showThumbnails={false}
                    item={itemTemplate}
                    baseZIndex={1000}
                />
                <div className="p-grid" style={{ maxWidth: '400px' }}>
                    {data?.image &&
                        <div className="p-col-3">
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/${data?.image}`}
                                alt='Отзыв'
                                style={{ cursor: 'pointer', maxWidth: '200px' }}
                                onClick={() => {
                                    galleria.current.show();
                                }} />
                        </div>

                    }
                </div>
                <p style={{ whiteSpace: 'pre-wrap' }}>{data.text}</p>
            </div>
        )
    }

    const deleteReview = async () => {
        setErrorText(null);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${deleteReviewId}`, {
            method: 'DELETE',
            credentials: 'include'
        })

        if (response.ok) {
            setDeleteReviewId(null);
            getDesigner();
            return;
        }

        setErrorText('Что-то пошло не так')
    }


    const changeEngaged = async () => {
        let engaged = (date.getTime() / 1000) - (new Date().getTimezoneOffset() * 60);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${designer.id}/engaged`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                engaged
            })
        })

        if (response.ok) {
            setEngagedInput(false);
            getDesigner();
            return;
        }

        setErrorText('Что-то пошло не так');
        setEngagedInput(false);
    }

    const cancelEngaged = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${designer.id}/engaged`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                engaged: 0
            })
        })

        if (response.ok) {
            setEngagedInput(false);
            getDesigner();
            return;
        }

        setErrorText('Что-то пошло не так');
        setEngagedInput(false);
    }

    const updateVK = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${designer.id}/vk`, {
            method: 'PUT',
            credentials: 'include'
        })

        if (response.ok) {
            getDesigner();
            return;
        }

        setErrorText('Что-то пошло не так');
    }

    return (
        <>
            <div style={{ width: '60%', margin: 'auto' }}>
                <h1>Карточка дизайнера:</h1>
            </div>
            <div style={{ width: '50%', margin: 'auto' }} className='p-mt-6 p-mb-4'>
                <div className='p-d-flex p-ai-top'>
                    <img src={designer?.photo} style={{ borderRadius: '45px' }} />
                    <div className='p-ml-3'>
                        <div>
                            <b>{designer?.first_name} {designer?.last_name}</b>
                        </div>
                        <div className='p-d-flex p-ai-center p-mt-3'>
                            <Rating value={designer?.rating} readOnly stars={5} cancel={false} />
                            <span className='p-ml-3'>{designer?.rating}</span>
                        </div>
                        <div className='p-d-flex p-ai-center'>
                            <span className='p-mr-3'>
                                {designer?.engaged ?
                                    <p>Освободится {new Date((designer?.engaged_date + new Date().getTimezoneOffset() * 60) * 1000).toLocaleDateString("ru-RU")}</p>
                                    :
                                    <p>Свободен</p>
                                }
                            </span>
                        </div>
                        <Button
                            label='Изменить статус активности'
                            onClick={() => setEngagedInput(true)}
                        />
                        {edit &&
                            <Button className='p-mt-2' label='Обновить информацию из Вконтакте' onClick={() => updateVK()} />
                        }
                        <Dialog
                            className={styles.dialog}
                            header='Когда освободишься?'
                            visible={engagedInput}
                            onHide={() => setEngagedInput(false)}
                            contentStyle={{ overflow: 'visible' }}
                        >
                            <Calendar
                                value={date}
                                onChange={(e) => setDate(e.value)}
                                mask="99.99.9999"
                                dateFormat='dd.mm.yy'
                                locale='ru'
                                minDate={new Date()}
                            />
                            <br />
                            <Button
                                className='p-mt-4'
                                label='Подтведить'
                                onClick={() => changeEngaged()}
                            />
                            {designer?.engaged &&
                                <Button
                                    className='p-mt-4 p-ml-3'
                                    label='Освободился'
                                    onClick={() => cancelEngaged()}
                                />
                            }
                        </Dialog>
                    </div>
                </div>
                <div>
                    <h3>О себе:</h3>
                    {edit ?
                        <div style={{ width: '100%', height: '300px' }}>
                            <Quill
                                text={designerUpdated?.bio}
                                setText={(e) => setDesigner({ bio: e })}
                            ></Quill>
                        </div>
                        :
                        <div dangerouslySetInnerHTML={{ __html: designer?.bio }} />
                    }
                </div>
                <div className='p-m-3' style={{ textAlign: 'center' }}>
                    {!edit && <Button label='Редактировать профиль' icon='pi pi-pencil' onClick={() => setEdit(!edit)} />}
                    {edit &&
                        <>
                            <Button label='Отменить' className='p-mr-3' disabled={!edit} onClick={() => setEdit(!edit)} />
                            <Button label='Сохранить' onClick={() => update(designerUpdated)} />
                        </>
                    }
                </div>
            </div>
            {admin &&
                <div style={{ textAlign: 'center', width: '80%', margin: 'auto' }}>
                    <h3>Работы:</h3>
                    <Button>
                        <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/portfolios/create?designer_id=${designer?.id}`}>Добавить</Link>
                    </Button>
                    {designer?.previews?.length > 0 ?
                        (<div
                            style={{ display: 'flex', flexWrap: 'wrap' }}
                        >
                            {designer?.previews?.map((el, i) => renderCard(el, i))}
                        </div>)
                        :
                        <p style={{ textAlign: 'center' }}>У этого дизайнера пока нет работ</p>
                    }
                </div>
            }
            {admin &&
                <div style={{ textAlign: 'center', width: '80%', margin: 'auto' }}>
                    <h3>Предложения:</h3>
                    <Button>
                        <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/offers/create?designer_id=${designer?.id}`}>Добавить</Link>
                    </Button>
                    {designer?.offers?.length > 0 ?
                        (<div
                            style={{ display: 'flex', flexWrap: 'wrap' }}
                        >
                            {designer?.offers?.map((el, i) => renderOfferCard(el, i))}
                        </div>)
                        :
                        <p style={{ textAlign: 'center' }}>У этого дизайнера пока нет предложений</p>
                    }
                </div>
            }
            <div style={{ width: '70%', margin: 'auto' }}>
                <h3 style={{ textAlign: 'center' }}>Отзывы:</h3>
                <div>
                    {designer?.reviews?.length > 0 ?
                        designer?.reviews?.map((el, i) => renderReviews(el, i))
                        :
                        <p style={{ textAlign: 'center' }}>У этого дизайнера пока нет отзывов</p>
                    }
                </div>
            </div>
            <Dialog
                header='Внимание!'
                visible={!(deleteReviewId === null)}
                style={{ with: '50vw' }}
                onHide={() => setDeleteReviewId(null)}
            >
                Вы уверены, что хотите удалить отзыв?
                <br />
                <div className='p-mt-4'>
                    <Button
                        label='Да'
                        onClick={deleteReview}
                    />
                    <Button
                        className='p-ml-4'
                        label='Отмена'
                        onClick={() => setDeleteReviewId(null)}
                    />
                </div>
            </Dialog>
            <Dialog
                header='Ошибка!'
                visible={!errorText === null}
                style={{ width: '50vw' }}
                onHide={() => setErrorText(null)}
            >
                {errorText}
            </Dialog>
        </>
    )
}

export default DesignerCard;