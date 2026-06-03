'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context';
import { Mail, MessageCircle, Send, Globe, Clock, User } from 'lucide-react';
import { PublicPageHeader, Button, Input, Card, Badge } from '@/components/ui';
import axios from 'axios';
import Link from 'next/link';

/**
 * SupportClient Component
 * Handles user inquiries and feedback via the support form.
 */
export default function SupportClient() {
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
    <div className="min-h-full pb-32 animate-in fade-in duration-700 relative overflow-hidden">
      <PublicPageHeader 
        icon={Mail}
        title="Support"
        description="Have questions or feedback? Our team is here to help you."
        actions={
          <Badge variant="secondary" className="!bg-[#34C759]/10 !text-[#34C759] !border-none flex items-center gap-2 px-4 py-2 rounded-full shadow-sm">
            <Clock size={14} strokeWidth={2.5} />
            <span className="text-[11px] font-black uppercase tracking-widest">Avg. response: 24h</span>
          </Badge>
        }
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-10 mt-4 space-y-12 lg:space-y-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Contact Form */}
          <div className="lg:col-span-8 space-y-10">
            <Card 
              className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/70 backdrop-blur-xl relative"
              noPadding
            >
              <div className="p-8 lg:p-10 border-b border-gray-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-[20px] lg:text-[22px] font-black text-[#1C1C1E] tracking-tight">Send a Message</h3>
                <div className="flex items-center gap-3 px-3 py-1.5 bg-[#007AFF]/5 rounded-full border border-[#007AFF]/10">
                   <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[#007AFF]">
                     <Send size={12} strokeWidth={3} />
                   </div>
                   <span className="text-[10px] font-black text-[#007AFF] uppercase tracking-widest">Priority Support</span>
                </div>
              </div>

              <form className="p-6 md:p-10 lg:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10" onSubmit={handleSubmit}>
                <Input
                  label="Full Name"
                  required
                  type="text"
                  name="name"
                  maxLength={70}
                  value={formData.name}
                  placeholder="Juan Dela Cruz"
                  onChange={handleChange}
                  disabled={isSubmitting}
                  leftIcon={User}
                  className="h-16 !rounded-[24px] shadow-sm border-white/60 focus-within:border-[#007AFF]/20 focus-within:ring-[#007AFF]/5"
                />
                <Input
                  label="Email Address"
                  required
                  type="email"
                  name="email"
                  maxLength={100}
                  value={formData.email}
                  placeholder="juan@example.com"
                  onChange={handleChange}
                  disabled={isSubmitting}
                  leftIcon={Mail}
                  className="h-16 !rounded-[24px] shadow-sm border-white/60 focus-within:border-[#007AFF]/20 focus-within:ring-[#007AFF]/5"
                />
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Message</label>
                  <textarea
                    required
                    name="message"
                    maxLength={1000}
                    value={formData.message}
                    rows={6}
                    placeholder="Tell us how we can help..."
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full bg-white/50 backdrop-blur-sm border border-white/60 rounded-[32px] px-8 py-6 text-[16px] focus:outline-none focus:border-[#007AFF]/30 transition-all font-medium placeholder:text-gray-300 resize-none disabled:opacity-50 shadow-sm hover:border-gray-200 focus:ring-8 focus:ring-[#007AFF]/5"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end pt-4">
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    className="w-full md:w-auto px-12 h-16 !rounded-[24px] text-[16px] font-black shadow-[0_12px_40px_rgba(0,56,168,0.2)] bg-[#0038A8] text-white hover:bg-[#0038A8]/90 active:scale-95 transition-all"
                    rightIcon={isSubmitting ? null : <Send size={20} strokeWidth={3} />}
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Contact Details Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <Card 
              className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/70 backdrop-blur-xl"
              noPadding
            >
              <div className="p-6 border-b border-gray-100/50">
                <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em]">Support Channels</h3>
              </div>
              <div className="divide-y divide-gray-100/50">
                <div className="p-8 lg:p-10 flex items-start gap-6 hover:bg-white transition-all duration-500">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100/50 flex items-center justify-center text-[#007AFF] shrink-0 shadow-sm">
                    <Mail size={24} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[16px] font-bold text-[#1C1C1E] tracking-tight">Email Support</h4>
                    <p className="text-[14px] font-black text-[#007AFF] mt-1.5 truncate">support@ayosdocs.com</p>
                    <p className="text-[12px] text-gray-400 mt-2 font-medium leading-relaxed uppercase tracking-wider">Direct response line for all inquiries.</p>
                  </div>
                </div>

                <button className="w-full text-left p-8 lg:p-10 flex items-start gap-6 hover:bg-white transition-all duration-500 cursor-pointer group" onClick={() => router.push('/faqs')}>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100/50 flex items-center justify-center text-[#AF52DE] shrink-0 shadow-sm group-active:scale-90 transition-all">
                    <Globe size={24} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[16px] font-bold text-[#1C1C1E] tracking-tight">Help Center</h4>
                    <p className="text-[14px] font-black text-[#007AFF] mt-1.5 truncate group-hover:underline">Explore FAQs</p>
                    <p className="text-[12px] text-gray-400 mt-2 font-medium leading-relaxed uppercase tracking-wider">Instant assistance for common guides.</p>
                  </div>
                </button>
              </div>
            </Card>

            <Card className="!rounded-[32px] overflow-hidden border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/70 backdrop-blur-xl p-8 lg:p-10 space-y-6 relative group" noPadding>
              <div className="flex items-center gap-4 text-[#AF52DE]">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100/50">
                  <MessageCircle size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em]">Social Channels</h3>
              </div>
              <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
                Follow our official channels for the latest guide updates and holiday alerts.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-2">
                {[
                  { 
                    name: 'Facebook', 
                    path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'
                  },
                  { 
                    name: 'Twitter', 
                    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'
                  },
                  { 
                    name: 'Instagram', 
                    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z'
                  }
                ].map(social => (
                  <Button 
                    key={social.name} 
                    variant="secondary"
                    className="!bg-white/80 !border-white/60 !p-4 h-14 !rounded-2xl group shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all"
                    disabled
                    title={social.name}
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-6 h-6 fill-[#1C1C1E] transition-transform group-hover:scale-110"
                    >
                      <path d={social.path} />
                    </svg>
                  </Button>
                ))}
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/5 blur-2xl rounded-full" />
            </Card>
          </aside>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-[20%] -left-20 w-80 h-80 bg-[#0038A8]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] -right-20 w-96 h-96 bg-[#AF52DE]/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
