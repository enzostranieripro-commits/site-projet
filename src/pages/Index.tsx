import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MetiersTicker from "@/components/MetiersTicker";
import ProblemSection from "@/components/ProblemSection";
import SolutionsSection from "@/components/SolutionsSection";
import ServicesSection from "@/components/ServicesSection";
import MethodSection from "@/components/MethodSection";
import PricingSection from "@/components/PricingSection";
import DiagnosticSection from "@/components/DiagnosticSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import SiteFooter from "@/components/SiteFooter";
import AuditFormModal from "@/components/AuditFormModal";
import ChatbotBubble from "@/components/ChatbotBubble";
import MetiersTicker2 from "@/components/MetiersTicker";

const Index = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <Hero />
    <MetiersTicker />
    <ProblemSection />
    <SolutionsSection />
    <ServicesSection />
    <MethodSection />
    <PricingSection />
    <DiagnosticSection />
    <TestimonialsSection />
    <FAQSection />
    <FinalCTA />
    <MetiersTicker />
    <SiteFooter />
    <AuditFormModal />
    <ChatbotBubble />
  </div>
);

export default Index;
