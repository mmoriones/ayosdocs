'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context';
import { Mail, MessageCircle, Send, Loader2, Globe, Clock, Sparkles, User } from 'lucide-react';
import { PublicPageHeader, Button, Input, Card, Badge, Banner } from '@/components/ui';
import axios from 'axios';

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
    <div className="min-h-full pb-20 animate-in fade-in duration-500">
      <PublicPageHeader 
        icon={Mail}
        title="AyosDocs Support"
        description="Have questions or feedback? Our team is here to help you."
        actions={
          <Badge variant="green" icon={Clock}>Avg. response: 24h</Badge>
        }
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-10 mt-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Contact Form */}
          <div className="lg:col-span-2 space-y-10">
            <Card 
              title="Send a Message"
              background="mantle"
              headerAction={
                <Badge variant="sky" icon={Sparkles}>Priority support</Badge>
              }
            >
              <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
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
                />
                <div className="md:col-span-2 space-y-1">
                  <label className="text-ui-detail font-bold text-ctp-subtext1 uppercase tracking-[0.15em] ml-1">Message</label>
                  <textarea
                    required
                    name="message"
                    maxLength={1000}
                    value={formData.message}
                    rows={5}
                    placeholder="Tell us how we can help..."
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full bg-ctp-base border border-ctp-surface1 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:border-ctp-sky-800 transition-all font-medium placeholder:text-ctp-subtext0 resize-none disabled:opacity-50 shadow-inner hover:border-ctp-surface2 focus:ring-4 focus:ring-ctp-sky-800/5"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    className="px-8"
                    leftIcon={isSubmitting ? null : <Send size={16} />}
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Contact Details Sidebar */}
          <aside className="space-y-6">
            <Card 
              title="Support Channels"
              background="mantle"
              noPadding
              headerClassName="!py-3"
            >
              <div className="divide-y divide-ctp-surface1/50">
                <div className="p-5 flex items-start gap-4 hover:bg-ctp-mantle transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-ctp-sky-800/10 border border-ctp-sky-800/20 flex items-center justify-center text-ctp-sky-800 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-ctp-text tracking-tight">Email Support</h4>
                    <p className="text-xs font-bold text-ctp-sky-800 mt-1 truncate">support@ayosdocs.com</p>
                    <p className="text-ui-micro text-ctp-subtext1 mt-1 font-medium leading-tight">Direct response line.</p>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-4 hover:bg-ctp-mantle transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-ctp-mauve/10 border border-ctp-mauve/20 flex items-center justify-center text-ctp-mauve shrink-0">
                    <Globe size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-ctp-text tracking-tight">Help Center</h4>
                    <p className="text-xs font-bold text-ctp-sky-800 mt-1 truncate cursor-pointer hover:underline" onClick={() => router.push('/faqs')}>Explore FAQs</p>
                    <p className="text-ui-micro text-ctp-subtext1 mt-1 font-medium leading-tight">Instant guide assistance.</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card background="mantle" className="space-y-5">
              <div className="flex items-center gap-3 text-ctp-mauve">
                <MessageCircle size={18} strokeWidth={2.5} />
                <h3 className="text-ui-micro font-bold uppercase tracking-widest">Social Channels</h3>
              </div>
              <p className="text-xs text-ctp-subtext1 leading-relaxed font-medium">
                Follow our official channels for the latest guide updates and holiday alerts.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
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
                    variant="ghost"
                    className="opacity-40 group"
                    disabled
                    title={social.name}
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-5 h-5 fill-current transition-transform group-hover:scale-110"
                    >
                      <path d={social.path} />
                    </svg>
                  </Button>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
