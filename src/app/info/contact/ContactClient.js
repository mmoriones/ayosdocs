'use client';

import { useToast } from '@/context/ToastContext';
import { Mail, MessageCircle, Send } from 'lucide-react';

/**
 * ContactClient Component
 */
export default function ContactClient() {
  const { showToast } = useToast();

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
        <section className="bg-ctp-mantle rounded-[2rem] p-8 md:p-12 shadow-sm border border-ctp-surface0 space-y-10">
          <header className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-black text-ctp-text tracking-tight uppercase">
              Contact <span className="text-ctp-sky-800">Us</span>
            </h1>
            <p className="text-[18px] text-ctp-subtext1 font-medium leading-relaxed opacity-90">
              Have questions, feedback, or suggestions? We&apos;d love to hear from you.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-ctp-sky-800/10 flex items-center justify-center text-ctp-sky-800 border border-ctp-sky-800/20 shadow-sm">
                    <Mail size={20} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl font-black text-ctp-text uppercase tracking-tight">Email Us</h2>
                </div>
                <div className="pl-1 space-y-1">
                  <p className="text-ctp-sky-800 font-black text-[18px]">contact@ayosdocs.com</p>
                  <p className="text-ctp-subtext1 text-sm font-bold uppercase tracking-widest opacity-60">Response within 24-48 hours.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-ctp-mauve/10 flex items-center justify-center text-ctp-mauve border border-ctp-mauve/20 shadow-sm">
                    <MessageCircle size={20} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl font-black text-ctp-text uppercase tracking-tight">Social Media</h2>
                </div>
                <p className="text-ctp-subtext1 text-[16px] font-medium leading-relaxed">Follow us for updates and official tips:</p>
                <div className="flex gap-6">
                  <button className="text-ctp-sky-800 font-black text-sm uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">Facebook</button>
                  <button className="text-ctp-sky-800 font-black text-sm uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">Twitter</button>
                </div>
              </div>
            </div>

            <form className="space-y-6 bg-ctp-base p-8 rounded-[2rem] border border-ctp-surface0 shadow-lg" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-ctp-subtext0 uppercase tracking-[0.2em] pl-1">Name</label>
                <input
                  required
                  type="text"
                  minLength={2}
                  maxLength={100}
                  className="w-full px-6 py-4 bg-ctp-mantle border border-ctp-surface0 rounded-2xl focus:ring-4 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 outline-none transition-all text-ctp-text text-[15px] font-bold placeholder:text-ctp-subtext0 shadow-sm"
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-ctp-subtext0 uppercase tracking-[0.2em] pl-1">Email</label>
                <input
                  required
                  type="email"
                  maxLength={100}
                  className="w-full px-6 py-4 bg-ctp-mantle border border-ctp-surface0 rounded-2xl focus:ring-4 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 outline-none transition-all text-ctp-text text-[15px] font-bold placeholder:text-ctp-subtext0 shadow-sm"
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-ctp-subtext0 uppercase tracking-[0.2em] pl-1">Message</label>
                <textarea
                  required
                  rows="4"
                  minLength={10}
                  maxLength={2000}
                  className="w-full px-6 py-4 bg-ctp-mantle border border-ctp-surface0 rounded-2xl focus:ring-4 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 outline-none transition-all text-ctp-text text-[15px] font-bold placeholder:text-ctp-subtext0 resize-none shadow-sm"
                  placeholder="How can we help you today?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-ctp-sky-800 text-ctp-base py-5 px-6 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-xl shadow-ctp-sky-800/20 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <Send size={18} strokeWidth={3} />
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
