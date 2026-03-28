import React, { useState } from 'react';
import { Search, Settings, Edit, Image, Smile, Send } from 'lucide-react';

const dummyChats = [
  { id: '1', name: '김선생', handle: '@kim_t', photo: 'https://picsum.photos/seed/kim/40/40', lastMessage: '내일 회의 자료 준비되셨나요?', time: '오전 10:30', unread: 2 },
  { id: '2', name: '박교사', handle: '@park_edu', photo: 'https://picsum.photos/seed/park/40/40', lastMessage: '감사합니다!', time: '어제', unread: 0 },
  { id: '3', name: '최에듀', handle: '@choi_edu', photo: 'https://picsum.photos/seed/choi/40/40', lastMessage: '이번 주말 연수 같이 가실래요?', time: '3월 25일', unread: 0 },
];

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  const activeChat = dummyChats.find(c => c.id === selectedChat);

  return (
    <div className="flex h-screen border-x border-x-border max-w-[990px] w-full bg-white">
      {/* Left Sidebar - Chat List */}
      <div className={`w-full md:w-[390px] border-r border-x-border flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-x-black">쪽지</h1>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Settings className="w-5 h-5 text-x-black" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Edit className="w-5 h-5 text-x-black" />
            </button>
          </div>
        </header>

        <div className="p-4 border-b border-x-border">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-x-gray w-5 h-5" />
            <input
              type="text"
              placeholder="쪽지 검색"
              className="w-full bg-gray-100 rounded-full py-2 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-x-blue focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {dummyChats.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 flex gap-3 cursor-pointer transition-colors ${selectedChat === chat.id ? 'bg-gray-100 border-r-2 border-x-blue' : 'hover:bg-gray-50'}`}
            >
              <img src={chat.photo} alt={chat.name} className="w-12 h-12 rounded-full" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1 truncate">
                    <span className="font-bold text-[15px] truncate">{chat.name}</span>
                    <span className="text-x-gray text-[15px] truncate">{chat.handle}</span>
                  </div>
                  <span className="text-x-gray text-xs whitespace-nowrap">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-[15px] truncate ${chat.unread > 0 ? 'text-x-black font-medium' : 'text-x-gray'}`}>
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="bg-x-blue text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar - Chat Window */}
      <div className={`flex-1 flex flex-col ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-x-border p-4 flex items-center gap-4">
              <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current text-x-black"><g><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></g></svg>
              </button>
              <img src={activeChat.photo} alt={activeChat.name} className="w-8 h-8 rounded-full" />
              <div>
                <h2 className="font-bold text-[18px] leading-tight">{activeChat.name}</h2>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {/* Dummy Messages */}
              <div className="flex justify-center my-4">
                <span className="text-xs text-x-gray bg-gray-100 px-3 py-1 rounded-full">2026년 3월 25일</span>
              </div>
              <div className="flex gap-3">
                <img src={activeChat.photo} alt={activeChat.name} className="w-10 h-10 rounded-full" />
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[70%]">
                  <p className="text-[15px]">{activeChat.lastMessage}</p>
                </div>
              </div>
              <div className="flex gap-3 flex-row-reverse">
                <div className="bg-x-blue text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[70%]">
                  <p className="text-[15px]">네, 확인했습니다. 내일 뵙겠습니다!</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-x-border">
              <div className="bg-gray-100 rounded-2xl flex items-center px-4 py-2">
                <button className="p-2 hover:bg-gray-200 rounded-full transition-colors text-x-blue">
                  <Image className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="새 쪽지 작성"
                  className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-[15px] outline-none"
                />
                <button className="p-2 hover:bg-gray-200 rounded-full transition-colors text-x-blue">
                  <Smile className="w-5 h-5" />
                </button>
                <button 
                  disabled={!messageText.trim()}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-x-blue disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-3xl font-bold mb-2">메시지 선택</h2>
            <p className="text-x-gray mb-6">기존 대화에서 선택하거나 새 대화를 시작하세요.</p>
            <button className="bg-x-blue text-white font-bold rounded-full px-8 py-3 hover:bg-x-blue-hover transition-colors text-[17px]">
              새 쪽지 작성
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
