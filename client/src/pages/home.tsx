import DomainHero from '@/components/DomainHero';
import ValueProposition from '@/components/ValueProposition';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { type SiteConfig } from '@shared/schema';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { data: config, isLoading } = useQuery<Omit<SiteConfig, "resendApiKey">>({
    queryKey: ["/api/site-config"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  const domainName = config?.domainName || "YourDomain.com";
  const backgroundColor = config?.backgroundColor || "#FFFFFF";
  const accentColor = config?.accentColor || "#000000";
  const fontColor = config?.fontColor || "#000000";

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor,
        color: fontColor,
      }}
    >
      <DomainHero domainName={domainName} accentColor={accentColor} />
      <ValueProposition />
      <ContactForm />
      <Footer />
    </div>
  );
}
