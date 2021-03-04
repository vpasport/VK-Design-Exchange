import React from 'react';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';

const useSpinner = (setPoput) => {

    const useSpinnerParams = {

        hideSpinner(){
            setPoput(null)
        },

        showSpinner(){
            setPoput(<ScreenSpinner />)
        }

    }

    return useSpinnerParams;

}

export default useSpinner;