import React from 'react';
import './style.scss';

interface InputProps{
    customClass?: string,
    placeholder?: string,
    value: string,
    setValue: (value: string) => void,
    type?: string
}

const Input = ({customClass = '', placeholder = '', value, setValue, type = 'text'}: InputProps) => {
    return(
        <div className={`input ${customClass}`}>
            <input type={type} placeholder={placeholder} value={value} onChange={e => setValue(e.target.value)} />
        </div>
    );
}
export default Input;