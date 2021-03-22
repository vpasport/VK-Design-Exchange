import React from 'react';
import PropTypes from 'prop-types';
import ListBlock from '../ListBlock';
import useUserListParams from '../../utils/useUserListParams';

const UserListBlock = ({ children, loadList, loadFilters, from = null, to = null,
    loadCount = null, actionType, isChangeSize = false, nullText = 'Список пустой' }) => {

    const userListParams = useUserListParams(actionType);

    const activeDesigner = userListParams.bind.activeDesigner;

    return (
        <>
            {userListParams.bind.isShowList &&
                <ListBlock
                    actionType={actionType}
                    loadList={loadList.bind(activeDesigner, activeDesigner)}
                    loadingCondition={userListParams.checkId}
                    isChangeSize={isChangeSize}
                    nullText={nullText}
                    loadFilters={loadFilters}
                    from={from}
                    to={to}
                    loadCount={loadCount}
                >
                    {(el) => children(el)}
                </ListBlock>
            }
        </>
    )
}

UserListBlock.propTypes = {
    loadList: PropTypes.func.isRequired,
    loadFilters: PropTypes.func,
    from: PropTypes.number,
    to: PropTypes.number,
    loadCount: PropTypes.number,
    actionType: PropTypes.oneOf(['galleryList', 'designerList', 'portfolio', 'reviews']).isRequired,
    size: PropTypes.oneOf(['s', 'm', 'l']),
    isChangeSize: PropTypes.bool,
    nullText: PropTypes.string
}

export default UserListBlock;