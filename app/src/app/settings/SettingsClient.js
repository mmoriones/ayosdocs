'use client';

import { Bell, Globe, Lock, Palette, Smartphone, Shield } from 'lucide-react';

/**
 * Temporary Settings client page.
 */
export default function SettingsClient() {
  return (
    <div className="bg-ctp-base font-sans text-ctp-text min-h-screen pb-20">
      <div className="px-6 lg:px-10 py-8 border-b border-ctp-surface1 bg-ctp-mantle/50">
        <div className="max-w-[1600px] mx-auto">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-ctp-text">Settings</h1>
            <p className="text-sm text-ctp-subtext1">Configure your workspace and privacy preferences.</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Navigation/Categories */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {[
                { label: 'General', icon: Globe, active: true },
                { label: 'Appearance', icon: Palette },
                { label: 'Notifications', icon: Bell },
                { label: 'Privacy & Security', icon: Shield },
                { label: 'Sessions', icon: Smartphone },
                { label: 'Password', icon: Lock },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    item.active 
                      ? 'bg-ctp-sky-800/10 text-ctp-sky-800' 
                      : 'text-ctp-subtext1 hover:bg-ctp-mantle hover:text-ctp-text'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content Area */}
          <div className="lg:col-span-2">
            <section className="bg-ctp-base border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-ctp-surface1">
                <h2 className="text-lg font-bold tracking-tight text-ctp-text">General Preferences</h2>
              </div>
              <div className="p-8 space-y-10">
                <div className="flex items-center justify-between gap-8">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-ctp-text tracking-tight">Language</h4>
                    <p className="text-xs text-ctp-subtext1">Select your preferred language for the interface.</p>
                  </div>
                  <select className="bg-ctp-mantle border border-ctp-surface1 rounded-lg px-3 py-2 text-sm font-semibold text-ctp-text focus:outline-none focus:border-ctp-sky-800 shadow-sm outline-none">
                    <option>English (US)</option>
                    <option>Tagalog (Philippines)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between gap-8 pt-6 border-t border-ctp-surface1/50">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-ctp-text tracking-tight">Location Services</h4>
                    <p className="text-xs text-ctp-subtext1">Allow AyosDocs to suggest offices based on your current location.</p>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-ctp-surface1 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ctp-sky-800 transition-colors"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-8 pt-6 border-t border-ctp-surface1/50">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-ctp-text tracking-tight">Community Analytics</h4>
                    <p className="text-xs text-ctp-subtext1">Share anonymous usage data to help improve government guide accuracy.</p>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-ctp-surface1 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ctp-sky-800 transition-colors"></div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-ctp-mantle/50 border-t border-ctp-surface1 flex justify-end">
                <button className="px-6 py-2 bg-ctp-sky-800 text-white rounded-lg text-sm font-bold hover:bg-ctp-sky-800/90 shadow-sm transition-all active:scale-[0.98]">
                  Save Changes
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
