import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MicrosoftUserState {
  isAuthenticated: boolean;
  user: {
    id: string;
    displayName: string;
    email: string;
    givenName: string;
    surname: string;
    userPrincipalName: string;
    jobTitle?: string;
    officeLocation?: string;
    mobilePhone?: string;
  } | null;
  photo: string | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: MicrosoftUserState = {
  isAuthenticated: false,
  user: null,
  photo: null,
  accessToken: null,
  loading: false,
  error: null,
};

const microsoftAuthSlice = createSlice({
  name: 'microsoftAuth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUserData: (state, action: PayloadAction<MicrosoftUserState['user']>) => {
      state.user = action.payload;
    },
    setUserPhoto: (state, action: PayloadAction<string | null>) => {
      state.photo = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.photo = null;
      state.accessToken = null;
      state.error = null;
    },
  },
});

export const {
  setAuthenticated,
  setUserData,
  setUserPhoto,
  setAccessToken,
  setLoading,
  setError,
  logout,
} = microsoftAuthSlice.actions;

export default microsoftAuthSlice.reducer;
