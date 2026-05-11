import { Truck, ShieldCheck, RefreshCw, Award } from "lucide-react";

export default function FeaturesBar() {
  const features = [
    {
      icon: <Truck size={24} className="text-[#5C4033]" />,
      title: "Free shipping",
      subtitle: "On orders over $50",
    },
    {
      icon: <ShieldCheck size={24} className="text-[#5C4033]" />,
      title: "100% secure",
      subtitle: "Your payments are safe",
    },
    {
      icon: <RefreshCw size={24} className="text-[#5C4033]" />,
      title: "30 days returns",
      subtitle: "If you change your mind",
    },
    {
      icon: <Award size={24} className="text-[#5C4033]" />,
      title: "Loyalty rewards",
      subtitle: "Earn points with every purchase",
    },
  ];

  return (
    <section className="bg-secondary py-12 border-b border-border">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-2">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-primary text-sm uppercase tracking-widest">{feature.title}</h3>
                <p className="text-muted text-xs mt-1">{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
