import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, Group, PanelHeaderBack } from '@vkontakte/vkui';
import { connect } from 'react-redux';
import ListBlock from '../../components/ListBlock';
import { changePrevUserId, changeList } from '../../store/Designer/Portfolio/actions';
import GalleryItem from '../../components/Gallery/GalleryItem';
import useRouter from '../../utils/useRouter';
import useUserListParams from '../../utils/useUserListParams';

const Portfolio = ({ id, listFormat }) => {

    const router = useRouter();
    const userListParams = useUserListParams('portfolio');

    const activeDesigner = userListParams.bind.activeDesigner;

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={() => router.back()} />}
            >
                Портфолио
            </PanelHeader>
            <Group>
                {userListParams.bind.isShowList &&
                    <ListBlock
                        actionType='portfolio'
                        loadList={activeDesigner.getPortfolio.bind(activeDesigner)}
                        loadingCondition={userListParams.checkId}
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
    listFormat: state.portfolio.listFormat
})

export default connect(mapStateToProps)(Portfolio);