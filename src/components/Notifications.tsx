import React from 'react';
import { useStore } from '../store/useStore';
import { Heart, Repeat2, UserPlus } from 'lucide-react';

export default function Notifications() {
  const { notifications, markNotificationRead } = useStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-8 h-8 text-pink-500 fill-current" />;
      case 'retweet': return <Repeat2 className="w-8 h-8 text-green-500" />;
      case 'follow': return <UserPlus className="w-8 h-8 text-x-blue fill-current" />;
      default: return null;
    }
  };

  const getMessage = (type: string, name: string) => {
    switch (type) {
      case 'like': return <span className="text-[15px]"><span className="font-bold">{name}</span>님이 회원님의 게시글을 마음에 들어합니다.</span>;
      case 'retweet': return <span className="text-[15px]"><span className="font-bold">{name}</span>님이 회원님의 게시글을 재게시했습니다.</span>;
      case 'follow': return <span className="text-[15px]"><span className="font-bold">{name}</span>님이 회원님을 팔로우하기 시작했습니다.</span>;
      default: return null;
    }
  };

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-x-border p-4">
        <h1 className="text-xl font-bold text-x-black">알림</h1>
      </header>

      <div className="flex border-b border-x-border">
        <button className="flex-1 py-4 font-bold text-[15px] hover:bg-gray-100 transition-colors relative">
          전체
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-x-blue rounded-full"></div>
        </button>
        <button className="flex-1 py-4 font-medium text-x-gray text-[15px] hover:bg-gray-100 transition-colors">
          인증됨
        </button>
        <button className="flex-1 py-4 font-medium text-x-gray text-[15px] hover:bg-gray-100 transition-colors">
          멘션
        </button>
      </div>

      <div>
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-x-gray">알림이 없습니다.</div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              onClick={() => markNotificationRead(notif.id)}
              className={`p-4 border-b border-x-border flex gap-3 cursor-pointer transition-colors ${notif.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50/50 hover:bg-blue-50'}`}
            >
              <div className="w-10 flex justify-end pt-1">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <img src={notif.sourceUser.photoURL} alt={notif.sourceUser.name} className="w-8 h-8 rounded-full mb-2" />
                {getMessage(notif.type, notif.sourceUser.name)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
