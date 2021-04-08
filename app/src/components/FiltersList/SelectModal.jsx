import { FormItem, Radio } from '@vkontakte/vkui';
import React, {useState} from 'react';
import { connect, useSelector } from 'react-redux';
import ModalPage from '../ModalPage';

const SelectModal = ({ id, params: {selectList, onClose, header, top, onChange, value: _value }}) => {

    const [ value, setValue ] = useState(_value);

    const changeItem = (event) => {
        setValue(event.target.value || null);
        onChange(event.target.value)
    }

    return (
        <ModalPage id={id} header={header} onClose={onClose}>
            <FormItem top={top || header}>
                {selectList.map(el => (
                    <Radio 
                        name='modalSelect' 
                        value={el.value}
                        onChange={changeItem}
                        checked={value == el.value}
                    >
                        {el.label}
                    </Radio>
                ))}
            </FormItem>
        </ModalPage>
    )
}

const mapStateToProps = state => ({
    params: state.selectModal.params
})

export default connect(mapStateToProps)(SelectModal);