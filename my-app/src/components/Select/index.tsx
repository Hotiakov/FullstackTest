import React from 'react';
import './style.scss';

interface SelectProps{
    list: string[],
    customClass?: string,
    setValue: (value: string) => void,
    value: string
}

const Select = ({list, customClass = '', setValue, value}: SelectProps) => {
    return(
        <select className={`select input__inner ${customClass}`} onChange={e => setValue(e.target.value)} value={value}>
            {
                list.map((item,index) => (
                    <option key={index} value={item}>{item}</option>
                ))
            }
        </select>
    );
}
export default Select;