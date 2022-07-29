import React from 'react';
import './style.scss';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import backendService from 'utils/backendService';
import Button from 'components/Button';
import { userInfoSlice } from 'store/reducers/userInfoSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/store';
const NumbersPage = () => {
    const navigate = useNavigate();
    const [extenstionList, setExtensionList] = React.useState([]);
    const {clientId} = useSelector((state: RootState) => state.userInfoReducer);
    const {cleanClientId, setClientId} = userInfoSlice.actions;
    const dispatch = useDispatch();
    React.useEffect(() => {
        if(!clientId){
            backendService.getClientId()
            .then((clientId) => {
                if(!clientId){
                    navigate('/');
                }
                dispatch(setClientId(clientId));
            });
        }
    }, []);

    React.useEffect(() => {
        if(!clientId) return;
        backendService.getExtension(clientId).then((list) => {
            if(list.message === 'Unauthorized')
                navigate('/');
            else
                setExtensionList(list);

        })
    }, [clientId]);

    if(!localStorage.getItem('authToken')){
        return <Navigate to="/" replace/>
    }

    return(
        <div className='numbers'>
            <div className="numbers__wrapper">
                <h2 className="numbers__title">
                    You are on a Numbers page
                </h2>
                <div className="numbers__list">
                {
                    extenstionList.map((item: any) => (
                        <Link key={item.id} className='numbers__item' to={`./${item.id}`}>
                            <p className="numbers__text">{item.label}</p>
                            <p className="numbers__text">{item.id}</p>
                        </Link>
                    ))
                }
                </div>
                <Button text='LogOut' onClick={() => {
                    localStorage.removeItem('authToken');
                    dispatch(cleanClientId());
                    navigate('/');
                }}/>
            </div>
        </div>
    );
}
export default NumbersPage;