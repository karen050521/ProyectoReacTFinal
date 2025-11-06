import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import LoginPage from './pages/auth/LoginPage'; // Nueva página de login con Google
import Loader from './common/Loader';
import routes from './routes';

// Dependency Inversion: AuthProvider maneja abstracción de auth
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from "../src/components/Auth/ProtectedRoute";
import MicrosoftCallback from './components/Auth/MicrosoftCallback';
import MsalSync from './components/Auth/MsalSync';

// MSAL imports para autenticación Microsoft
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./config/msalConfig";
import Home from './pages/Dashboard/Home';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

// Crear instancia de MSAL
const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    // Estructura híbrida: MsalProvider -> AuthProvider -> MsalSync
    // MsalProvider permite que MsalSync use hooks de MSAL
    // AuthProvider es la fuente única de verdad para autenticación
    // MsalSync actúa como adaptador que conecta MSAL con AuthProvider
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <MsalSync>
          <Toaster
            position="top-right"
            reverseOrder={false}
            containerClassName="overflow-auto"
          />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/auth/callback" element={<MicrosoftCallback />} />

            {/* Rutas protegidas - Single Responsibility */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DefaultLayout />}>
                <Route index element={<Home />} />
                <Route path="/dashboard" element={<Home />} />
                {routes.map((route, index) => {
                  const { path, component: Component } = route;
                  return (
                    <Route
                      key={index}
                      path={path}
                      element={
                        <Suspense fallback={<Loader />}>
                          <Component />
                        </Suspense>
                      }
                    />
                  );
                })}
              </Route>
            </Route>
          </Routes>
        </MsalSync>
      </AuthProvider>
    </MsalProvider>
  );
}

export default App;
