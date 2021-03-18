import { ModalPage, ModalRoot } from '@vkontakte/vkui';
import React, { useMemo } from 'react';
import { modalContext } from '../../App';
import FiltersModal from '../../components/FiltersList/FiltersModal';

const Modal = () => {

    const { activeModal, setActiveModal } = modalContext();
    const stateType = useMemo(() => 'galleryList', []);

    return (
        <ModalRoot
            activeModal={activeModal}
            onClose={() => setActiveModal(null)}
        >
            <FiltersModal 
                id='filters'
                stateType={stateType}
            />
        </ModalRoot>
    )
}

export default Modal;