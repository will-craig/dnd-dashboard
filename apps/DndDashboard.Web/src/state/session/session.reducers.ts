import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {Session} from "../../models/Session.ts";

const sessionSlice = createSlice({
    name: 'session',
    initialState: { session: null as Session | null },
    reducers: {
        setSession(state, action: PayloadAction<Session>) {
            state.session = action.payload;
        },
        clearSession(state) {
            state.session = null;
        }
    },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
