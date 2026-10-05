import {useState} from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Parcelles from './components/Parcelles.jsx';
import Services from './components/Services.jsx';
import Construction from './components/Construction.jsx';
import Process from './components/Process.jsx';
import Faq from './components/Faq.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';
import {useReveal} from './utils.js';

export default function App() {
  const [filtres, setFiltres] = useState({ville: 'Toutes', budgetMax: 0});
  const ref = useReveal();

  return (
    <div ref={ref}>
      <Header />
      <main>
        <Hero filtres={filtres} setFiltres={setFiltres} />
        <About />
        <Parcelles filtres={filtres} setFiltres={setFiltres} />
        <Services />
        <Construction />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
