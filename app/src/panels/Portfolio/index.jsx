import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, Group, PanelHeaderBack } from '@vkontakte/vkui';
import { connect } from 'react-redux';
import GalleryItem from '../../components/Gallery/GalleryItem';
import useRouter from '../../utils/useRouter';
import UserListBlock from '../../components/UserListBlock';

const Portfolio = ({ id, listFormat }) => {

    const router = useRouter();

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={() => router.back()} />}
            >
                Портфолио
            </PanelHeader>
            <Group>
                <UserListBlock
                    actionType='portfolio'
                    loadList={(activeDesigner) => activeDesigner.getPortfolio.call(activeDesigner)}
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
                </UserListBlock>
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