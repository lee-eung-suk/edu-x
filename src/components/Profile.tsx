import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { dummyUsers, dummyPosts } from '../dummyData';
import Post from './Post';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser, updateCurrentUser } = useStore();

  // Edit Profile State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editHandle, setEditHandle] = useState('');
  const [editBio, setEditBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const targetUserId = userId === 'me' ? auth.currentUser?.uid : userId;
  const isCurrentUser = auth.currentUser?.uid === targetUserId;

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        if (isCurrentUser && currentUser) {
          setUser(currentUser);
          setEditName(currentUser.name);
          setEditHandle(currentUser.handle.replace('@', ''));
          setEditBio(currentUser.bio || '');
        } else {
          // 1. Check if it's a dummy user
          const foundDummyUser = dummyUsers.find(u => u.uid === targetUserId || u.handle.replace('@', '') === targetUserId);
          
          if (foundDummyUser) {
            setUser(foundDummyUser);
            setPosts(dummyPosts.filter(p => p.userId === foundDummyUser.uid));
            setLoading(false);
            return;
          }

          // 2. Check Firebase user
          if (targetUserId) {
            const userRef = doc(db, 'users', targetUserId);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
              const userData = userSnap.data();
              setUser({
                uid: userData.uid,
                name: userData.name,
                handle: userData.handle || `@${userData.uid.substring(0, 6)}`,
                photoURL: userData.photoURL || `https://ui-avatars.com/api/?name=${userData.name}&background=random`,
                bio: userData.bio || '초등교사입니다.',
                followers: userData.followers || 0,
                following: userData.following || 0,
              });
            } else {
              setUser(null);
            }
          }
        }

        // Fetch user's posts
        if (targetUserId) {
          const q = query(collection(db, 'posts'), where('authorId', '==', targetUserId));
          const querySnapshot = await getDocs(q);
          const userPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Sort by createdAt descending
          userPosts.sort((a: any, b: any) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
          });
          
          setPosts(userPosts);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [targetUserId, isCurrentUser, currentUser]);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    const handleRegex = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣_]+$/;
    if (!handleRegex.test(editHandle)) {
      toast.error('닉네임은 영문, 숫자, 한글, 밑줄(_)만 사용할 수 있습니다.');
      return;
    }

    setIsSaving(true);
    try {
      const formattedHandle = editHandle.startsWith('@') ? editHandle : `@${editHandle}`;
      const userRef = doc(db, 'users', auth.currentUser.uid);
      
      try {
        await updateDoc(userRef, {
          name: editName.trim(),
          handle: formattedHandle,
          bio: editBio.trim(),
        });
      } catch (dbError) {
        console.error('Firestore update failed, but proceeding with local state:', dbError);
        // Proceed with local state update even if Firestore fails
      }

      updateCurrentUser({
        name: editName.trim(),
        handle: formattedHandle,
        bio: editBio.trim(),
      });

      toast.success('프로필이 업데이트되었습니다.');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('프로필 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-x-blue"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="p-4 text-center text-x-gray">사용자를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex flex-col">
      {/* Profile Header */}
      <div className="relative h-48 bg-gray-200">
        {/* Cover Image Placeholder */}
      </div>
      
      <div className="px-4 pb-4 relative">
        <div className="flex justify-between items-start">
          <img 
            src={user.photoURL} 
            alt={user.name} 
            className="w-32 h-32 rounded-full border-4 border-white -mt-16 bg-white object-cover"
          />
          {!isCurrentUser ? (
            <button 
              onClick={toggleFollow}
              className={`mt-4 px-4 py-1.5 rounded-full font-bold transition-colors ${
                isFollowing 
                  ? 'bg-white text-x-black border border-gray-300 hover:bg-red-50 hover:text-red-500 hover:border-red-500' 
                  : 'bg-x-black text-white hover:bg-gray-800'
              }`}
            >
              {isFollowing ? '팔로잉' : '팔로우'}
            </button>
          ) : (
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="mt-4 px-4 py-1.5 rounded-full font-bold transition-colors bg-white text-x-black border border-gray-300 hover:bg-gray-50"
            >
              프로필 수정
            </button>
          )}
        </div>
        
        <div className="mt-3">
          <h2 className="text-xl font-bold text-x-black">{user.name}</h2>
          <p className="text-x-gray">{user.handle}</p>
        </div>
        
        <div className="mt-3 text-x-black">
          <p>{user.bio}</p>
        </div>
        
        <div className="mt-3 flex gap-4 text-sm">
          <div className="flex gap-1">
            <span className="font-bold text-x-black">{user.following}</span>
            <span className="text-x-gray">팔로우 중</span>
          </div>
          <div className="flex gap-1">
            <span className="font-bold text-x-black">{user.followers + (isFollowing ? 1 : 0)}</span>
            <span className="text-x-gray">팔로워</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-x-border mt-4">
        <div className="flex-1 text-center py-4 font-bold text-x-black border-b-4 border-x-blue cursor-pointer hover:bg-gray-100 transition-colors">
          게시물
        </div>
        <div className="flex-1 text-center py-4 font-medium text-x-gray cursor-pointer hover:bg-gray-100 transition-colors">
          답글
        </div>
        <div className="flex-1 text-center py-4 font-medium text-x-gray cursor-pointer hover:bg-gray-100 transition-colors">
          미디어
        </div>
        <div className="flex-1 text-center py-4 font-medium text-x-gray cursor-pointer hover:bg-gray-100 transition-colors">
          마음에 들어요
        </div>
      </div>

      {/* Posts */}
      <div className="divide-y divide-x-border">
        {posts.map(post => (
          <Post 
            key={post.id} 
            post={post} 
            // Pass user data to override post's author info if it's a dummy post
            user={dummyUsers.find(u => u.uid === post.userId) ? {
              name: user.name,
              photoURL: user.photoURL,
              handle: user.handle
            } : undefined}
          />
        ))}
        {posts.length === 0 && (
          <div className="p-8 text-center text-x-gray">
            아직 게시물이 없습니다.
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-[600px] shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-x-border">
              <div className="flex items-center gap-6">
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current text-x-black"><g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg>
                </button>
                <h2 className="text-xl font-bold">프로필 수정</h2>
              </div>
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving || !editName.trim() || !editHandle.trim() || !/^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣_]+$/.test(editHandle)}
                className="bg-x-black text-white font-bold rounded-full px-4 py-1.5 text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? '저장 중...' : '저장'}
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              <div className="relative">
                <label className="absolute top-2 left-3 text-xs text-x-gray">이름</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md pt-6 pb-2 px-3 focus:outline-none focus:ring-2 focus:ring-x-blue focus:border-transparent"
                  maxLength={50}
                />
              </div>

              <div className="relative">
                <label className="absolute top-2 left-3 text-xs text-x-gray">닉네임</label>
                <div className="relative">
                  <span className="absolute left-3 top-[26px] text-x-black">@</span>
                  <input
                    type="text"
                    value={editHandle}
                    onChange={(e) => setEditHandle(e.target.value)}
                    className="w-full border border-gray-300 rounded-md pt-6 pb-2 pl-7 pr-3 focus:outline-none focus:ring-2 focus:ring-x-blue focus:border-transparent"
                    maxLength={15}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="absolute top-2 left-3 text-xs text-x-gray">자기소개</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full border border-gray-300 rounded-md pt-6 pb-2 px-3 focus:outline-none focus:ring-2 focus:ring-x-blue focus:border-transparent resize-none h-24"
                  maxLength={160}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
