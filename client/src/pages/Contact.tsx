import { useState } from "react";
import { ArrowLeft, Phone, Mail, MapPin, MessageSquare } from "lucide-react";
import { Link } from "wouter";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // You can integrate with your backend here if needed
      // For now, just show success message
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-cream">
      {/* Navigation Bar */}
      <nav className="bg-black border-b border-gold/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gold hover:text-gold/80 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <h2 className="text-2xl font-playfair text-gold">Contact Us</h2>
          <div className="w-24"></div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-playfair text-gold mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-cream/80 max-w-2xl mx-auto">
            Have a plumbing issue? Need a quote? We're here to help. Contact Jason Clark Plumbing today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="border-l-4 border-gold pl-6">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="text-gold" size={24} />
                <h3 className="text-xl font-semibold text-gold">Phone</h3>
              </div>
              <p className="text-cream/80 mb-2">Call us anytime for urgent issues</p>
              <a href="tel:01480769129" className="text-gold hover:text-gold/80 transition-colors font-semibold">
                01480 769129
              </a>
            </div>

            <div className="border-l-4 border-gold pl-6">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="text-gold" size={24} />
                <h3 className="text-xl font-semibold text-gold">WhatsApp</h3>
              </div>
              <p className="text-cream/80 mb-2">Quick messages and photos</p>
              <a href="https://wa.me/447767910713" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold/80 transition-colors font-semibold">
                07767 910713
              </a>
            </div>

            <div className="border-l-4 border-gold pl-6">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="text-gold" size={24} />
                <h3 className="text-xl font-semibold text-gold">Email</h3>
              </div>
              <p className="text-cream/80 mb-2">Send us your enquiry</p>
              <a href="mailto:plumbing@jasonclark.online" className="text-gold hover:text-gold/80 transition-colors font-semibold">
                plumbing@jasonclark.online
              </a>
            </div>

            <div className="border-l-4 border-gold pl-6">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="text-gold" size={24} />
                <h3 className="text-xl font-semibold text-gold">Service Area</h3>
              </div>
              <p className="text-cream/80">
                Huntingdon and surrounding areas in Cambridgeshire
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gold/5 border-2 border-gold/40 p-8">
            <h3 className="text-2xl font-playfair text-gold mb-6">Send us a Message</h3>
            
            {submitted && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded text-green-400">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gold mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black border border-gold/30 text-cream placeholder-cream/40 focus:outline-none focus:border-gold transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black border border-gold/30 text-cream placeholder-cream/40 focus:outline-none focus:border-gold transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gold mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black border border-gold/30 text-cream placeholder-cream/40 focus:outline-none focus:border-gold transition-colors"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gold mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 bg-black border border-gold/30 text-cream placeholder-cream/40 focus:outline-none focus:border-gold transition-colors resize-none"
                  placeholder="Tell us about your plumbing issue..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gold text-black font-semibold hover:bg-gold/90 disabled:opacity-50 transition-colors"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>

            <p className="text-xs text-cream/60 mt-4">
              * Required fields. We'll respond to your enquiry as soon as possible.
            </p>
          </div>
        </div>

        {/* Quick Contact CTA */}
        <div className="mt-16 text-center border-t-2 border-gold/30 pt-12">
          <h2 className="text-2xl font-playfair text-gold mb-6">Need Help Right Away?</h2>
          <p className="text-cream/80 mb-8 max-w-2xl mx-auto">
            For emergency plumbing issues, call us directly at 01480 769129. We offer rapid response times for urgent repairs.
          </p>
          <a
            href="tel:01480769129"
            className="inline-block px-8 py-3 bg-gold text-black font-semibold hover:bg-gold/90 transition-colors"
          >
            Call Now
          </a>
        </div>
      </div>
    </div>
  );
}
