'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  User, 
  Settings, 
  LogOut, 
  BookOpen, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Modal, Avatar } from '@/components/ui';

/**
 * High-fidelity Account Menu.
 * Displayed as a premium bottom-sheet style modal on mobile.
 */
export default function AccountMenu({ isOpen, onClose, session }) {
  const router = useRouter();
  const user = session?.user;
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);

  const handleTouchStart = (e) => {
    // Reset drag on start just in case
    setDragY(0);
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;
    
    // Only allow dragging down
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 100) {
      // Small timeout to allow the transition to start before closing
      // though onClose will likely unmount it immediately.
      onClose();
      // Reset position after closure (will happen next time it mounts/opens)
      setTimeout(() => setDragY(0), 300);
    } else {
      setDragY(0);
    }
  };

  const menuGroups = [
    {
      items: [
        { 
          label: 'Personal Profile', 
          icon: User, 
          href: '/profile', 
          color: 'text-blue-500', 
          bg: 'bg-blue-50' 
        },
        { 
          label: 'My Documents', 
          icon: BookOpen, 
          href: '/my-docs', 
          color: 'text-purple-500', 
          bg: 'bg-purple-50' 
        },
      ]
    },
    {
      items: [
        { 
          label: 'Settings', 
          icon: Settings, 
          href: '/settings', 
          color: 'text-gray-500', 
          bg: 'bg-gray-50' 
        },
        { 
          label: 'Admin Workspace', 
          icon: ShieldCheck, 
          href: '/admin', 
          color: 'text-emerald-500', 
          bg: 'bg-emerald-50',
          show: user?.role === 'admin'
        },
      ]
    }
  ];

  const handleNavigate = (href) => {
    onClose();
    router.push(href);
  };

  const handleLogout = async () => {
    onClose();
    await signOut({ callbackUrl: '/' });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      className="!items-end !p-0 lg:!items-center lg:!p-4"
      contentClassName="!rounded-t-[32px] !rounded-b-none lg:!rounded-[32px] !border-none lg:!border-white/20 shadow-2xl"
      contentStyle={{ 
        transform: `translateY(${dragY}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}
      animationClassName="animate-in slide-in-from-bottom duration-500 lg:zoom-in-95"
      noPadding
    >
      <div className="bg-ios-gradient pb-8 px-6 touch-none">
        {/* Drag Handle & Header Trigger Area */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="py-4 pt-4 cursor-grab active:cursor-grabbing"
        >
          <div className="w-12 h-1.5 bg-gray-400/20 rounded-full mx-auto" />
        </div>

        {/* User Branding Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
             <Avatar 
              src={user?.image} 
              name={user?.name} 
              size="xl" 
              className="!border-white shadow-lg ring-4 ring-white/30" 
            />
          </div>
          <h3 className="text-[22px] font-black text-[#1C1C1E] tracking-tight">{user?.name}</h3>
          <p className="text-[14px] font-medium text-gray-500">{user?.email}</p>
        </div>

        {/* Menu Items */}
        <div className="space-y-6">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="bg-white/60 backdrop-blur-md rounded-[28px] overflow-hidden border border-white/40 shadow-sm">
              {group.items.filter(i => i.show !== false).map((item, iIdx) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigate(item.href)}
                  className={`w-full flex items-center justify-between p-4 active:bg-gray-50/50 transition-colors group ${
                    iIdx !== group.items.length - 1 ? 'border-b border-gray-100/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                      <item.icon size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-[15px] font-bold text-[#1C1C1E]">{item.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-active:text-[#0038A8] transition-all" strokeWidth={2.5} />
                </button>
              ))}
            </div>
          ))}

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="w-full bg-[#FF3B30]/5 text-[#FF3B30] p-4 rounded-[28px] font-black text-[15px] flex items-center justify-center gap-2 active:bg-[#FF3B30]/10 transition-all border border-[#FF3B30]/10"
          >
            <LogOut size={20} strokeWidth={3} />
            Logout
          </button>
        </div>
      </div>
    </Modal>
  );
}
