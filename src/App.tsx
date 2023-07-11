import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Form from './components/Form.';
import CityList from './components/CityList';
import CountryList from './components/CountryList';
import City from './components/City';
import { CitiesProvider } from './contexts/CitiesContext';
import { FakeAuthProvider } from './contexts/FakeAuthContext';
import ProtectedRoute from './pages/ProtectedRoute';
import SpinnerFullPage from './components/SpinnerFullPage.';

const Homepage = lazy(() => import('./pages/Homepage.'));
const Product = lazy(() => import('./pages/Product.'));
const Pricing = lazy(() => import('./pages/Pricing.'));
const PageNotFound = lazy(() => import('./pages/PageNotFound.'));
const Login = lazy(() => import('./pages/Login.'));
const AppLayout = lazy(() => import('./pages/AppLayout'));

function App() {
  return (
    <FakeAuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="login" element={<Login />} />
              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="cities" replace />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="Form" element={<Form />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </FakeAuthProvider>
  );
}

export default App;
