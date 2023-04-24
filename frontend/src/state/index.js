import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    mode: "light",
    user: null,
    isLoggedIn: null,
    isMenuOpen: false
}

export const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.isLoggedIn = "True"
        },
        setLogout: (state) => {
            state.user = null;
            state.isLoggedIn = null;
        },
        setIsMenuOpen: (state) => {
            state.isMenuOpen = state.isMenuOpen === true ? false : true;
        },
    },
});

export const { setMode, setLogin, setLogout, setIsMenuOpen } = mainSlice.actions;
export default mainSlice.reducer;