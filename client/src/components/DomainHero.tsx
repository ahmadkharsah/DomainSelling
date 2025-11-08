interface DomainHeroProps {
  domainName: string;
  accentColor: string;
}

export default function DomainHero({ domainName, accentColor }: DomainHeroProps) {
  const getFontSizeClass = (length: number) => {
    if (length <= 12) {
      return "text-4xl sm:text-5xl md:text-7xl";
    } else if (length <= 18) {
      return "text-3xl sm:text-4xl md:text-6xl";
    } else if (length <= 25) {
      return "text-2xl sm:text-3xl md:text-5xl";
    } else {
      return "text-xl sm:text-2xl md:text-4xl";
    }
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 
          className={`${getFontSizeClass(domainName.length)} font-bold mb-4 sm:mb-6 leading-tight tracking-tight whitespace-nowrap`}
          style={{
            background: `linear-gradient(to right, currentColor, ${accentColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          data-testid="text-domain-name"
        >
          {domainName}
        </h1>
        <p className="text-base sm:text-lg md:text-xl leading-relaxed opacity-80 px-4">
          A premium domain name ready to elevate your brand. Memorable, valuable, and available for acquisition.
        </p>
      </div>
    </section>
  );
}
