import React from 'react';
import './style.scss';

interface IValidator{
    errorMessage?: string,
    setError: (value: boolean) => void,
    isError: boolean,
    function: (value: string) => boolean
}

interface InputProps{
    customClass?: string,
    placeholder?: string,
    value: string,
    setValue: (value: string) => void,
    validator?: IValidator,
    type?: string
}

const Input = ({customClass = '', placeholder = '', value, setValue, type = 'text', validator}: InputProps) => {
    return(
        <div className={`input ${customClass}`}>
            <input className={`input__inner ${validator?.isError ? 'input__inner_error' : ''}`} 
            type={type} placeholder={placeholder} value={value} 
            onChange={e => {
                const value = e.target.value;
                if(!validator?.function(value))
                    validator?.setError(true);
                else 
                    validator?.setError(false);
                setValue(value);
            }}/>
            {validator?.isError && <span className='input__message'>{
                validator?.errorMessage || 'invalid input'}
            </span>}
        </div>
    );
}
export default Input;