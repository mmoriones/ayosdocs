'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context';
import { Mail, MessageCircle, Send, Loader2, Globe, Clock, Sparkles } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import axios from 'axios';

/**
 * ContactClient Component
 */
export default function ContactClient() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('/api/contact', formData);
      
      showToast({
        type: 'success',
        title: 'Message Sent',
        message: "We've received your message and will get back to you soon."
      });
      
      setFormData({ name: '', email: '', message: '' });
      e.target.reset();
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.error || 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-ctp-base font-sans pb-20">
      <PageHeader 
        icon={Mail}
        title="Contact Support"
        description="Have questions or feedback? Our team is here to help you."
        actions={
          <div className="bg-ctp-base/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-ctp-surface1 shadow-sm flex items-center gap-3 text-ctp-green">
            <Clock size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-ctp-subtext1">Avg. response: 24h</span>
          </div>
        }
      />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Contact Form */}
          <div className="lg:col-span-2 space-y-10">
            <section className="bg-ctp-base border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-ctp-surface1 bg-ctp-mantle/50 flex items-center justify-between">
                <h2 className="text-sm font-bold text-ctp-text uppercase tracking-widest">Send a Message</h2>
                <div className="flex items-center gap-2 text-ctp-sky-800">
                  <Sparkles size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Priority support</span>
                </div>
              </div>
              <div className="p-8">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      required
                      type="text"
                      name="name"
                      maxLength={70}
                      value={formData.name}
                      placeholder="Juan Dela Cruz"
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full bg-ctp-mantle border border-ctp-surface1 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-ctp-sky-800 transition-all font-medium placeholder:text-ctp-subtext0 disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      required
                      type="email"
                      name="email"
                      maxLength={100}
                      value={formData.email}
                      placeholder="juan@example.com"
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full bg-ctp-mantle border border-ctp-surface1 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-ctp-sky-800 transition-all font-medium placeholder:text-ctp-subtext0 disabled:opacity-50"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest ml-1">Message</label>
                    <textarea
                      required
                      name="message"
                      maxLength={1000}
                      value={formData.message}
                      rows={5}
                      placeholder="Tell us how we can help..."
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full bg-ctp-mantle border border-ctp-surface1 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-ctp-sky-800 transition-all font-medium placeholder:text-ctp-subtext0 resize-none disabled:opacity-50"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-ctp-sky-800 text-white rounded-lg font-bold text-xs uppercase tracking-widest shadow-md hover:bg-ctp-sky-800/90 active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>

          {/* Contact Details Sidebar */}
          <aside className="space-y-6">
            <section className="bg-ctp-base rounded-xl border border-ctp-surface1 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-ctp-surface1 bg-ctp-mantle/50">
                <h3 className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">Support Channels</h3>
              </div>
              
              <div className="divide-y divide-ctp-surface1/50">
                <div className="p-5 flex items-start gap-4 hover:bg-ctp-mantle/30 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-ctp-sky-800/10 border border-ctp-sky-800/20 flex items-center justify-center text-ctp-sky-800 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-ctp-text tracking-tight">Email Support</h4>
                    <p className="text-xs font-bold text-ctp-sky-800 mt-1 truncate">support@ayosdocs.com</p>
                    <p className="text-[10px] text-ctp-subtext1 mt-1 font-medium leading-tight">Direct response line.</p>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-4 hover:bg-ctp-mantle/30 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-ctp-mauve/10 border border-ctp-mauve/20 flex items-center justify-center text-ctp-mauve shrink-0">
                    <Globe size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-ctp-text tracking-tight">Help Center</h4>
                    <p className="text-xs font-bold text-ctp-sky-800 mt-1 truncate cursor-pointer hover:underline" onClick={() => router.push('/faqs')}>Explore FAQs</p>
                    <p className="text-[10px] text-ctp-subtext1 mt-1 font-medium leading-tight">Instant guide assistance.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-ctp-mantle border border-ctp-surface1 rounded-xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 text-ctp-mauve">
                <MessageCircle size={18} strokeWidth={2.5} />
                <h3 className="text-[10px] font-bold uppercase tracking-widest">Social Channels</h3>
              </div>
              <p className="text-xs text-ctp-subtext1 leading-relaxed font-medium">
                Follow our official channels for the latest guide updates and holiday alerts.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['Facebook', 'Twitter', 'Instagram'].map(social => (
                  <button key={social} className="px-3 py-1.5 bg-ctp-base border border-ctp-surface1 rounded-lg text-[10px] font-bold uppercase tracking-widest text-ctp-subtext1 hover:text-ctp-sky-800 hover:border-ctp-sky-800/30 transition-all">
                    {social}
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
