import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import TweetBox from './TweetBox';
import Feed from './Feed';
import Profile from './Profile';
import Explore from './Explore';
import Notifications from './Notifications';
import Messages from './Messages';
import Bookmarks from './Bookmarks';
import Settings from './Settings';
import { Toaster } from 'react-hot-toast';

function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-x-border p-4 cursor-pointer">
        <h1 className="text-xl font-bold text-x-black">홈</h1>
      </header>
      <TweetBox />
      <Feed />
    </>
  );
}

export default function Layout() {
  const location = useLocation();

  // Determine header title based on route for Profile page
  const isProfile = location.pathname.startsWith('/profile');

  return (
    <div className="min-h-screen bg-white text-x-black font-sans flex justify-center selection:bg-x-blue/20 selection:text-x-black">
      <Toaster position="bottom-center" toastOptions={{
        style: { background: '#1d9bf0', color: '#fff', borderRadius: '100px' },
      }} />
      <div className="flex w-full max-w-[1265px] justify-between">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 min-w-0 border-x border-x-border max-w-[600px] bg-white">
          {isProfile && (
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-x-border p-4 flex items-center gap-6">
              <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current text-x-black"><g><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></g></svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-x-black">프로필</h1>
              </div>
            </header>
          )}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
