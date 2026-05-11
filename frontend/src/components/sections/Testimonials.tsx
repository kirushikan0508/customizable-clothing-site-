import { Star } from "lucide-react";

const testimonials = [
  {
    text: "The quality is amazing! The colors are exactly as shown in the pictures and the fit is perfect.",
    name: "Sarah Jenkins",
    role: "Verified Buyer",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    text: "I love the material. It feels premium and extremely comfortable for everyday wear. Highly recommend!",
    name: "Emily Clark",
    role: "Verified Buyer",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    text: "Absolutely gorgeous collection. I always get compliments when I wear their dresses.",
    name: "Jessica Alba",
    role: "Verified Buyer",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-[#E7D7C9]">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="section-subheading mb-2">Testimonials</p>
          <h2 className="section-heading">What people are saying</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-white rounded-[24px] p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-yellow-400" />)}
                </div>
                <p className="text-[#5C4033] font-medium leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>
              </div>
              <div className="flex items-center gap-3">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-bold text-primary">{testimonial.name}</p>
                  <p className="text-xs text-muted">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
