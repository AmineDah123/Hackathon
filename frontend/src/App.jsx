import './App.css'

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './Components/Home/Home'
import About from './Components/About/About'
import Tracks from './Components/Tracks/Tracks'
import Sponsors from './Components/Sponsors/Sponsors'
import Faq from './Components/Faq/Faq'
import Footer from './Components/Footer/Footer'
import RegistrationForm from './Components/RegistrationForm/RegistrationForm'
import Loading from './Components/Loading/Loading'


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
              <Sponsors />
              <Faq />
              <Footer />
            </>
          } />

          <Route path="/registrationForm" element={<RegistrationForm />} />



        </Routes>

      </BrowserRouter>
    )
  )
}

export default App