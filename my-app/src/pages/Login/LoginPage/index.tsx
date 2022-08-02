import React from 'react';
import './style.scss';

import { useNavigate } from 'react-router-dom';

import Input from 'components/Input';
import Button from 'components/Button';

import backendService from 'utils/backendService';
import { useDispatch } from 'react-redux';
import {alertsSlice} from 'store/reducers/alertsSlice';

const LoginPage = () => {
    const navigate = useNavigate();
    const {openAlert} = alertsSlice.actions;
    const dispatch = useDispatch();


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
                    if(!token.access_token){
                        dispatch(openAlert('incorrect login or password'));
                        return;    
                    }
                    localStorage.setItem('authToken', token.access_token);
                    localStorage.setItem('refreshToken', token.refresh_token);
                    navigate('/numbers');
                }} />
            </div>
        </div>
    );
}
export default LoginPage;