import React, { useState, useRef, useEffect } from 'react';
import { Image, FileText, Smile, Calendar, MapPin, X } from 'lucide-react';
import { auth, db, storage } from '../firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';
import { useStore } from '../store/useStore';

export default function TweetBox() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useStore();

  // Popup states
  const [activePopup, setActivePopup] = useState<'emoji' | 'calendar' | 'location' | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [locationInput, setLocationInput] = useState('');
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setActivePopup(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const onEmojiClick = (emojiObject: any) => {
    setText(prev => prev + emojiObject.emoji);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationInput.trim()) {
      setSelectedLocation(locationInput.trim());
      setActivePopup(null);
      setLocationInput('');
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
        authorName: currentUser?.name || user.displayName || '익명 교사',
        authorHandle: currentUser?.handle || `@${user.uid.substring(0, 6)}`,
        authorPhoto: currentUser?.photoURL || user.photoURL || '',
        text: text.trim(),
        imageUrl,
        fileUrl,
        fileName,
        date: selectedDate,
        location: selectedLocation,
        createdAt: serverTimestamp(),
        likesCount: 0,
        commentsCount: 0,
        bookmarksCount: 0
      });

      setText('');
      removeFile();
      setSelectedDate('');
      setSelectedLocation('');
      toast.success('게시글이 등록되었습니다!', { id: toastId });
    } catch (error) {
      console.error('Error adding document: ', error);
      toast.error('업로드 실패. 다시 시도해주세요.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const togglePopup = (popup: 'emoji' | 'calendar' | 'location') => {
    setActivePopup(prev => prev === popup ? null : popup);
  };

  return (
    <div className="border-b border-x-border p-4 bg-white flex gap-4 relative">
      <img
        src={currentUser?.photoURL || auth.currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.name || auth.currentUser?.displayName || 'T'}&background=random`}
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

        {/* Selected Date/Location Indicators */}
        {(selectedDate || selectedLocation) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedDate && (
              <div className="flex items-center gap-1 bg-blue-50 text-x-blue px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                <Calendar size={14} />
                <span>{selectedDate}</span>
                <button type="button" onClick={() => setSelectedDate('')} className="ml-1 hover:text-blue-700">
                  <X size={14} />
                </button>
              </div>
            )}
            {selectedLocation && (
              <div className="flex items-center gap-1 bg-blue-50 text-x-blue px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                <MapPin size={14} />
                <span>{selectedLocation}</span>
                <button type="button" onClick={() => setSelectedLocation('')} className="ml-1 hover:text-blue-700">
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}

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

        <div className="flex items-center justify-between pt-3 border-t border-x-border mt-2 relative">
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
            <button 
              type="button" 
              onClick={() => togglePopup('emoji')}
              className={`p-2 hover:bg-x-blue/10 rounded-full transition-colors ${activePopup === 'emoji' ? 'bg-x-blue/10' : ''}`} 
              disabled={isUploading}
              title="이모티콘"
            >
              <Smile size={20} />
            </button>
            <button 
              type="button" 
              onClick={() => togglePopup('calendar')}
              className={`p-2 hover:bg-x-blue/10 rounded-full transition-colors ${activePopup === 'calendar' ? 'bg-x-blue/10' : ''}`} 
              disabled={isUploading}
              title="일정"
            >
              <Calendar size={20} />
            </button>
            <button 
              type="button" 
              onClick={() => togglePopup('location')}
              className={`p-2 hover:bg-x-blue/10 rounded-full transition-colors ${activePopup === 'location' ? 'bg-x-blue/10' : ''}`} 
              disabled={isUploading}
              title="위치"
            >
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

          {/* Popups */}
          {activePopup && (
            <div ref={popupRef} className="absolute top-full left-0 mt-2 z-50">
              {activePopup === 'emoji' && (
                <div className="shadow-xl rounded-xl overflow-hidden border border-x-border">
                  <EmojiPicker onEmojiClick={onEmojiClick} width={320} height={400} />
                </div>
              )}
              
              {activePopup === 'calendar' && (
                <div className="bg-white shadow-xl rounded-xl border border-x-border p-4 w-64">
                  <h3 className="font-bold mb-3 text-x-black">날짜 선택</h3>
                  <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-x-blue"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setActivePopup(null);
                    }}
                  />
                </div>
              )}

              {activePopup === 'location' && (
                <div className="bg-white shadow-xl rounded-xl border border-x-border p-4 w-72">
                  <h3 className="font-bold mb-3 text-x-black">위치 검색</h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="예: 서울시 강남구"
                      className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-x-blue text-sm"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleLocationSubmit(e);
                        }
                      }}
                    />
                    <button 
                      type="button"
                      onClick={handleLocationSubmit}
                      className="bg-x-black text-white px-3 py-1.5 rounded-md text-sm font-bold hover:bg-gray-800"
                    >
                      확인
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
