import React, { Suspense } from 'react'
import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'

import ThemeProvider from '../contexts/theme'
import { useAuth } from '../services/useAuth'

import Loading from '../components/CustomUI/Loading'
import ConfirmEmail from '../views/auth/ConfirmEmail'
import EmailVerification from '../views/auth/EmailVerification'
import LockScreen from '../views/auth/LockScreen'
import Login from '../views/auth/Login'
import RecoverPassword from '../views/auth/RecoverPassword'
import Register from '../views/auth/Register'
import Page404 from '../views/pages/Page404'
import Page500 from '../views/pages/Page500'
import Support from '../views/pages/Support'
import FAQs from '../views/pages/Support/FAQs'
import GettingStarted from '../views/pages/Support/GettingStarted'
import InstallationInstructions from '../views/pages/Support/InstallationInstructions'
import ProductSpecifications from '../views/pages/Support/ProductSpecifications'
import RegularUpdates from '../views/pages/Support/RegularUpdates'
import ServerRequirements from '../views/pages/Support/ServerRequirements'
import TroubleshootingTips from '../views/pages/Support/TroubleshootingTips'

const DefaultLayout = React.lazy(() => import('../layout/Default'))

const PrivateRoutes = () => {
  const { auth } = useAuth()
  return auth() ? <Outlet /> : <Navigate to="/login" />
}

const App = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="*" name="Home" element={<DefaultLayout />} />
            </Route>

            <Route path="/login" element={<Login />} exact />
            <Route path="/register" element={<Register />} exact />
            <Route
              path="/recover-password"
              element={<RecoverPassword />}
              exact
            />
            <Route path="/lock-screen" element={<LockScreen />} exact />
            <Route path="/confirm-email" element={<ConfirmEmail />} exact />
            <Route
              path="/email-verification"
              element={<EmailVerification />}
              exact
            />
            <Route path="/page-404" element={<Page404 />} exact />
            <Route path="/page-500" element={<Page500 />} exact />
            <Route path="/support" element={<Support />}>
              <Route path="getting-started" element={<GettingStarted />} />
              <Route
                path="product-specifications"
                element={<ProductSpecifications />}
              />
              <Route
                path="installation-and-configuration-instructions"
                element={<InstallationInstructions />}
              />
              <Route
                path="server-requirements"
                element={<ServerRequirements />}
              />
              <Route
                path="troubleshooting-tips"
                element={<TroubleshootingTips />}
              />
              <Route path="faqs" element={<FAQs />} />
              <Route path="regular-updates" element={<RegularUpdates />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
