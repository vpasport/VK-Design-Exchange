import { ModalRoot } from '@vkontakte/vkui';
import React, { useMemo } from 'react';
import { modalContext } from '../App';

const Modal = ({children}) => {

    const { activeModal, setActiveModal } = modalContext();

    return (
        <ModalRoot
            activeModal={activeModal}
            onClose={() => setActiveModal(null)}
        >
            {children}
        </ModalRoot>
    )
}

export default Modal;