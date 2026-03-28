import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../firebase';
import Post from './Post';
import { dummyPosts, dummyUsers } from '../dummyData';

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Merge Firebase posts with dummy posts for demonstration
      const mergedPosts = [...postsData, ...dummyPosts].sort((a: any, b: any) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : a.createdAt;
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : b.createdAt;
        return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
      });
      
      setPosts(mergedPosts);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching posts:", error);
      // Fallback to dummy data on error
      setPosts(dummyPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-x-blue"></div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-x-border">
      {posts.length === 0 ? (
        <div className="p-8 text-center text-x-gray text-[15px]">
          아직 작성된 게시글이 없습니다. 첫 번째 글을 남겨보세요!
        </div>
      ) : (
        posts.map((post) => {
          // Find dummy user if it's a dummy post
          const dummyUser = dummyUsers.find(u => u.uid === post.userId);
          return <Post key={post.id} post={post} user={dummyUser} />;
        })
      )}
    </div>
  );
}
