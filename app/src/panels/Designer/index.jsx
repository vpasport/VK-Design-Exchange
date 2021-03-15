import { Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { alertContext, viewContext } from '../../App';
import { connect } from 'react-redux';

import { changeActiveDesignerId } from '../../store/Designer/actions';
import { getDesignerInfoById } from '../../utils/helpers';

const Designer = ({id, activeDesignerId}) => {

    const { setActivePanel } = viewContext();
    const { useAlert } = alertContext();

    const [ designerInfo, setDesignerInfo ] = useState(null);

    useEffect(() => {
        
        const fetchData = async () => {
            try{
                const designerInfo = await getDesignerInfoById(activeDesignerId)
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
    activeDesignerId: PropTypes.number.isRequired
}

const mapStateToProps = (state) => {
    return {
        activeDesignerId: state.designer.activeDesignerId
    }
}

const mapDispatchToProps = {
    changeActiveDesignerId
}

export default connect(mapStateToProps, mapDispatchToProps)(Designer);