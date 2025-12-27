import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
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

function App() {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/book" element={<Book />} />
            <Route path="/track" element={<Track />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <LiveChat />
        <Footer />
      </div>
    </AppProvider>
  )
}

export default App