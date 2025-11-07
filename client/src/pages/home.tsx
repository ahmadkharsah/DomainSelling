import DomainHero from '@/components/DomainHero';
import ValueProposition from '@/components/ValueProposition';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <DomainHero />
      <ValueProposition />
      <ContactForm />
      <Footer />
    </div>
  );
}
