import React from 'react';
import './style.scss';

import { useNavigate } from 'react-router-dom';

import Input from 'components/Input';
import Button from 'components/Button';

import backendService from 'utils/backendService';

const LoginPage = () => {
    const navigate = useNavigate();


    const [inputs, setInputs] = React.useState({
        login: '',
        password: '',
    });

    const handleChange = (value: string, field: string) => {
        setInputs(values => ({...values, [field]: value}))
    }

    return(
        <div className='login'>
            <div className='login__wrapper'>
                <h2 className='login__title'>
                    Authorization
                </h2>
                <div className='login__inputs'>
                    <Input value={inputs.login} setValue={e => handleChange(e, 'login')} placeholder={'Client login'}/>
                    <Input value={inputs.password} setValue={e => handleChange(e, 'password')} placeholder={'Client password'}/>
                </div>
                <Button text='LogIn' onClick={async () => {
                    let token = await backendService.authorize(inputs);
                    console.log(token);
                    if(!token.access_token){
                        alert('incorrect login or password');
                        return;    
                    }
                    localStorage.setItem('authToken', token.access_token);
                    navigate('/numbers');
                }} />
            </div>
        </div>
    );
}
export default LoginPage;