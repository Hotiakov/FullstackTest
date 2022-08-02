import React from 'react';
import './scss/style.scss';
import './scss/variables.scss';

import {
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from 'pages/Login/LoginPage';
import NumbersPage from 'pages/Numbers/NumbersPage';
import NumbersEditPage from 'pages/NumbersEdit/NumbersEditPage';
import Alert from 'components/Alert';

import { alertsSlice } from 'store/reducers/alertsSlice';
import { useDispatch } from 'react-redux';

function App() {
    const dispatch = useDispatch();
    const {openAlert} = alertsSlice.actions;
    React.useEffect(() => {
        const ws = new WebSocket("ws://127.0.0.1:5678/");
        ws.onopen = (e) => {
            console.log("Соединение установлено");
        }
        ws.onmessage = (event) => {
            dispatch(openAlert(`Данные получены с сервера: ${event.data}`));
        };
    }, [])
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="numbers" element={<NumbersPage />} />
                <Route path='numbers/:id' element={<NumbersEditPage/>} />
            </Routes>
            <Alert/>
        </div>
    );
}

export default App;
