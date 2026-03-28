import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Heart, Share, FileText, MoreHorizontal, Repeat2, BarChart2, Bookmark, Calendar, MapPin, Edit2, Trash2, Pin, Link as LinkIcon, Code, EyeOff, UserX, VolumeX } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { auth, db } from '../firebase';
import { doc, updateDoc, increment, setDoc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Post({ post, user }: { post: any, user?: any, key?: any }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || post.likes || 0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { bookmarks, toggleBookmark } = useStore();

  const isBookmarked = bookmarks.includes(post.id);
  const isAuthor = auth.currentUser?.uid === (post.authorId || post.userId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    if (!auth.currentUser || !post.id) return;
    if (window.confirm('게시글을 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'posts', post.id));
        toast.success('게시글이 삭제되었습니다.');
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error('게시글 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleAction = (actionName: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    toast(`${actionName} 기능은 준비 중입니다.`, { icon: '🛠️' });
  };

  React.useEffect(() => {
    const checkLike = async () => {
      if (!auth.currentUser || !post.id) return;
      const likeRef = doc(db, 'likes', `${auth.currentUser.uid}_${post.id}`);
      const likeSnap = await getDoc(likeRef);
      if (likeSnap.exists()) {
        setIsLiked(true);
      }
    };
    checkLike();
  }, [post.id]);

  const handleLike = async () => {
    if (!auth.currentUser) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    if (!post.id) {
       // Handle dummy data like
       setIsLiked(!isLiked);
       setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
       return;
    }

    const likeRef = doc(db, 'likes', `${auth.currentUser.uid}_${post.id}`);
    const postRef = doc(db, 'posts', post.id);

    try {
      if (isLiked) {
        await deleteDoc(likeRef);
        await updateDoc(postRef, { likesCount: increment(-1) });
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        await setDoc(likeRef, {
          userId: auth.currentUser.uid,
          postId: post.id,
          createdAt: serverTimestamp()
        });
        await updateDoc(postRef, { likesCount: increment(1) });
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error updating like:", error);
      toast.error('오류가 발생했습니다.');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    toast.success('링크가 복사되었습니다!');
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!auth.currentUser) {
      toast.error('로그인이 필요합니다.');
      return;
    }
    toggleBookmark(post.id);
    if (isBookmarked) {
      toast.success('북마크에서 제거되었습니다.');
    } else {
      toast.success('북마크에 추가되었습니다.');
    }
  };

  const navigateToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    const userId = post.authorId || post.userId;
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  const authorName = user?.name || post.authorName;
  const authorPhoto = user?.photoURL || post.authorPhoto;
  const authorHandle = user?.handle || `@${(post.authorId || post.userId || '').substring(0, 6)}`;

  return (
    <article className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer border-b border-x-border flex gap-3">
      <img
        src={authorPhoto || `https://ui-avatars.com/api/?name=${authorName}&background=random`}
        alt={authorName}
        onClick={navigateToProfile}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0 hover:brightness-90 transition-all cursor-pointer"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 truncate text-[15px]">
            <span onClick={navigateToProfile} className="font-bold text-x-black hover:underline truncate cursor-pointer">{authorName}</span>
            <span onClick={navigateToProfile} className="text-x-gray truncate cursor-pointer">{authorHandle}</span>
            <span className="text-x-gray">·</span>
            <span className="text-x-gray hover:underline whitespace-nowrap">
              {post.createdAt ? formatDistanceToNow(post.createdAt instanceof Date ? post.createdAt : post.createdAt.toDate(), { addSuffix: false, locale: ko }).replace('약 ', '') : '방금'}
            </span>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
              className="text-x-gray hover:text-x-blue hover:bg-x-blue/10 p-2 rounded-full transition-colors -mr-2"
            >
              <MoreHorizontal size={18} />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-gray-100 z-50 py-2 overflow-hidden">
                {isAuthor ? (
                  <>
                    <button onClick={handleAction('게시글 수정')} className="w-full flex items-center gap-3 px-4 py-3 text-left text-[15px] font-bold text-x-black hover:bg-gray-50 transition-colors">
                      <Edit2 size={18} className="text-x-gray" />
                      게시글 수정
                    </button>
                    <button onClick={handleDelete} className="w-full flex items-center gap-3 px-4 py-3 text-left text-[15px] font-bold text-[#f4212e] hover:bg-gray-50 transition-colors">
                      <Trash2 size={18} className="text-[#f4212e]" />
                      게시글 삭제
                    </button>
                    <button onClick={handleAction('프로필에 고정하기')} className="w-full flex items-center gap-3 px-4 py-3 text-left text-[15px] font-bold text-x-black hover:bg-gray-50 transition-colors">
                      <Pin size={18} className="text-x-gray" />
                      프로필에 고정하기
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleAction('이 게시글 숨기기')} className="w-full flex items-center gap-3 px-4 py-3 text-left text-[15px] font-bold text-x-black hover:bg-gray-50 transition-colors">
                      <EyeOff size={18} className="text-x-gray" />
                      이 게시글 숨기기
                    </button>
                    <button onClick={handleAction('작성자 차단하기')} className="w-full flex items-center gap-3 px-4 py-3 text-left text-[15px] font-bold text-x-black hover:bg-gray-50 transition-colors">
                      <UserX size={18} className="text-x-gray" />
                      {authorHandle} 차단하기
                    </button>
                    <button onClick={handleAction('작성자 뮤트하기')} className="w-full flex items-center gap-3 px-4 py-3 text-left text-[15px] font-bold text-x-black hover:bg-gray-50 transition-colors">
                      <VolumeX size={18} className="text-x-gray" />
                      {authorHandle} 뮤트하기
                    </button>
                  </>
                )}
                <div className="h-[1px] bg-gray-100 my-1"></div>
                <button onClick={(e) => { e.stopPropagation(); setShowDropdown(false); handleShare(); }} className="w-full flex items-center gap-3 px-4 py-3 text-left text-[15px] font-bold text-x-black hover:bg-gray-50 transition-colors">
                  <LinkIcon size={18} className="text-x-gray" />
                  링크 복사
                </button>
                <button onClick={handleAction('게시글 퍼가기')} className="w-full flex items-center gap-3 px-4 py-3 text-left text-[15px] font-bold text-x-black hover:bg-gray-50 transition-colors">
                  <Code size={18} className="text-x-gray" />
                  게시글 퍼가기
                </button>
                {isAuthor && (
                  <button onClick={handleAction('트윗 분석 보기')} className="w-full flex items-center gap-3 px-4 py-3 text-left text-[15px] font-bold text-x-black hover:bg-gray-50 transition-colors">
                    <BarChart2 size={18} className="text-x-gray" />
                    트윗 분석 보기
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {post.text && (
          <p className="text-x-black mt-0.5 whitespace-pre-wrap text-[15px] leading-normal">
            {String(post.text)}
          </p>
        )}

        {(post.date || post.location) && (
          <div className="flex flex-wrap gap-3 mt-3">
            {post.date && (
              <div className="flex items-center gap-1.5 text-x-blue text-sm">
                <Calendar size={16} />
                <span>{post.date}</span>
              </div>
            )}
            {post.location && (
              <div className="flex items-center gap-1.5 text-x-blue text-sm">
                <MapPin size={16} />
                <span>{post.location}</span>
              </div>
            )}
          </div>
        )}

        {post.imageUrl && (
          <div className="mt-3 rounded-2xl overflow-hidden border border-x-border max-h-[500px]">
            <img src={post.imageUrl} alt="Post attachment" className="w-full h-full object-cover" />
          </div>
        )}

        {post.fileUrl && (
          <a
            href={post.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-3 bg-x-light-gray text-x-blue p-3 rounded-2xl border border-x-border hover:bg-gray-200 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <FileText size={24} className="flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-[15px] text-x-black">{post.fileName}</p>
              <p className="text-[13px] text-x-gray">첨부파일 다운로드</p>
            </div>
          </a>
        )}

        <div className="flex items-center justify-between mt-3 text-x-gray max-w-[425px]">
          <button className="flex items-center gap-1 hover:text-x-blue group transition-colors">
            <div className="p-2 rounded-full group-hover:bg-x-blue/10 transition-colors">
              <MessageCircle size={18} />
            </div>
            <span className="text-[13px]">{post.commentsCount || post.comments || 0}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-[#00ba7c] group transition-colors">
            <div className="p-2 rounded-full group-hover:bg-[#00ba7c]/10 transition-colors">
              <Repeat2 size={18} />
            </div>
            <span className="text-[13px]">{post.retweets || 0}</span>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleLike(); }}
            className={`flex items-center gap-1 group transition-colors ${isLiked ? 'text-[#f91880]' : 'hover:text-[#f91880]'}`}
          >
            <div className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-[#f91880]/10' : 'group-hover:bg-[#f91880]/10'}`}>
              <Heart size={18} className={isLiked ? 'fill-current' : ''} />
            </div>
            <span className="text-[13px]">{likesCount}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-x-blue group transition-colors">
            <div className="p-2 rounded-full group-hover:bg-x-blue/10 transition-colors">
              <BarChart2 size={18} />
            </div>
            <span className="text-[13px]">{post.views || 0}</span>
          </button>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleBookmark}
              className={`p-2 rounded-full hover:bg-x-blue/10 transition-colors ${isBookmarked ? 'text-x-blue' : 'hover:text-x-blue'}`}
            >
              <Bookmark size={18} className={isBookmarked ? 'fill-current' : ''} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleShare(); }}
              className="p-2 rounded-full hover:bg-x-blue/10 hover:text-x-blue transition-colors"
            >
              <Share size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
