import React from 'react';
import PropTypes from 'prop-types'

import styles from './style.module.scss';

const Price = ({price}) => {
    return (
        <span className={styles.price}>{price.toLocaleString('ru-RU')}₽</span>
    )
}

Price.propTypes = {
    price: PropTypes.number.isRequired
}

export default Price;