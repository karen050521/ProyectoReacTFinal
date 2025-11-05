import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../models/user";

interface UserState {
    user: User | null;
}

const storedUser = localStorage.getItem("user");
let parsedUser = null;
if (storedUser) {
    try {
        const parsed = JSON.parse(storedUser);
        // Si el objeto tiene la estructura {user: {...}, token: "..."}
        parsedUser = parsed.user || parsed;
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
    }
}

const initialState: UserState = {
    user: parsedUser,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            if (action.payload) {
                // Mantener la estructura {user: {...}} para compatibilidad
                const storedData = {
                    user: action.payload,
                    token: localStorage.getItem("session") || ""
                };
                localStorage.setItem("user", JSON.stringify(storedData));
            } else {
                localStorage.removeItem("user");
            }
        },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
