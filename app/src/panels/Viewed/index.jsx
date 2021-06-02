import { useRouter } from '@unexp/router';
import { Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import React from 'react';
import { connect } from 'react-redux';
import ListBlock from '../../components/ListBlock';
import DesignCard from '../../components/DesignCard';

const Viewed = ({id, userInfo}) => {

    const {back} = useRouter();

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={back} />}>
                Просмотренные
            </PanelHeader>
            <ListBlock
                loadCount={10}
                actionType='viewedsList'
                loadList={userInfo.getViewed.bind(userInfo)}
                loadingCondition={() => true}
                isChangeSize={true}
            >
                {el => (
                    <DesignCard designCard={el} />
                )}
            </ListBlock>
        </Panel>
    )
}

const mapStateToProps = state => ({
    userInfo: state.user.activeUser
})

export default connect(mapStateToProps)(Viewed);