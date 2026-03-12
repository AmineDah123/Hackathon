import './App.css'

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './Components/Home/Home'
import About from './Components/About/About'
import Tracks from './Components/Tracks/Tracks'
import Speakers from './Components/Speakers/Speakers'
import Sponsors from './Components/Sponsors/Sponsors'
import Faq from './Components/Faq/Faq'
import Footer from './Components/Footer/Footer'
import RegistrationForm from './Components/RegistrationForm/RegistrationForm'
import Loading from './Components/Loading/Loading'
import Contact from './Components/Contact/Contact'
import AdminPage from './Components/AdminPage/AdminPage'

function App() {

  const [isLoading, setIsLoading] = useState(true);

  return (
    isLoading ? (
      <Loading onComplete={() => setIsLoading(false)} />
    ) : (
      <BrowserRouter>

        <Routes>

          <Route path="/" element={
            <>
              <Home />
              <About />
              <Tracks />
              <Speakers />
              <Sponsors />
              <Faq />
              <Footer />
            </>
          } />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/registrationForm" element={<RegistrationForm />} />
          <Route path="/contact" element={<Contact />} />


        </Routes>

      </BrowserRouter>
    )
  )
}

export default App