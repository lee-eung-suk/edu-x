import React from 'react';
import { useStore } from '../store/useStore';
import Post from './Post';

export default function Bookmarks() {
  const { bookmarks, posts } = useStore();
  
  // Filter posts that are bookmarked
  const bookmarkedPosts = posts.filter(post => bookmarks.includes(post.id));

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-x-border p-4">
        <h1 className="text-xl font-bold text-x-black">북마크</h1>
        <p className="text-sm text-x-gray">@{useStore.getState().currentUser?.handle?.replace('@', '')}</p>
      </header>

      <div>
        {bookmarkedPosts.length === 0 ? (
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-2">북마크에 추가된 트윗이 없습니다</h2>
            <p className="text-x-gray">나중에 다시 보고 싶은 트윗을 북마크에 추가하세요.</p>
          </div>
        ) : (
          bookmarkedPosts.map(post => (
            <Post key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
