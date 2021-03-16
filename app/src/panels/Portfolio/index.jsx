import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, Group, PanelHeaderBack } from '@vkontakte/vkui';
import { connect } from 'react-redux';
import ListBlock from '../../components/ListBlock';
import { changePrevUserId, changeList } from '../../store/Designer/Portfolio/actions';
import GalleryItem from '../../components/Gallery/GalleryItem';
import useRouter from '../../utils/useRouter';

const Portfolio = ({ id, activeDesignerId, activeDesigner, prevUserId, changePrevUserId, listFormat, changeList }) => {

    const router = useRouter();
    const [isShowList, setShowList] = useState(activeDesigner.getId() === prevUserId)

    useEffect(() => {
        if (!isShowList){
            changeList(null)
            setShowList(true)
        }
    }, [])

    const checkId = () => {
        const condition = activeDesigner.getId() !== prevUserId;

        if (condition) changePrevUserId(activeDesigner.getId());

        return condition;
    }

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={() => router.back()} />}
            >
                Портфолио
            </PanelHeader>
            <Group>
                {isShowList &&
                    <ListBlock
                        actionType='portfolio'
                        loadList={activeDesigner.getPortfolio.bind(activeDesigner)}
                        loadingCondition={checkId}
                        isChangeSize={true}
                        nullText='Работы в портфолио отсутствуют'
                    >
                        {el => (
                            <GalleryItem
                                designCard={el}
                                key={el.getId()}
                                listFormat={listFormat}
                            />
                        )}
                    </ListBlock>
                }

            </Group>
        </Panel>
    )
}

Portfolio.propTypes = {
    id: PropTypes.string.isRequired,
    listFormat: PropTypes.string
}

const mapStateToProps = state => ({
    activeDesignerId: state.designer.activeDesignerId,
    activeDesigner: state.designer.activeDesigner,
    prevUserId: state.portfolio.prevUserId,
    listFormat: state.portfolio.listFormat
})

const mapDispatchToProps = {
    changePrevUserId,
    changeList
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);