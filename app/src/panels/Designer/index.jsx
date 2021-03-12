import { Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DesignerCard from '../../utils/Raiting/DesignerCard';
import { alertContext, viewContext } from '../../App';

const Designer = ({id, activeDesigner}) => {

    const { setActivePanel } = viewContext();
    const { useAlert } = alertContext();

    const [ designerInfo, setDesignerInfo ] = useState(null);

    useEffect(() => {
        
        const fetchData = async () => {
            try{
                const designerInfo = await activeDesigner.getDesignerInfo();
                setDesignerInfo(designerInfo);
            }
            catch(error){
                useAlert.show('Ошибка', error.message, [{
                    title: 'Назад',
                    autoclose: true,
                    action: () => setActivePanel('raiting')
                }])
            }
        }

        fetchData();

    }, [])

    return (
        <Panel id={id}>
            <PanelHeader left={
                <PanelHeaderBack onClick={() => setActivePanel('raiting')}/>}
            >
                Дизайнер
            </PanelHeader>
        </Panel>
    )
}

Designer.propTypes = {
    id: PropTypes.string.isRequired,
    activeDesigner: PropTypes.instanceOf(DesignerCard).isRequired
}

export default Designer;