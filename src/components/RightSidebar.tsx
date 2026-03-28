import React from 'react';
import { Search, MoreHorizontal } from 'lucide-react';

export default function RightSidebar() {
  const trends = [
    { category: '대한민국에서 트렌드 중', title: '초등교사', posts: '12.4K' },
    { category: '교육 · 트렌드', title: '에듀테크', posts: '8,234' },
    { category: '트렌드', title: '새학기 준비', posts: '5,142' },
    { category: '일상 · 트렌드', title: '퇴근길', posts: '21.9K' },
  ];

  const suggestedUsers = [
    { name: '김교사', handle: '@kim_teacher' },
    { name: '이수석', handle: '@lee_master' },
    { name: '박연구', handle: '@park_edu' },
  ];

  return (
    <div className="w-[350px] h-screen sticky top-0 p-4 hidden lg:block">
      <div className="relative mb-4 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-x-gray group-focus-within:text-x-blue">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="검색"
          className="w-full bg-x-light-gray text-x-black rounded-full py-3 pl-12 pr-4 focus:outline-none focus:bg-white focus:ring-1 focus:ring-x-blue focus:border-x-blue transition-all border border-transparent text-[15px]"
        />
      </div>

      <div className="bg-[#f7f9f9] rounded-2xl pt-3 pb-1 mb-4 border border-[#f7f9f9]">
        <h2 className="text-[20px] font-bold text-x-black mb-3 px-4">나를 위한 트렌드</h2>
        {trends.map((trend, index) => (
          <div key={index} className="hover:bg-black/[0.03] px-4 py-2.5 cursor-pointer transition-colors relative">
            <p className="text-[13px] text-x-gray flex justify-between">
              <span>{trend.category}</span>
              <button className="hover:text-x-blue hover:bg-x-blue/10 p-1.5 rounded-full -mt-1.5 -mr-1.5 transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </p>
            <p className="font-bold text-x-black text-[15px] mt-0.5">{trend.title}</p>
            <p className="text-[13px] text-x-gray mt-0.5">{trend.posts} posts</p>
          </div>
        ))}
        <button className="w-full text-left text-x-blue hover:bg-black/[0.03] p-4 rounded-b-2xl transition-colors text-[15px]">
          더 보기
        </button>
      </div>

      <div className="bg-[#f7f9f9] rounded-2xl pt-3 pb-1 border border-[#f7f9f9]">
        <h2 className="text-[20px] font-bold text-x-black mb-3 px-4">팔로우 추천</h2>
        {suggestedUsers.map((user, index) => (
          <div key={index} className="flex items-center justify-between hover:bg-black/[0.03] px-4 py-3 cursor-pointer transition-colors">
            <div className="flex items-center gap-3 truncate">
              <img
                src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover hover:brightness-90 transition-all"
              />
              <div className="truncate">
                <p className="font-bold text-x-black text-[15px] hover:underline truncate">{user.name}</p>
                <p className="text-[15px] text-x-gray truncate">{user.handle}</p>
              </div>
            </div>
            <button className="bg-x-black hover:bg-gray-800 text-white text-[14px] font-bold py-1.5 px-4 rounded-full transition-colors ml-2">
              팔로우
            </button>
          </div>
        ))}
        <button className="w-full text-left text-x-blue hover:bg-black/[0.03] p-4 rounded-b-2xl transition-colors text-[15px]">
          더 보기
        </button>
      </div>
      
      <div className="mt-4 px-4 text-[13px] text-x-gray flex flex-wrap gap-x-3 gap-y-1">
        <a href="#" className="hover:underline">이용약관</a>
        <a href="#" className="hover:underline">개인정보 처리방침</a>
        <a href="#" className="hover:underline">쿠키 정책</a>
        <a href="#" className="hover:underline">접근성</a>
        <a href="#" className="hover:underline">광고 정보</a>
        <a href="#" className="hover:underline">더 보기 ...</a>
        <span>© 2026 EduTweet Corp.</span>
      </div>
    </div>
  );
}
