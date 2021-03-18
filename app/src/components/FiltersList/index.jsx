import React from 'react';
import PropTypes from 'prop-types';
import { Button, Div, SliderSwitch } from '@vkontakte/vkui';
import { Icon16GridOfFour, Icon24MoreHorizontal } from '@vkontakte/icons';
import { Icon16ArticleOutline } from '@vkontakte/icons';
import { Icon24Filter } from '@vkontakte/icons';

import styles from './style.module.scss';
import { modalContext } from '../../App';

const FiltersList = ({ filters, size, changeListFormat, isChangeSize }) => {

    const { setActiveModal } = modalContext();
    const showFilterButton = Boolean(filters && Object.keys(filters).length)

    return (
        <>
            {Boolean(isChangeSize || showFilterButton) &&
                <Div className={styles.bottom}>
                    {isChangeSize &&
                        <Button
                            before={size === 'm' ? <Icon16GridOfFour /> : <Icon16ArticleOutline />}
                            mode='tertiary'
                            onClick={() => changeListFormat( size === 'm' ? 'l' : 'm' )}
                            className={styles.button}
                        />
                    }
                    {showFilterButton &&
                        <Button
                            before={<Icon24Filter />}
                            mode='tertiary'
                            onClick={() => setActiveModal('filters')}
                            className={styles.button}
                        />
                    }
                </Div>
            }
        </>
    )
}

FiltersList.propTypes = {
    filters: PropTypes.object,
    size: PropTypes.string,
    changeListFormat: PropTypes.func,
    isChangeSize: PropTypes.bool.isRequired
}

export default FiltersList;