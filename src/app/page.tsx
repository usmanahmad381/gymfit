import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Classes from "@/components/Classes";
import Why from "@/components/Why";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Classes />
      <Why />
      <Pricing />
      <Footer />
      <ChatWidget />
    </main>
  );
}
