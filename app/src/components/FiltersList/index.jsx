import React from 'react';
import PropTypes from 'prop-types';
import { Button, Div, SliderSwitch } from '@vkontakte/vkui';
import { Icon16GridOfFour, Icon24MoreHorizontal } from '@vkontakte/icons';
import { Icon16ArticleOutline } from '@vkontakte/icons';
import { Icon28SlidersOutline } from '@vkontakte/icons';
import { Icon28RefreshOutline } from '@vkontakte/icons';

import styles from './style.module.scss';
import { modalContext, sessionContext } from '../../App';

const FiltersList = ({ filters, size, changeListFormat, isChangeSize, updateList }) => {

    const { setActiveModal } = modalContext();
    const showFilterButton = Boolean(filters && Object.keys(filters).length)
    const { isDesktop } = sessionContext();

    return (
        <>
            {Boolean(isChangeSize || showFilterButton || isDesktop) &&
                <Div className={styles.bottom}>
                    {isChangeSize &&
                        <Button
                            before={size === 'm' ? <Icon16GridOfFour /> : <Icon16ArticleOutline />}
                            mode='tertiary'
                            onClick={() => changeListFormat(size === 'm' ? 'l' : 'm')}
                            className={`${styles.button} ${styles.button_format}`}
                        />
                    }
                    {Boolean(showFilterButton || isDesktop) &&
                        <div className={styles.right}>
                            {showFilterButton &&
                                <Button
                                    before={<Icon28SlidersOutline />}
                                    mode='tertiary'
                                    onClick={() => setActiveModal('filters')}
                                    className={`${styles.button} ${styles.button_filter}`}
                                />
                            }
                            {isDesktop &&
                                <Button
                                    before={<Icon28RefreshOutline />}
                                    mode='tertiary'
                                    onClick={updateList}
                                    className={`${styles.button} ${styles.button_filter}`}
                                />
                            }
                        </div>
                    }
                </Div>
            }
        </>
    )
}

FiltersList.propTypes = {
    filters: PropTypes.array,
    size: PropTypes.string,
    changeListFormat: PropTypes.func,
    isChangeSize: PropTypes.bool.isRequired
}

export default FiltersList;