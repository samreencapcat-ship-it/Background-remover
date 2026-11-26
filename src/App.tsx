import { useRef } from 'react';
import { BackgroundRemoverTool } from './components/BackgroundRemoverTool';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { Navbar } from './components/Navbar';

export default function App() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleQuickUploadClick = () => {
    const toolSection = document.getElementById('tool');
    toolSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-white text-[#161124]">
      <Navbar />
      <main>
        <HeroSection onQuickUploadClick={handleQuickUploadClick} />
        <BackgroundRemoverTool fileInputRef={fileInputRef} />
        <HowItWorksSection />
        <FeaturesSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
