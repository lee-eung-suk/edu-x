import React from 'react';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import TweetBox from './TweetBox';
import Feed from './Feed';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
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
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-x-border p-4 cursor-pointer">
            <h1 className="text-xl font-bold text-x-black">홈</h1>
          </header>
          <TweetBox />
          <Feed />
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
