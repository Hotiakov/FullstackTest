import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom'

import Input from '.';

const onChange = jest.fn();

const numberValidator = {
    errorMessage: 'must be positive number',
    setError: function(value){
        this.isError = value;
    },
    isError: false,
    function: (value: string) => !!value.match(/^\d*$/g)
}

const emptyValidator = {
    errorMessage: 'cannot be empty',
    setError: function(value){
        this.isError = value;
    },
    isError: false,
    function: (value: string) => value !== ''
}

describe('Validation testing', () => {
    it('Should be correct for positive numbers', ()=>{
        render(<Input value={''} setValue={onChange} validator={numberValidator}/>);
        
        expect(screen.queryByText('must be positive number')).toBeNull();
    })

    it('Should be correct for not empty input', async ()=>{
        render(<Input value={'Hello World'} setValue={onChange} validator={emptyValidator}/>);

        expect(screen.queryByText('cannot be empty')).toBeNull();
    });

    it('Should give error, not a positive number', async () => {
        render(<Input value={'-100'} setValue={onChange} validator={{...numberValidator, isError: true}}/>);

        expect(screen.getByText('must be positive number')).toBeInTheDocument();
    })

    it('Should give error, empty string', async () => {
        render(<Input value={''} setValue={onChange} validator={{...emptyValidator, isError: true}}/>);

        expect(screen.getByText('cannot be empty')).toBeInTheDocument();
    })

});