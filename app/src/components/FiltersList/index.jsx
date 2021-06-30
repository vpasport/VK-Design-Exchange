import React from 'react';
import PropTypes from 'prop-types';
import { Button, Div, FixedLayout, SliderSwitch } from '@vkontakte/vkui';
import { Icon28SlidersOutline } from '@vkontakte/icons';
import { Icon28RefreshOutline } from '@vkontakte/icons';
import { Icon24List } from '@vkontakte/icons';
import { Icon24Square4Outline } from '@vkontakte/icons';

import styles from './style.module.scss';
import { modalContext, sessionContext } from '../../App';

const FiltersList = ({ filters, size, changeListFormat, isChangeSize, updateList, posibleListFormats }) => {

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
            const offY = elem.getBoundingClientRect().top + document.documentElement.scrollTop
            if (first == null || offY < firstOffY) {
                first = elem;
                firstOffY = offY;
            }
        }

        changeListFormat(posibleListFormats.find(el => el !== size), first)
    }

    return (
        <>
            {Boolean(isChangeSize || showFilterButton || isDesktop) &&
                React.createElement(isDesktop ? 'div' : FixedLayout,
                    isDesktop ? null : { vertical: 'top', filled: true},
                    <Div className={styles.bottom}>
                        {isChangeSize &&
                            <Button
                                before={size === 'l' ? <Icon24List />  : <Icon24Square4Outline />}
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
    filters: PropTypes.any,
    size: PropTypes.string,
    changeListFormat: PropTypes.func,
    isChangeSize: PropTypes.bool.isRequired
}

export default FiltersList;