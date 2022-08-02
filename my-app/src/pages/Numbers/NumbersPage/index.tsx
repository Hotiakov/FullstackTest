import React from 'react';
import './style.scss';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import backendService from 'utils/backendService';
import Button from 'components/Button';
import { userInfoSlice } from 'store/reducers/userInfoSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/store';

const perPage = 1;

const NumbersPage = () => {
    const navigate = useNavigate();
    const [extenstionList, setExtensionList] = React.useState([]);
    const {clientId} = useSelector((state: RootState) => state.userInfoReducer);
    const {cleanClientId, setClientId} = userInfoSlice.actions;
    const dispatch = useDispatch();

    const [page, setPage] = React.useState(1);
    const [isLastPage, setLastPage] = React.useState(false);

    React.useEffect(() => {
        if(!clientId){
            backendService.getClientId()
            .then((clientId) => {
                if(!clientId){
                    navigate('/');
                }
                dispatch(setClientId(clientId));
            })
            .catch(error => {
                navigate('/');
            })
        }
    }, []);

    React.useEffect(() => {
        if(!clientId) return;
        backendService.getExtensions(clientId, page, perPage).then((list) => { 
            if(list.message === 'Unauthorized')
                navigate('/');
            else{
                backendService.getExtensions(clientId, page * perPage + 1, 1).then(list => {
                    setLastPage(!list.length);
                }); //пытаюсь получить хотя бы один элемент со следующей страницы. Если он есть, то страница не последняя
                setExtensionList(list);
            }
        });
    }, [clientId, page]);

    if(!localStorage.getItem('authToken')){
        return <Navigate to="/" replace/>
    }


    return(
        <div className='numbers'>
            <div className="numbers__wrapper">
                <h2 className="numbers__title">
                    Numbers page
                </h2>
                <ul className="numbers__list">
                {
                    extenstionList.map((item: any) => (
                        <li key={item.id} >
                            <Link className='numbers__item' to={`./${item.id}`}>
                                <p className="numbers__text">{item.label}</p>
                                <p className="numbers__text">{item.id}</p>
                            </Link>
                        </li>
                    ))
                }
                </ul>
                <div className="numbers__pagination">
                    <button onClick={ () =>
                        setPage(page-1)
                    } className="numbers__arrow" disabled={page === 1}>
                        &#8656;
                    </button>
                    <div className="numbers__cur">
                        {page}
                    </div>
                    <button onClick={() =>
                        setPage(page+1)
                    } className="numbers__arrow" disabled={isLastPage}>
                        &#8658;
                    </button>
                </div>
                <Button text='LogOut' onClick={() => {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('refreshToken');
                    dispatch(cleanClientId());
                    navigate('/');
                }}/>
            </div>
        </div>
    );
}
export default NumbersPage;