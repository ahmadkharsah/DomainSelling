import { Zap, Globe, TrendingUp } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: "Instant Recognition",
    description: "A memorable domain that customers will remember and trust"
  },
  {
    icon: Globe,
    title: "Global Appeal",
    description: "Universal recognition across markets and industries"
  },
  {
    icon: TrendingUp,
    title: "Investment Value",
    description: "Premium domains appreciate over time as digital assets"
  }
];

export default function ValueProposition() {
  return (
    <section className="py-12 md:py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">Why This Domain?</h2>
        <div className="grid gap-8 md:gap-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-md bg-primary/10 border-2 border-primary flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
