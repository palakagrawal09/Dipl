import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Credibility from '@/components/Credibility';
import About from '@/components/About';
import Capabilities from '@/components/Capabilities';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Credibility />
        <About />
        <Capabilities />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;