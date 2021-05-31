import { useRouter } from '@unexp/router';
import { Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import React from 'react';
import { connect } from 'react-redux';
import ListBlock from '../../components/ListBlock';
import DesignCard from '../../components/DesignCard';

const Favorites = ({ id, userInfo }) => {

    const { back } = useRouter();

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={back} />}
            >
                Избранные
            </PanelHeader>
            <ListBlock
                loadCount={10}
                loadList={userInfo.getFavorites.bind(userInfo)}
                actionType='favoritesList'
                isChangeSize={true}
            >
                {el => (
                    <DesignCard designCard={el} key={el.getId()} />
                )}
            </ListBlock>
        </Panel>
    )
}

const mapStateToProps = (state) => ({
    userInfo: state.user.activeUser
})

export default connect(mapStateToProps)(Favorites);