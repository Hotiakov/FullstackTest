import React from 'react';
import './style.scss';

interface ButtonProps{
    customClass?: string,
    text: string,
    onClick: (event?: any) => void,
    disabled?: boolean
}

const Button = ({text, customClass = '', onClick, disabled = false}: ButtonProps) => {
    return(
        <div className={`btn ${customClass}`}>
            <button onClick={e => onClick(e)} disabled={disabled}>
                {text}
            </button>
        </div>
    );
}
export default Button;