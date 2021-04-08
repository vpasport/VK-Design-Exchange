import { ModalPage, ModalPageHeader, PanelHeaderClose } from '@vkontakte/vkui';
import React from 'react';
import { modalContext, sessionContext } from '../App';
import PropTypes from 'prop-types';

const ModalPageHelper = ({children, id, headerName, onClose}) => {

    const { setActiveModal } = modalContext();
    const { isDesktop } = sessionContext();
    
    return (
        <ModalPage
            id={id}
            onClose={() => onClose ? onClose() : setActiveModal(null)}
            dynamicContentHeight
            header={
                <ModalPageHeader left={!isDesktop && <PanelHeaderClose onClick={() => onClose ? onClose() : setActiveModal(null)} />}>
                    {headerName}
                </ModalPageHeader>
            }
        >
            {children}
        </ModalPage>
    )
}

ModalPageHeader.propTypes = {
    id: PropTypes.string,
    headerName: PropTypes.string,
    onClose: PropTypes.func.isRequired
}

export default ModalPageHelper;