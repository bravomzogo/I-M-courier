import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import LiveChat from './components/LiveChat'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Book from './pages/Book'
import Track from './pages/Track'
import Pricing from './pages/Pricing'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Approvals from './pages/Approvals'
import DriverDashboard from './pages/DriverDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import DriverGPSTracking from './components/DriverGPSTracking'


function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/book" element={<Book />} />
              <Route path="/track" element={<Track />} />
              <Route path="/track/:trackingNumber" element={<Track />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/approvals" element={
                <ProtectedRoute requireApprover>
                  <Approvals />
                </ProtectedRoute>
              } />
              
              <Route path="/driver" element={
                <ProtectedRoute requireDriver>
                  <DriverDashboard />
                </ProtectedRoute>
              } />
                <Route path="/driver/tracking" element={
        <ProtectedRoute role="driver">
          <DriverGPSTracking />
        </ProtectedRoute>
      } />
            </Routes>
          </main>
          <LiveChat />
          <Footer />
        </div>
      </AuthProvider>
    </AppProvider>
  )
}

export default App