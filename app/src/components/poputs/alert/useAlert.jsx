import React from 'react';
import Alert from '@vkontakte/vkui/dist/components/Alert/Alert';
import bridge from '@vkontakte/vk-bridge';

const useAlert = (setPoput) => {

    const defaultActions = [{
        title: 'Ок',
        autoclose: true,
        mode: 'cancel'
    }];

    const useAlertParams = {
        isAlertShow: false,

        hide(){
            setPoput(null);
            this.isAlertShow = false;
        },

        show(header = 'header', text = 'text', actions = defaultActions, onClose = () => {} ){
            const parentContext = this;
            setPoput(
                <Alert
                    header={header}
                    text={text}
                    onClose={() => {
                        this.hide.call(parentContext)
                        onClose()
                    }}
                    actions={actions}
                    
                />
            )
            this.isAlertShow = true;
        },

        error(header = 'Error header', text = 'Error text'){
            this.show(header, text, [{
                title: 'Выйти',
                autoclose: false,
                action: async () => {
                    await bridge.send("VKWebAppClose", {
                        status: 'failed'
                    });
                },
            }])
        }
        
    }

    return useAlertParams;
}

export default useAlert;