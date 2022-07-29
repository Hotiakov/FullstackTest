import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface userInfoProps{
    clientId: string,
}

const initialState: userInfoProps = {
    clientId: ''
}

export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setClientId(state, action: PayloadAction<string>){
            state.clientId = action.payload;
        },
        cleanClientId(state){
            state = initialState;
        }
    }
});

export default userInfoSlice.reducer;