import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Parcelles from './components/Parcelles.jsx';
import Services from './components/Services.jsx';
import Process from './components/Process.jsx';
import Faq from './components/Faq.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Parcelles />
        <Services />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
