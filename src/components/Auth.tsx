import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Auth() {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || 'Teacher',
          email: user.email,
          photoURL: user.photoURL || '',
          role: 'teacher',
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row items-center justify-center max-w-[1400px] mx-auto p-4 md:p-8">
      {/* Left side - Logo */}
      <div className="flex-1 flex items-center justify-center w-full py-8 md:py-0">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-20 h-20 md:w-[350px] md:h-[350px] fill-current text-x-black">
          <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g>
        </svg>
      </div>

      {/* Right side - Login */}
      <div className="flex-1 flex flex-col justify-center items-center md:items-start w-full max-w-[600px] px-4 md:px-12">
        <h1 className="text-[50px] md:text-[64px] font-bold text-x-black mb-8 tracking-tight leading-tight text-center md:text-left">
          edu x
        </h1>
        <h2 className="text-[24px] md:text-[31px] font-bold text-x-black mb-8 text-center md:text-left">
          초등교사들을 위한 소통의 공간
        </h2>
        
        <div className="max-w-[300px] w-full">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-full py-2.5 px-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors mb-2"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Google 계정으로 가입하기
          </button>
          
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-x-black text-[15px]">또는</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center bg-x-blue rounded-full py-2.5 px-4 text-white font-bold hover:bg-x-blue-hover transition-colors mb-6"
          >
            계정 만들기
          </button>

          <p className="text-[11px] text-x-gray mb-12">
            가입하시려면 <a href="#" className="text-x-blue hover:underline">쿠키 사용</a>을 포함해 <a href="#" className="text-x-blue hover:underline">이용약관</a>과 <a href="#" className="text-x-blue hover:underline">개인정보 처리방침</a>에 동의해야 합니다.
          </p>

          <h3 className="text-[17px] font-bold text-x-black mb-4">이미 계정이 있으신가요?</h3>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-full py-2.5 px-4 text-x-blue font-bold hover:bg-blue-50 transition-colors"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
