import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "../models/auth";

// Single Responsibility: Solo maneja estado del usuario autenticado
interface UserState {
    user: AuthUser | null;
}

const storedUser = localStorage.getItem("user");
const initialState: UserState = {
    user: storedUser ? JSON.parse(storedUser) : null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Open/Closed: Extensible para diferentes tipos de acciones
        setUser: (state, action: PayloadAction<AuthUser | null>) => {
            state.user = action.payload;
            if (action.payload) {
                localStorage.setItem("user", JSON.stringify(action.payload));
            } else {
                localStorage.removeItem("user");
            }
        },
        // Acción específica para actualizar token (Interface Segregation)
        updateToken: (state, action: PayloadAction<string>) => {
            if (state.user) {
                state.user.token = action.payload;
                localStorage.setItem("user", JSON.stringify(state.user));
            }
        },
        // Acción para limpiar usuario sin dispatch desde auth
        clearUser: (state) => {
            state.user = null;
            localStorage.removeItem("user");
        },
    },
});

export const { setUser, updateToken, clearUser } = userSlice.actions;
export default userSlice.reducer;
