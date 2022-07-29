import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface alertsProps{
    isOpen: boolean,
    text: string
}

const initialState: alertsProps = {
    isOpen: false,
    text: '',
}

export const alertsSlice = createSlice({
    name: 'alerts',
    initialState,
    reducers: {
        openAlert(state, action: PayloadAction<string>){
            state.isOpen = true;
            state.text = action.payload;
        },
        closeAlert(state, action: PayloadAction<void>){
            return initialState;
        }
    }
});

export default alertsSlice.reducer;