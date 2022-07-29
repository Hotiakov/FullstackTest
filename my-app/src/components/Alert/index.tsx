import React, { useDebugValue } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { alertsSlice } from 'store/reducers/alertsSlice';
import { RootState } from 'store/store';
import './style.scss';

const Alert = () => {
    const {text, isOpen} = useSelector((state: RootState) => state.alertsReducer);
    const {closeAlert} = alertsSlice.actions;
    const dispatch = useDispatch();

    return(
        <div className={`alert ${isOpen ? 'alert_oppened' : ''}`}
            onClick={(e) => {
                if((e.target as Element).classList.contains('alert'))
                    dispatch(closeAlert());
            }}>
            <div className="alert__wrapper">
                <h3 className="alert__title">Alert</h3>
                <p className="alert__description">
                    {text}
                </p>
                <button className="alert__close" onClick={() => dispatch(closeAlert())}>
                    &#10006;
                </button>
            </div>
        </div>
    );
}
export default Alert;