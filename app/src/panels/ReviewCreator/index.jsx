import { PanelHeader, PanelHeaderBack, Panel, FormLayout, Group, FormItem, Textarea, File, Button } from '@vkontakte/vkui';
import React, { useState } from 'react';
import {useRouter} from '@unexp/router';
import { checkPhotoAndGetSrc } from '../../utils/helpers';
import useInput from '../../utils/useInput';
import StarRatings from '../../components/StarRatings';
import { connect } from 'react-redux';
import { Icon24Document } from '@vkontakte/icons'

import styles from './style.module.scss';
import { alertContext } from '../../App';

const ReviewCreator = ({ id, activeOrder }) => {

    const {back} = useRouter();
    const { useAlert, useSpinner } = alertContext();

    const [rating, setRating] = useState(1);
    const [previewFile, setPreviewFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const review = useInput('');

    const changeRating = (rating) => {
        setRating(rating);
    }

    const changePreview = async (event) => {
        try {
            const [src, image] = await checkPhotoAndGetSrc(event.target.files);
            setPreviewFile(image);
            setPreview(src);
        } catch (error) {
            useAlert.show('Ошибка', error.message);
        }
    }

    const submit = async (event) => {
        event.preventDefault();

        if(!review){
            useAlert.show('Ошибка', 'Введите отзыв');
            return;
        }

        try {
            useSpinner.showSpinner();

            await activeOrder.sendReview({
                rating, 
                image: previewFile,
                text: review.value
            })

            useAlert.show('Отправка отзыва', 'Отзыв отправлен успешно!', [{
                title: 'Вернуться',
                autoclose: true,
                action: back
            }], back);

        } catch (error) {
            useAlert.show('Ошибка', error.message)
        }
    }

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={back} />}>
                Отзыв
            </PanelHeader>
            <FormLayout onSubmit={submit}>
                <Group>
                    <FormItem top='Оценка за выполненую работу'>
                        <StarRatings
                            rating={rating}
                            changeRating={changeRating}
                            showRatingNumber={false}
                            starDimension='30px'
                            starSpacing='10px'
                        />
                    </FormItem>
                    <FormItem top='Ваш отзыв'>
                        <Textarea {...review} />
                    </FormItem>
                    <FormItem top='Изображение выполненной работы'>
                        <File
                            before={<Icon24Document />}
                            stretched
                            controlSize='l'
                            onChange={changePreview}
                            accept='.png, .jpg, .jpeg, .gif, .svg'
                        />
                    </FormItem>
                    {preview &&
                        <div className={styles.preview}>
                            <img src={preview} alt='превью' style={{ maxHeight: 300, maxWidth: '100%' }} />
                        </div>
                    }
                </Group>
                <Group>
                    <FormItem>
                        <Button stretched size='l' mode='commerce'>
                            Отправить отзыв
                        </Button>
                    </FormItem>
                </Group>
            </FormLayout>
        </Panel>
    )
}

const mapStateToProps = (state) => ({
    activeOrder: state.order.activeOrder
})

export default connect(mapStateToProps)(ReviewCreator)