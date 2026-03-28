import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { currentUser, updateCurrentUser } = useStore();
  const [name, setName] = useState(currentUser?.name || '');
  const [handle, setHandle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegex = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣_]+$/;
  const isHandleValid = handle.trim() === '' || handleRegex.test(handle);
  const isFormValid = name.trim() !== '' && handle.trim() !== '' && isHandleValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    if (!handle.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    if (!handleRegex.test(handle)) {
      setError('닉네임은 영문, 숫자, 한글, 밑줄(_)만 사용할 수 있습니다.');
      return;
    }

    setLoading(true);
    try {
      const formattedHandle = handle.startsWith('@') ? handle : `@${handle}`;
      
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        try {
          await updateDoc(userRef, {
            name: name.trim(),
            handle: formattedHandle,
          });
        } catch (dbError) {
          console.error('Firestore update failed, but proceeding with local state:', dbError);
          // If Firestore fails (e.g., due to rules), we still proceed to let the user use the app
        }

        updateCurrentUser({
          name: name.trim(),
          handle: formattedHandle,
        });
        
        onComplete();
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('프로필 업데이트 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-center mb-6">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-10 h-10 fill-current text-x-black">
            <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g>
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">프로필 설정</h2>
        <p className="text-gray-500 text-center mb-6">에듀 엑스에서 사용할 이름과 닉네임을 설정해주세요.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">표시 이름 (Name)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-x-blue focus:border-transparent"
              placeholder="예: 김선생님"
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">닉네임 (@Handle)</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500 pointer-events-none">@</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className={`w-full border ${!isHandleValid ? 'border-red-500' : 'border-gray-300'} rounded-md pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-x-blue focus:border-transparent`}
                placeholder="teacher_kim"
                maxLength={15}
              />
            </div>
            <p className={`text-xs mt-1 ${!isHandleValid ? 'text-red-500' : 'text-gray-500'}`}>
              영문, 숫자, 한글, 밑줄(_)만 사용 가능합니다.
            </p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full bg-x-black text-white font-bold rounded-full py-3 mt-6 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '저장 중...' : '시작하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
