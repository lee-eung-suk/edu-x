import React, { useState } from 'react';
import { MessageCircle, Heart, Share, FileText, MoreHorizontal, Repeat2, BarChart2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { auth, db } from '../firebase';
import { doc, updateDoc, increment, setDoc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Post({ post }: { post: any }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);

  React.useEffect(() => {
    const checkLike = async () => {
      if (!auth.currentUser) return;
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

  return (
    <article className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer border-b border-x-border flex gap-3">
      <img
        src={post.authorPhoto || `https://ui-avatars.com/api/?name=${post.authorName}&background=random`}
        alt={post.authorName}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0 hover:brightness-90 transition-all"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 truncate text-[15px]">
            <span className="font-bold text-x-black hover:underline truncate">{post.authorName}</span>
            <span className="text-x-gray truncate">@{post.authorId.substring(0, 6)}</span>
            <span className="text-x-gray">·</span>
            <span className="text-x-gray hover:underline whitespace-nowrap">
              {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: false, locale: ko }).replace('약 ', '') : '방금'}
            </span>
          </div>
          <button className="text-x-gray hover:text-x-blue hover:bg-x-blue/10 p-2 rounded-full transition-colors -mr-2">
            <MoreHorizontal size={18} />
          </button>
        </div>

        <p className="text-x-black mt-0.5 whitespace-pre-wrap text-[15px] leading-normal">
          {post.text}
        </p>

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
            <span className="text-[13px]">{post.commentsCount || 0}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-[#00ba7c] group transition-colors">
            <div className="p-2 rounded-full group-hover:bg-[#00ba7c]/10 transition-colors">
              <Repeat2 size={18} />
            </div>
            <span className="text-[13px]">0</span>
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
            <span className="text-[13px]">0</span>
          </button>
          <div className="flex items-center gap-1">
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
