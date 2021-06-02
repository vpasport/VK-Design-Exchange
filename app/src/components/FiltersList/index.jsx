import React from 'react';
import PropTypes from 'prop-types';
import { Button, Div, FixedLayout, SliderSwitch } from '@vkontakte/vkui';
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

    const test = () => {
        let first;
        let firstOffY;
        let allVisible = Array.from(document.querySelectorAll('.vkuiCardGrid > *')).filter(el => {
            var top = el.offsetTop;
            var left = el.offsetLeft;
            var width = el.offsetWidth;
            var height = el.offsetHeight;

            while (el.offsetParent) {
                el = el.offsetParent;
                top += el.offsetTop;
                left += el.offsetLeft;
            }

            return (
                top >= window.pageYOffset &&
                left >= window.pageXOffset &&
                (top + height) <= (window.pageYOffset + window.innerHeight) &&
                (left + width) <= (window.pageXOffset + window.innerWidth)
            );
        });
        for (const elem of allVisible) {
            //Calculaate the offset to the document 
            //See: https://stackoverflow.com/a/18673641/7448536
            const offY = elem.getBoundingClientRect().top + document.documentElement.scrollTop
            if (first == null || offY < firstOffY) {
                first = elem;
                firstOffY = offY;
            }
        }

        changeListFormat(size === 'm' ? 'l' : 'm', first)
    }

    return (
        <>
            {Boolean(isChangeSize || showFilterButton || isDesktop) &&
                React.createElement(isDesktop ? 'div' : FixedLayout,
                    isDesktop ? null : { vertical: 'top'},
                    <Div className={styles.bottom}>
                        {isChangeSize &&
                            <Button
                                before={size === 'm' ? <Icon16GridOfFour /> : <Icon16ArticleOutline />}
                                mode='tertiary'
                                onClick={() => {
                                    test()
                                }}
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
                )
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