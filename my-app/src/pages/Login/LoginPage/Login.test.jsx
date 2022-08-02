import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {BrowserRouter as Router} from 'react-router-dom';
import LoginPage from '.';
import * as router from 'react-router';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { waitFor } from '@testing-library/react';

const flushPromises = () => new Promise(setImmediate);

describe("chech login's logic", () => {
    const initialState = {};
    const mockStore = configureStore();
    let store;

    it('render successfully', () => {
        store = mockStore(initialState);
        render(<Provider store={store}>
                <Router>
                    <LoginPage/>
                </Router>
            </Provider>);

        expect(screen.getByPlaceholderText('Client login')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Client password')).toBeInTheDocument();
    });

    it('invalid login or pass', async () => {
        const navigate = jest.fn();
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
        store = mockStore(initialState);
        render(<Provider store={store}>
                <Router>
                    <LoginPage/>
                </Router>
            </Provider>);

        const btn = screen.getByRole('button');
        await userEvent.click(btn);
        await waitFor(() =>expect(navigate).toHaveBeenCalledTimes(0));
    });

    it('correct login and pass', async () => {
        const navigate = jest.fn();
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
        store = mockStore(initialState);
        render(<Provider store={store}>
                <Router>
                    <LoginPage/>
                </Router>
            </Provider>);
        await userEvent.type(screen.getByPlaceholderText('Client login'), 'Eugene_Khotiakov');
        await userEvent.type(screen.getByPlaceholderText('Client password'), 'qweasdzxc');
        const btn = screen.getByRole('button');
        await userEvent.click(btn);

        await waitFor(() => expect(navigate).toHaveBeenCalledWith('/numbers'));
    })

});