import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import microsoftAuthReducer from "./microsoftAuthSlice";

// Configuración de persistencia
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["microsoftAuth"], // Solo persistir microsoftAuth
};

const rootReducer = combineReducers({
    user: userReducer,
    microsoftAuth: microsoftAuthReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
