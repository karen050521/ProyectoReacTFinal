import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import LoginPage from './pages/auth/LoginPage'; // Nueva página de login con Google
import Loader from './common/Loader';
import routes from './routes';

// Dependency Inversion: AuthProvider maneja abstracción de auth
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from "../src/components/Auth/ProtectedRoute";

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    // Dependency Inversion: App depende de AuthProvider abstraction
    <AuthProvider>
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

        {/* Rutas protegidas - Single Responsibility */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DefaultLayout />}>
            <Route index element={<ECommerce />} />
            <Route path="/dashboard" element={<ECommerce />} />
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
    </AuthProvider>
  );
}

export default App;
