"use client";

import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F5F1EC] pb-20">
      {/* Header */}
      <div className="bg-[#E7D7C9] py-16 md:py-24">
        <div className="container-custom text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#5C4033] mb-4">
            Get in Touch
          </h1>
          <p className="text-[#8B6B52] text-sm md:text-base font-medium">
            We're here to help with any questions you may have.
          </p>
        </div>
      </div>

      <div className="container-custom py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#5C4033] mb-8">
                Contact Details
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E7D7C9] flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-[#9C6B4F]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#9C6B4F] font-bold mb-1">Email</p>
                    <p className="text-[#5C4033] font-medium">concierge@novaboutique.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E7D7C9] flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-[#9C6B4F]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#9C6B4F] font-bold mb-1">Phone</p>
                    <p className="text-[#5C4033] font-medium">+1 (234) 567-890</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E7D7C9] flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-[#9C6B4F]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#9C6B4F] font-bold mb-1">Studio</p>
                    <p className="text-[#5C4033] font-medium">123 Fashion Ave, Suite 100<br />New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#5C4033] mb-6">
                Customer Care
              </h2>
              <p className="text-[#8B6B52] text-sm leading-relaxed">
                Our concierge team is available Monday through Friday, 9am - 6pm EST. We aim to respond to all inquiries within 24 hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-[#E7D7C9]">
            <form className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#9C6B4F] font-bold ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full bg-transparent border-b border-[#E7D7C9] py-3 px-1 text-sm focus:outline-none focus:border-[#9C6B4F] transition-colors placeholder:text-[#C69C72]/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#9C6B4F] font-bold ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  className="w-full bg-transparent border-b border-[#E7D7C9] py-3 px-1 text-sm focus:outline-none focus:border-[#9C6B4F] transition-colors placeholder:text-[#C69C72]/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#9C6B4F] font-bold ml-1">
                  Subject
                </label>
                <select className="w-full bg-transparent border-b border-[#E7D7C9] py-3 px-1 text-sm focus:outline-none focus:border-[#9C6B4F] transition-colors">
                  <option>Order Inquiry</option>
                  <option>Product Question</option>
                  <option>Returns & Exchanges</option>
                  <option>General Feedback</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[#9C6B4F] font-bold ml-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="How can we help you?"
                  className="w-full bg-transparent border-b border-[#E7D7C9] py-3 px-1 text-sm focus:outline-none focus:border-[#9C6B4F] transition-colors placeholder:text-[#C69C72]/50 resize-none"
                />
              </div>

              <button className="w-full bg-[#9C6B4F] text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#6F4E37] transition-all hover:shadow-lg mt-4">
                <Send size={14} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
