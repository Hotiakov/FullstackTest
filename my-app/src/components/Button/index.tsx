import React from 'react';
import './style.scss';

interface ButtonProps{
    customClass?: string,
    text: string,
    onClick: (event?: any) => void
}

const Button = ({text, customClass = '', onClick}: ButtonProps) => {
    return(
        <div className={`btn ${customClass}`}>
            <button onClick={e => onClick(e)}>
                {text}
            </button>
        </div>
    );
}
export default Button;