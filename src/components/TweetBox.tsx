import React, { useState, useRef } from 'react';
import { Image, FileText, Smile, Calendar, MapPin, X } from 'lucide-react';
import { auth, db, storage } from '../firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export default function TweetBox() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    const user = auth.currentUser;
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('게시글 업로드 중...');

    try {
      let imageUrl = '';
      let fileUrl = '';
      let fileName = '';

      if (file) {
        const fileExtension = file.name.split('.').pop();
        const uniqueFileName = `${uuidv4()}.${fileExtension}`;
        const storageRef = ref(storage, `uploads/${user.uid}/${uniqueFileName}`);
        
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);

        if (file.type.startsWith('image/')) {
          imageUrl = downloadUrl;
        } else {
          fileUrl = downloadUrl;
          fileName = file.name;
        }
      }

      const newPostRef = doc(collection(db, 'posts'));
      await setDoc(newPostRef, {
        id: newPostRef.id,
        authorId: user.uid,
        authorName: user.displayName || '익명 교사',
        authorPhoto: user.photoURL || '',
        text: text.trim(),
        imageUrl,
        fileUrl,
        fileName,
        createdAt: serverTimestamp(),
        likesCount: 0,
        commentsCount: 0
      });

      setText('');
      removeFile();
      toast.success('게시글이 등록되었습니다!', { id: toastId });
    } catch (error) {
      console.error('Error adding document: ', error);
      toast.error('업로드 실패. 다시 시도해주세요.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-b border-x-border p-4 bg-white flex gap-4">
      <img
        src={auth.currentUser?.photoURL || `https://ui-avatars.com/api/?name=${auth.currentUser?.displayName || 'T'}&background=random`}
        alt="Profile"
        className="w-10 h-10 rounded-full object-cover cursor-pointer hover:brightness-90 transition-all"
      />
      <form onSubmit={handleSubmit} className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="무슨 일이 일어나고 있나요?"
          className="w-full bg-transparent text-[20px] placeholder-x-gray border-none focus:ring-0 resize-none min-h-[50px] py-2 outline-none"
          disabled={isUploading}
        />

        {file && (
          <div className="relative mb-4 inline-block w-full">
            {file.type.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Upload preview"
                className="max-h-80 w-full rounded-2xl object-cover border border-x-border"
              />
            ) : (
              <div className="flex items-center gap-2 bg-x-light-gray text-x-blue p-3 rounded-xl border border-x-border">
                <FileText size={20} />
                <span className="font-medium truncate">{file.name}</span>
              </div>
            )}
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white rounded-full p-1.5 hover:bg-black/60 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-x-border mt-2">
          <div className="flex gap-0 text-x-blue">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-x-blue/10 rounded-full transition-colors"
              disabled={isUploading}
              title="미디어"
            >
              <Image size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.hwp,.doc,.docx,.ppt,.pptx"
            />
            <button type="button" className="p-2 hover:bg-x-blue/10 rounded-full transition-colors" disabled={isUploading}>
              <Smile size={20} />
            </button>
            <button type="button" className="p-2 hover:bg-x-blue/10 rounded-full transition-colors" disabled={isUploading}>
              <Calendar size={20} />
            </button>
            <button type="button" className="p-2 hover:bg-x-blue/10 rounded-full transition-colors" disabled={isUploading}>
              <MapPin size={20} />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={(!text.trim() && !file) || isUploading}
            className="bg-x-blue hover:bg-x-blue-hover text-white font-bold py-1.5 px-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[15px]"
          >
            게시하기
          </button>
        </div>
      </form>
    </div>
  );
}
