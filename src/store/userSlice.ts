import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "../models/auth";
import { UserStorageManager } from "../utils/userStorageManager";

// Single Responsibility: Solo maneja estado del usuario autenticado
interface UserState {
    user: AuthUser | null;
}

const storedUser = UserStorageManager.getUser();

const initialState: UserState = {
    user: storedUser
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Open/Closed: Extensible para diferentes tipos de acciones
        setUser: (state, action: PayloadAction<AuthUser | null>) => {
            state.user = action.payload;
            if (action.payload) {
                // 🔥 USAR UserStorageManager EN LUGAR DE ESCRIBIR DIRECTAMENTE
                const sessionToken = UserStorageManager.getSession();
                UserStorageManager.saveUser(action.payload, sessionToken || undefined);
            } else {
                UserStorageManager.clearUser();
            }
        },
        // Acción específica para actualizar token (Interface Segregation)
        updateToken: (state, action: PayloadAction<string>) => {
            if (state.user) {
                state.user.token = action.payload;
                // 🔥 USAR UserStorageManager PARA ACTUALIZAR
                UserStorageManager.saveUser(state.user, action.payload);
            }
        },
        // Acción para limpiar usuario sin dispatch desde auth
        clearUser: (state) => {
            state.user = null;
            UserStorageManager.clearUser();
        },
    },
});

export const { setUser, updateToken, clearUser } = userSlice.actions;
export default userSlice.reducer;
