import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { setupStore } from 'store/store';
import { MemoryRouter } from 'react-router-dom';

import App from 'App';

const store = setupStore();

describe('test alert', () => {
    it('incorrect login or pass', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <App/>
                </MemoryRouter>
            </Provider>
        )

        const btn = screen.getByText('LogIn');
        await userEvent.click(btn);

        expect(await screen.findByText('incorrect login or password')).toBeInTheDocument();  
    });
});