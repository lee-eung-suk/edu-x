import React from 'react';
import { Search } from 'lucide-react';

const trendingHashtags = [
  { tag: '#초등교육', posts: '12.5K' },
  { tag: '#학급경영', posts: '8,432' },
  { tag: '#수업자료', posts: '5,210' },
  { tag: '#방학식', posts: '3,100' },
  { tag: '#교권보호', posts: '2,890' },
];

const suggestedUsers = [
  { name: '이수석', handle: '@lee_master', bio: '20년차 수석교사. 수업 노하우 공유합니다.', photo: 'https://picsum.photos/seed/lee/40/40' },
  { name: '박신규', handle: '@park_new', bio: '신규교사의 우당탕탕 생존기', photo: 'https://picsum.photos/seed/park2/40/40' },
  { name: '최에듀', handle: '@choi_edu', bio: '에듀테크 활용 수업 연구', photo: 'https://picsum.photos/seed/choi/40/40' },
];

export default function Explore() {
  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-x-border p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-x-gray w-5 h-5" />
          <input
            type="text"
            placeholder="검색"
            className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-x-blue focus:bg-white transition-colors"
          />
        </div>
      </header>

      <div className="border-b border-x-border">
        <h2 className="text-xl font-bold p-4">나를 위한 트렌드</h2>
        {trendingHashtags.map((item, index) => (
          <div key={index} className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="text-xs text-x-gray mb-1">{index + 1} · 대한민국 트렌드</div>
            <div className="font-bold text-[15px]">{item.tag}</div>
            <div className="text-xs text-x-gray mt-1">{item.posts} posts</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold p-4">팔로우 추천</h2>
        {suggestedUsers.map((user, index) => (
          <div key={index} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full" />
              <div>
                <div className="font-bold text-[15px] hover:underline">{user.name}</div>
                <div className="text-x-gray text-[15px]">{user.handle}</div>
              </div>
            </div>
            <button className="bg-x-black text-white font-bold rounded-full px-4 py-1.5 text-sm hover:bg-gray-800 transition-colors">
              팔로우
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
