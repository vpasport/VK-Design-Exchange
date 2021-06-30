import { useState } from "react"

const useInput = (defaultValue) => {
    const [ value, setValue ] = useState(defaultValue);

    const onChange = (event) => {
        setValue(event.target.value);
    }

    const clear = () => {
        setValue('');
    }

    return {
        value, onChange, clear, setValue
    }
}

export default useInput;