import { Panel, PanelHeader, PanelHeaderBack, Group } from '@vkontakte/vkui';
import React from 'react';
import useRouter from '../../utils/useRouter';
import PropTypes from 'prop-types';
import UserListBlock from '../../components/UserListBlock';
import OfferCard from '../../components/OfferCard';
import { connect } from 'react-redux';

const Offers = ({id, listFormat}) => {

    const router = useRouter();

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={router.back}/>}
            >
                Услуги
            </PanelHeader>
            <Group>
                <UserListBlock
                    actionType='offers'
                    loadList='getOffers'
                    nullText='Услуги отсутствуют'
                    loadCount={10}
                    isChangeSize={true}
                >
                    {el => (
                        <OfferCard
                            offerCard={el}
                            key={el.getId()}
                            listFormat={listFormat}
                        />
                    )}
                </UserListBlock>
            </Group>
        </Panel>
    )
}

Offers.propTypes = {
    id: PropTypes.string.isRequired,
    listFormat: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
    listFormat: state.offers.listFormat
})

export default connect(mapStateToProps)(Offers);