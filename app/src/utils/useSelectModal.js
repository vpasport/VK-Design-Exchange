import { useDispatch } from "react-redux"
import { modalContext } from "../App";
import { changeModalParams } from "../store/selectModal/actions";

const useSelectModal = () => {
    const dispatch = useDispatch();
    const { setActiveModal } = modalContext();

    const show = (params) => {
        dispatch(changeModalParams(params));
        setActiveModal('selectModal');
    }

    return {
        show
    }
}

export default useSelectModal;