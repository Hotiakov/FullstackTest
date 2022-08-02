import React from 'react';
import './style.scss';

import { Navigate, useNavigate, useParams } from 'react-router-dom';
import backendService from 'utils/backendService';
import Input from 'components/Input';
import Button from 'components/Button';
import Select from 'components/Select';
import { useSelector, useDispatch } from 'react-redux';
import {userInfoSlice} from 'store/reducers/userInfoSlice';
import { alertsSlice } from 'store/reducers/alertsSlice';
import { RootState } from 'store/store';

const NumbersEditPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {clientId} = useSelector((state: RootState) => state.userInfoReducer);
    const {cleanClientId, setClientId} = userInfoSlice.actions;
    const {openAlert} = alertsSlice.actions;
    const dispatch = useDispatch();

    const [editable, setEditable] = React.useState({
        caller_id_name: '',
        dial_rule_id : '',
        dial_rule_limit: '',
        did_as_transfer_caller_id : '',
        extension_group_id: '',
        extra_params: '',
        label: '',
        message_did: '',
        status: '',
    });
    const [errors, setErrors] = React.useState({
        label: false,
        dial_rule_id: false,
        dial_rule_limit: false,
        extension_group_id: false,
    });
    const [isFormValid, setFormValid] = React.useState(true);

    const [readonly, setReadOnly] = React.useState({});


    const handleChange = (value: string, field: string) => {
        setEditable(values => ({...values, [field]: value}))
    }

    const handleError = (value: boolean, field: string) => {
        setErrors(values => ({...values, [field]: value}));
    }

    const setData = (item: any) => {
        const editableTmp = {};
        const readableTmp = {};
        for (let key in item){
            key in editable ? 
                (editableTmp as any)[key] = item[key] : 
                (readableTmp as any)[key] = item[key]
        }
        setEditable(editableTmp as any);
        setReadOnly(readableTmp);
    }

    React.useEffect(() => {
        if(!clientId){
            backendService.getClientId()
                .then((clientId) => {
                    if(!clientId){
                        navigate('/');
                    }
                    dispatch(setClientId(clientId));
                })
        }
    }, []);

    React.useEffect(() => {
        if(!clientId) return;
        backendService.getExtensionInfo(clientId, id).then(item => {
            if(item.message === 'Unauthorized')
                navigate('/');
            else{
                setData(item);
            }
        })
    }, [clientId]);

    React.useEffect(() => {
        setFormValid(!Object.keys(errors).some(e => (errors as any)[e]));
    }, [errors])

    if(!localStorage.getItem('authToken')){
        return <Navigate to="/" replace/>
    }
    return(
        <div className='numbers-edit'>
            <div className="numbers-edit__container">
                <h3 className='numbers-edit__title'>
                    <span>{editable.label}</span>
                    <span>id: {id}</span>
                </h3>
                <div className="numbers-edit__content">
                    <div className="numbers-edit__editable numbers-edit__column">
                        <h4 className="numbers-edit__subtitle">
                            Editable fields
                        </h4>
                        <div className="numbers-edit__wrapper">
                            <label className='numbers-edit__label'>
                                <span>Caller id name</span>
                                <Input placeholder='Caller id name' value={editable.caller_id_name || ''}
                                    setValue={e => handleChange(e, 'caller_id_name')}/>
                            </label>
                            <label className='numbers-edit__label'>
                                <span>Dial rule id</span>
                                <Input type='number' placeholder='Dial rule id ' value={editable.dial_rule_id || '' }
                                    setValue={e => handleChange(e, 'dial_rule_id ')}
                                    validator={{
                                        errorMessage: 'must be positive number',
                                        setError: value => handleError(value, 'dial_rule_id'),
                                        isError: errors['dial_rule_id'],
                                        function: value => !!value.match(/^\d*$/g)
                                    }}/>
                            </label>
                            <label className='numbers-edit__label'>
                                <span>Dial rule limit</span>
                                <Input type='number' placeholder='Dial rule limit' value={editable.dial_rule_limit || ''}
                                    setValue={e => handleChange(e, 'dial_rule_limit')}
                                    validator={{
                                        errorMessage: 'must be positive number',
                                        setError: value => handleError(value, 'dial_rule_limit'),
                                        isError: errors['dial_rule_limit'],
                                        function: value => !!value.match(/^\d*$/g)
                                    }}/>
                            </label>
                            <label className='numbers-edit__label'>
                                <span>Did as transfer caller id</span>
                                <Input placeholder='Did as transfer caller id' value={editable.did_as_transfer_caller_id || ''}
                                    setValue={e => handleChange(e, 'did_as_transfer_caller_id')}/>
                            </label>
                            <label className='numbers-edit__label'>
                                <span>Extension group id</span>
                                <Input type="number" placeholder='Extension group id' value={editable.extension_group_id || ''}
                                    setValue={e => handleChange(e, 'extension_group_id')}
                                    validator={{
                                        errorMessage: 'must be positive number',
                                        setError: value => handleError(value, 'extension_group_id'),
                                        isError: errors['extension_group_id'],
                                        function: value => !!value.match(/^\d*$/g)
                                    }}/>
                            </label>
                            <label className='numbers-edit__label'>
                                <span>Extra params</span>
                                <Input placeholder='Extra params' value={editable.extra_params || ''}
                                    setValue={e => handleChange(e, 'extra_params')}/>
                            </label>
                            <label className='numbers-edit__label'>
                                <span>Label</span>
                                <Input placeholder='label' value={editable.label || ''}
                                    setValue={e => handleChange(e, 'label')}
                                    validator={{
                                        errorMessage: 'cannot be empty',
                                        setError: value => handleError(value, 'label'),
                                        isError: errors['label'],
                                        function: value => value !== ''
                                    }}/>
                            </label>
                            <label className='numbers-edit__label'>
                                <span>Message did</span>
                                <Input placeholder='Message did' value={editable.message_did || ''}
                                    setValue={e => handleChange(e, 'message_did')}/>
                            </label>
                            <label className='numbers-edit__label'>
                                <span>Status</span>
                                <Select value={editable.status || 'blocked'} list={['blocked', 'active']}
                                    setValue={e => handleChange(e, 'status')}/>
                            </label>
                        </div>
                        <Button disabled={!isFormValid} customClass='numbers-edit__btn' text='Save' onClick={() => {
                            backendService.updateExtension(clientId, id as string, editable)
                                .then(() => dispatch(openAlert("Data was successfully saved")))
                                .catch(e => dispatch(openAlert(e)))
                        }}/>
                    </div>
                    <div className="numbers-edit__readonly numbers-edit__column">
                        <h4 className="numbers-edit__subtitle">
                            Readonly fields
                        </h4>
                        <div className="numbers-edit__wrapper">
                        {
                            Object.keys(readonly).map((item, index) => (
                                <label key={index} className='numbers-edit__label'>
                                    <span>{item}</span>
                                    <p>
                                        {(readonly as any)[item] || 'empty'}
                                    </p>
                                </label>
                            ))
                        }
                        </div>
                    </div>
                </div>
                <div className="numbers-edit__buttons">
                    <Button text='LogOut' onClick={() => {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('refreshToken');
                        dispatch(cleanClientId);
                        navigate('/');
                    }}/>
                    <Button text='To list' onClick={() => {
                        navigate('/numbers');
                    }}/>
                </div>
            </div>
        </div>
    );
}
export default NumbersEditPage;