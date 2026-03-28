import React, { useState } from 'react';
import { Home, Bell, Mail, Bookmark, User, Settings, LogOut, Search } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('홈');

  const handleLogout = () => {
    signOut(auth);
  };

  const navItems = [
    { icon: Home, label: '홈' },
    { icon: Search, label: '탐색' },
    { icon: Bell, label: '알림' },
    { icon: Mail, label: '쪽지' },
    { icon: Bookmark, label: '북마크' },
    { icon: User, label: '프로필' },
    { icon: Settings, label: '설정' },
  ];

  return (
    <div className="w-[275px] h-screen sticky top-0 flex flex-col px-2 py-1">
      <div className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-x-light-gray cursor-pointer my-1 transition-colors">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-7 h-7 fill-current text-x-black"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
      </div>

      <nav className="flex-1 space-y-1 mt-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className="flex items-center gap-5 p-3 pr-6 rounded-full hover:bg-x-light-gray text-x-black transition-colors w-fit group"
            >
              <item.icon size={26} className={isActive ? "fill-current" : "group-hover:scale-110 transition-transform"} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[20px] ${isActive ? 'font-bold' : 'font-normal'}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button className="w-[90%] bg-x-blue hover:bg-x-blue-hover text-white rounded-full py-3.5 font-bold text-[17px] mt-4 shadow-sm transition-colors">
        게시하기
      </button>

      <div className="mt-auto mb-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-full hover:bg-x-light-gray text-x-black transition-colors"
        >
          <img
            src={auth.currentUser?.photoURL || `https://ui-avatars.com/api/?name=${auth.currentUser?.displayName || 'T'}&background=random`}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col items-start flex-1 min-w-0">
            <span className="font-bold text-[15px] truncate w-full text-left">{auth.currentUser?.displayName || 'Teacher'}</span>
            <span className="text-x-gray text-[15px] truncate w-full text-left">@{auth.currentUser?.uid.substring(0, 6)}</span>
          </div>
          <LogOut size={20} className="text-x-gray" />
        </button>
      </div>
    </div>
  );
}
