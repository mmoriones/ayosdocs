import React, { useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

const Contact = () => {
  const { showToast } = useToast();

  useEffect(() => {
    document.title = "Contact Us | AyosDocs Support";
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast({
      type: 'success',
      title: 'Message Sent',
      message: "We've received your message and will get back to you soon."
    });
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-ctp-base text-ctp-text px-6 lg:px-10 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-ctp-mantle rounded-2xl p-8 md:p-12 shadow-sm border border-ctp-surface0 space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-ctp-text">
            Contact <span className="text-ctp-sapphire">Us</span>
          </h1>
          <p className="text-lg text-ctp-subtext1">
            Have questions, feedback, or suggestions? We'd love to hear from you.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-ctp-text">Email Us</h2>
                <p className="text-ctp-sapphire font-medium">contact@ayosdocs.com</p>
                <p className="text-ctp-subtext0 text-sm">We typically respond within 24-48 hours.</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-ctp-text">Social Media</h2>
                <p className="text-ctp-subtext1">Follow us for updates and tips:</p>
                <div className="flex gap-4">
                  <span className="text-ctp-sapphire cursor-pointer hover:underline">Facebook</span>
                  <span className="text-ctp-sapphire cursor-pointer hover:underline">Twitter</span>
                </div>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-ctp-subtext1 mb-1">Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 bg-ctp-base border border-ctp-surface0 rounded-lg focus:ring-2 focus:ring-ctp-sapphire focus:border-transparent outline-none transition-all text-ctp-text"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ctp-subtext1 mb-1">Email</label>
                <input
                  required
                  type="email"
                  className="w-full px-4 py-2 bg-ctp-base border border-ctp-surface0 rounded-lg focus:ring-2 focus:ring-ctp-sapphire focus:border-transparent outline-none transition-all text-ctp-text"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ctp-subtext1 mb-1">Message</label>
                <textarea
                  required
                  rows="4"
                  className="w-full px-4 py-2 bg-ctp-base border border-ctp-surface0 rounded-lg focus:ring-2 focus:ring-ctp-sapphire focus:border-transparent outline-none transition-all text-ctp-text"
                  placeholder="How can we help?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-ctp-sapphire text-ctp-base py-2 px-4 rounded-lg font-semibold hover:bg-ctp-sapphire/90 transition-colors shadow-sm"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
